//
//  ViewController.swift
//  invidious
//
//  Created by Francesco Pierfederici on 22/04/2020.
//  Copyright © 2020 Francesco Pierfederici. All rights reserved.
//

import Cocoa
import SafariServices.SFSafariApplication

class ViewController: NSViewController {

    @IBOutlet var appNameLabel: NSTextField!
    @IBOutlet weak var instancePopUpButton: NSPopUpButton!
    @IBOutlet weak var extensionStatusLabel: NSTextField!
    var instanceDict = [String: String]()

    override func viewDidLoad() {
        super.viewDidLoad()
        self.appNameLabel.stringValue = kAppName

        NotificationCenter.default.addObserver(self,
                                               selector: #selector(ViewController.updateExtensionStatusUI(_:)),
                                               name: NSNotification.Name(rawValue: kExtensionStatusTopic),
                                               object: nil)

        // Preferences / Defaults handling
        //
        // We use two types of preferences and two types of defaults:
        // 1. This app preferences (and corresponding defaults) to populate the popup menu.
        // 2. Shared preferences to communicate the selected instance URL to the extension.
        //
        // The only actor writing to both preferences is this app. The extension only reads.
        //
        // The flow is as follows:
        // 1. Iff the app preferences do not exist then read defaults and use them to create
        //    the preferences plist
        // 2. Read the preferences plsit into a dictionary
        // 3. Populate the pop-up menu with the keys from the prefereces dictionary
        // 4. Do the same for the shared preferences.
        // 5. Select the item in the pop-up menu according to the "selectedInstance"
        //    key in the shared oreferences.
        //
        // a. Every time the user selects an intem in the pop-up menu, update the
        //    "selectedInstance" entry into the shared preferences.

        // Factory defaults
        self.registerDefaults()

        // Recover info on the selected instance from the global/local preferences.
        guard let dict = self.getInstanceDict() else {
            return displayPreferencesErrorAndQuit(.local)
        }
        self.instanceDict = dict

        guard let (selectedInstanceName, selectedInstanceUrl) = self.getSelectedInstanceInfo() else {
            // Ops! This should never happen: things are quite messed up?
            return displayPreferencesErrorAndQuit(.local)
        }

        self.populateInstancePopUpButton(instanceNames: Array(self.instanceDict.keys),
                                         selectedName: selectedInstanceName)

        // Shared Preferences
        guard let sharedUserDefaults = UserDefaults(suiteName: kPreferencesSuiteName) else {
            return displayPreferencesErrorAndQuit(.shared)
        }

        sharedUserDefaults.set(selectedInstanceUrl as String, forKey: kSelectedUrlKey)
        print("Shared Preferences: (over)wrote \(kSelectedNameKey) = \(selectedInstanceUrl)")
    }

    func getInstanceDict() -> [String: String]? {
        let localUserDefaults = UserDefaults.standard

        if let instanceDict = localUserDefaults.dictionary(forKey: kInstanceDictKey) as? [String: String] {
            // Cool, things look fine for now. Now grab the name of the selected instance.
            // Make sure that the instanceDict is not empty! Otherwise we have a big problem.
            if instanceDict.capacity < 1 {
                displayPreferencesErrorAndQuit(.local)
            }
            return instanceDict
        }
        return nil
    }

    func getSelectedInstanceInfo() -> (String, String)? {
        let localUserDefaults = UserDefaults.standard

        var selectedInstanceUrl = ""
        var selectedInstanceName = ""

        if let name = localUserDefaults.string(forKey: kSelectedNameKey),
            let url = self.instanceDict[name] {
            selectedInstanceUrl = url
            selectedInstanceName = name
            print("Found selected instance name in local/global preferences")
        } else {
            // Weird: either we could not find the name of the selected instance
            // or we cound not find the corresponding URL in instanceDict. We will
            // revert to the name/URL of the first instance in instanceDict.
            print("Cannot find selected instance name in local/global preferences")

            if let nameUrl = instanceDict.first {
                selectedInstanceUrl = nameUrl.value
                selectedInstanceName = nameUrl.key

                // Fix local preferences.
                localUserDefaults.set(selectedInstanceName, forKey: kSelectedNameKey)
            } else {
                return nil
            }
        }
        // Here the local preference plist is already created.

        print("Selected instance Name: \(selectedInstanceName)")
        print("Selected instance URL: \(selectedInstanceUrl)")
        return (selectedInstanceName, selectedInstanceUrl)
    }

    func registerDefaults() {
        // Some sensible defaults
        var defaults: [String: Any] = [:]

        if let defaultsPath = Bundle.main.path(forResource: kDefaultPlistName, ofType: kDefaultPlistType) {
            if let dict = NSDictionary(contentsOfFile: defaultsPath) as? [String: Any] {
                defaults.merge(dict) { (_, new) in new }
            }
        }

        // You can use this opportunity to insert any default values that need
        //  to be computed at runtime and thus can't be stored in Defaults.plist.
        let computedDefaults: [String: Any] = [:]
        defaults.merge(computedDefaults) { (_, new) in new }

        UserDefaults.standard.register(defaults: defaults)
    }

    func populateInstancePopUpButton(instanceNames: [String], selectedName: String) {
        self.instancePopUpButton.removeAllItems()
        var selectedIndex = 0
        for (index, name) in sorted(instanceNames).enumerated() {
            self.instancePopUpButton.addItem(withTitle: name)
            if name == selectedName {
                selectedIndex = index
            }
        }
        self.instancePopUpButton.selectItem(at: selectedIndex)
    }

    @IBAction func selectInstance(_ sender: NSPopUpButton) {
        if let selectedMenuItem = sender.item(at: sender.indexOfSelectedItem) {
            print("User selected instance \(selectedMenuItem)")

            // Update both the shared and local preferences.
            let selectedInstanceName = selectedMenuItem.title

            if let selectedInstanceUrl = self.instanceDict[selectedInstanceName] {
                let localUserDefaults = UserDefaults.standard

                guard let sharedUserDefaults = UserDefaults(suiteName: kPreferencesSuiteName) else {
                    return
                }

                localUserDefaults.set(selectedInstanceName, forKey: kSelectedNameKey)
                sharedUserDefaults.set(selectedInstanceUrl as String, forKey: kSelectedUrlKey)

                // Tell our friendly extension that a (new) instance was selected.
                SFSafariApplication.dispatchMessage(withName: kInstanceMessageTopic,
                                                    toExtensionWithIdentifier: kExtBundleId,
                                                    userInfo: [kSelectedUrlKey: selectedInstanceUrl],
                                                    completionHandler: self.messageCallback)
            }
            // else: we got an error: let's ignore that and hope for the best :-)
        }
    }

    func messageCallback(error: Error?) {
        if error == nil {
            print("Everything is OK")
        } else {
            print("Got an error: \(String(describing: error))")
        }
    }

    @IBAction func openSafariExtensionPreferences(_ sender: AnyObject?) {
        SFSafariApplication.showPreferencesForExtension(withIdentifier: kExtBundleId) { error in
            if error != nil {
                displayGenericErrorAndQuit()
            }
        }
    }

    @objc func updateExtensionStatusUI(_ notification: Notification) {
        guard self.extensionStatusLabel != nil else {
            return
        }

        if let enabled = notification.userInfo?["enabled"] as? Bool {
            if enabled {
                DispatchQueue.main.async {
                    self.extensionStatusLabel.stringValue = "\(kEnabledIcon) \(kEnabledString)"
                }
            } else {
                DispatchQueue.main.async {
                    self.extensionStatusLabel.stringValue = "\(kDisabledIcon) \(kDisabledString)"
                }
            }
        }
    }

}
