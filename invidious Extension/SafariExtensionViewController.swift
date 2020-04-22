//
//  SafariExtensionViewController.swift
//  invidious Extension
//
//  Created by Francesco Pierfederici on 22/04/2020.
//  Copyright © 2020 Francesco Pierfederici. All rights reserved.
//

import SafariServices

class SafariExtensionViewController: SFSafariExtensionViewController {
    
    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width:320, height:240)
        return shared
    }()

}
