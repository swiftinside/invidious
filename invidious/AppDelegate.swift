//
//  AppDelegate.swift
//  invidious
//
//  Created by Francesco Pierfederici on 22/04/2020.
//  Copyright © 2020 Francesco Pierfederici. All rights reserved.
//

import Cocoa
import SafariServices.SFSafariApplication

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        // pass
    }

    func applicationWillTerminate(_ aNotification: Notification) {
        // Insert code here to tear down your application
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }

    func applicationWillBecomeActive(_ notification: Notification) {
        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: kExtBundleId) { state, error in
            guard error == nil else {
                return
            }

            let enabled = state?.isEnabled ?? false
            // DispatchQueue.main.async {
            NotificationCenter.default.post(name: NSNotification.Name(rawValue: kExtensionStatusTopic),
                object: self,
                userInfo: ["enabled": enabled])
            // }
        }
    }
}
