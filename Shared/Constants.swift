//
//  Constants.swift
//  invidious
//
//  Created by Francesco Pierfederici on 05/05/2020.
//  Copyright © 2020 Francesco Pierfederici. All rights reserved.
//

// Preferences / User Defaults
let kSelectedUrlKey = "InstanceURL"
let kSelectedNameKey = "SelectedInstanceName"
let kInstanceDictKey = "Instances"
let kDefaultPlistName = "Defaults"
let kDefaultPlistType = "plist"
let kAppBundleId = "com.swiftinside.invidious"
let kExtBundleId = "com.swiftinside.invidious-Extension"
let kPreferencesSuiteName = "com.swiftinside.invidiousGroup"

// Messages to/from extension and to/from script
let kInstanceMessageTopic = "instanceChanged"
let kPageLoadingTopic = "pageLoading"

// Default Values
let kDefaultInstanceUrl = "https://invidio.us"

// UI Elements
let kAppName = "invidious"
let kEnabledIcon = "👍"
let kDisabledIcon = "⚠️"
let kEnabledString = "The extension is enabled  "    // Just to make the two string equal in length
let kDisabledString = "The extension is disabled"

// Notifications
let kExtensionStatusTopic = "com.swiftinside.invidious:extensionStatusUpdated"
