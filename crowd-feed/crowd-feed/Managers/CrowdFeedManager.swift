//
//  CrowdFeedManager.swift
//  crowd-feed
//
//  Created by Samhith Kakarla on 3/19/24.
//

import Foundation
import CoreBluetooth

class CrowdFeedManager: NSObject, CBCentralManagerDelegate {
    var centralManager: CBCentralManager!
    var discoveredPeripherals = Set<CBPeripheral>()
    var rssiValues = [NSNumber]()
    
    override init() {
        super.init()
        centralManager = CBCentralManager(delegate: self, queue: nil)
    }
    
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        if central.state == .poweredOn {
            // Start scanning for devices
            centralManager.scanForPeripherals(withServices: nil, options: nil)
        } else {
            print("Bluetooth is not available.")
        }
    }
    
    func centralManager(
        _ central: CBCentralManager,
        didDiscover peripheral: CBPeripheral,
        advertisementData: [String: Any],
        rssi RSSI: NSNumber
    ) {
        if !discoveredPeripherals.contains(peripheral) {
            discoveredPeripherals.insert(peripheral)
            rssiValues.append(RSSI)
        }
    }
    
    
    func numberOfDetectedDevices() -> Int {
        return discoveredPeripherals.count
    }
    
    func averageDistance() -> Double? {
        guard !rssiValues.isEmpty else { return nil }

        let txPower = -59  // Adjust this value based on your device or empirical data
        let distanceValues = rssiValues.map { rssi -> Double in
            let ratio = Double(truncating: rssi) - Double(txPower)
            return pow(10, ratio / 20.0)
        }

        let sum = distanceValues.reduce(0, +)
        return sum / Double(distanceValues.count)
    }
}
