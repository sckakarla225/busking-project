//
//  ContentView.swift
//  crowd-feed
//
//  Created by Samhith Kakarla on 2/20/24.
//

import SwiftUI
import SwiftData

struct DeviceEntry: Identifiable {
    let id = UUID()
    let time: String
    let numberOfDevices: Int
    let averageDistance: Double
}

struct ContentView: View {
    @State private var performerName: String = ""
    @State private var spotName: String = ""
    @State private var date: Date = Date()
    @State private var entries: [DeviceEntry] = [
        DeviceEntry(
            time: "5:23 PM",
            numberOfDevices: 14,
            averageDistance: 24.03
        )
    ]
    
    @State private var isLoading: Bool = false
    @State private var performerNameDisabled: Bool = false
    @State private var spotNameDisabled: Bool = false

    var body: some View {
        VStack {
            HStack {
                Image("spotlite-icon")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 50, height: 50)
                Spacer()
                Button(action: resetFields) {
                    Text("Reset")
                        .foregroundColor(.white)
                        .frame(minWidth: 0, maxWidth: 60)
                        .padding()
                        .background(Color.red)
                        .cornerRadius(10)
                        .bold()
                }
                .frame(height: 40)
            }
            VStack(alignment: .leading) {
                Text("Performer Name")
                    .padding(.top, 20)
                    .bold()
                HStack {
                    TextField("Enter Performer Name", text: $performerName)
                        .disabled(performerNameDisabled)
                    Button(action: togglePerformerName) {
                        if performerNameDisabled {
                            Text("Unlock")
                        } else {
                            Text("Lock")
                        }
                    }
                }
                Text("Spot Name")
                    .padding(.top, 20)
                    .bold()
                HStack {
                    TextField("Enter Spot Name", text: $spotName)
                        .disabled(spotNameDisabled)
                    Button(action: toggleSpotName) {
                        if spotNameDisabled {
                            Text("Unlock")
                        } else {
                            Text("Lock")
                        }
                    }
                }
                HStack {
                    DatePicker("Date", selection: $date, displayedComponents: .date)
                        .padding(.top, 20)
                        .bold()
                }
            }
            VStack {
                Button(action: getSnapshot) {
                    Text("SNAP")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(minWidth: 0, maxWidth: 150, minHeight: 60)
                        .background(Color.pink)
                        .cornerRadius(20)
                        .bold()
                }
                HStack {
                    Text("Time")
                        .bold()
                    Spacer()
                    Text("# of Devices")
                        .bold()
                    Spacer()
                    Text("Average Distance")
                        .bold()
                }
                .padding(.top, 20)
                List(entries) { entry in
                    HStack {
                        Text(entry.time)
                        Spacer()
                        Text("\(entry.numberOfDevices)")
                        Spacer()
                        Text(String(format: "%.2f m", entry.averageDistance))
                    }
                    .listRowInsets(EdgeInsets())
                    
                }
                .frame(minHeight: 50, maxHeight: 300)
                .cornerRadius(5)
                .listStyle(PlainListStyle())
                Button(action: {}) {
                    Text("Upload Media")
                }
            }
            .padding(.top, 30)
            Spacer()
        }
        .padding(.horizontal, 30)
    }
    
    func resetFields() {
        performerName = ""
        spotName = ""
        entries = []
    }
    
    func togglePerformerName() { performerNameDisabled = !performerNameDisabled }
    
    func toggleSpotName() {
        spotNameDisabled = !spotNameDisabled
    }
    
    func getSnapshot() {
        isLoading = true
        // Bluetooth device snapshot here
        isLoading = false
    }
    
    func uploadMedia() {
        
    }
}

#Preview {
    ContentView()
        .modelContainer(for: Item.self, inMemory: true)
}
