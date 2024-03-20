//
//  LoadingView.swift
//  crowd-feed
//
//  Created by Samhith Kakarla on 3/18/24.
//

import SwiftUI

struct LoadingView: View {
    var body: some View {
        ProgressView()
            .progressViewStyle(CircularProgressViewStyle(
                tint: .black
            ))
            .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

#Preview {
    LoadingView()
}
