//
//  Utils.swift
//  invidious
//
//  Created by Francesco Pierfederici on 30/04/2020.
//  Copyright © 2020 Francesco Pierfederici. All rights reserved.
//

import Cocoa
import Foundation

enum PreferenceType {
    case local
    case shared
}

typealias InstanceName = String

func getPreferenceFilePath(_ preferenceType: PreferenceType) -> URL {
    var userLibraryUrl: URL
    if let url = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask).first {
        userLibraryUrl = url
    } else {
        // Strange that we could not get the actual path. Let's try something half sensible then.
        userLibraryUrl = FileManager.default.homeDirectoryForCurrentUser.appendingPathComponent("Library")
    }

    var preferencePath: URL
    guard let bundleId = Bundle.main.bundleIdentifier else {
        displayGenericErrorAndQuit()
        return userLibraryUrl                                   // This does not matter: just making the compiler happy.
    }
    switch preferenceType {
    case .local:
        preferencePath = userLibraryUrl.appendingPathComponent(
            "Containers/\(bundleId)/Data/Library/Preferences\(bundleId).plist"
        )
    case .shared:
        preferencePath = userLibraryUrl.appendingPathComponent(
            "Group Containers/\(bundleId)Group/Library/Preferences\(bundleId)Group.plist"
        )
    }
    return preferencePath
}

func displayErrorAlert(title: String, message: String) {
    let alert = NSAlert()
    alert.messageText = title
    alert.informativeText = message
    alert.alertStyle = .critical
    alert.addButton(withTitle: "Oh snap!")
    alert.runModal()
    return
}

func displayPreferencesErrorAndQuit(_ preferenceType: PreferenceType) {
    displayErrorAlert(title: "Critical Error", message: """
    It looks like the app preferences are corrupted. Please delete them. They are usually stored as
        \(getPreferenceFilePath(preferenceType))
    """)
    NSApp.terminate(nil)
}

func displayGenericErrorAndQuit() {
    displayErrorAlert(title: "Critical Error", message: "It looks like the app encountered an unexpected error.")
    NSApp.terminate(nil)
}

func sorted(_ instanceNames: [InstanceName]) -> [InstanceName] {
    // Sort the given invidious instance names appropriately. For the time being we just sort alphabetically, but it
    // would be better to sort using, e.g. geographical proximity, ping times, uptime stats etc.
    // TODO: sort instances smarter
    return instanceNames.sorted()
}
