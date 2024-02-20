//
//  Item.swift
//  crowd-feed
//
//  Created by Samhith Kakarla on 2/20/24.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}
