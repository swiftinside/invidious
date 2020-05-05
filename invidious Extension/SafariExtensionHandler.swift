//
//  SafariExtensionHandler.swift
//  invidious Extension
//
//  Created by Francesco Pierfederici on 22/04/2020.
//  Copyright © 2020 Francesco Pierfederici. All rights reserved.
//

import SafariServices

// func getActivePage(completionHandler: @escaping (SFSafariPage?) -> Void) {
//     SFSafariApplication.getActiveWindow {$0?.getActiveTab {$0?.getActivePage(completionHandler: completionHandler)}}
// }

class SafariExtensionHandler: SFSafariExtensionHandler {
    var selectedInstanceUrl = kDefaultInstanceUrl

    override init() {
        super.init()

        // Shared Preferences
        if let sharedUserDefaults = UserDefaults(suiteName: kPreferencesSuiteName),
            let url = sharedUserDefaults.string(forKey: kSelectedUrlKey) {
            self.selectedInstanceUrl = url
        }
    }

    // func notifyScriptOfSelectedInstance() {
    //     getActivePage {
    //         $0?.dispatchMessageToScript(withName: kInstanceMessageTopic,
    //                                     userInfo: [kSelectedUrlKey: self.selectedInstanceUrl])
    //     }
    // }

    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String: Any]?) {
        if messageName != kPageLoadingTopic {
            return
        }

        // If we are here is because the page script just told us that they are ready.
        // We need to send them the currently active instance URL
        page.getPropertiesWithCompletionHandler {_ in
            page.dispatchMessageToScript(withName: kInstanceMessageTopic,
                                         userInfo: [kSelectedUrlKey: self.selectedInstanceUrl])
        }
    }

    override func messageReceivedFromContainingApp(withName messageName: String, userInfo: [String: Any]? = nil) {
        print("Extension - got message from app titled \(messageName): '\(String(describing: userInfo))'")

        if let url = userInfo?[kSelectedUrlKey] as? String {
            self.selectedInstanceUrl = url
            // self.notifyScriptOfSelectedInstance()
        }
    }
}
