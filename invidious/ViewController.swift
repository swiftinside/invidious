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
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.appNameLabel.stringValue = "invidious";
    }
    
    @IBAction func openSafariExtensionPreferences(_ sender: AnyObject?) {
        SFSafariApplication.showPreferencesForExtension(withIdentifier: "com.pythoninside.invidious-Extension") { error in
            if let _ = error {
                // Insert code to inform the user that something went wrong.
                print("Something went wrong")
            }
        }
    }

}
