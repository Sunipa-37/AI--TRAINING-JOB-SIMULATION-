package com.example.aitrainingassistant

import android.os.Build

data class DeviceInfo(
    val manufacturer: String,
    val model: String,
    val androidVersion: String,
    val sdkVersion: Int
)

object DeviceInfoCollector {
    fun collect(): DeviceInfo {
        return DeviceInfo(
            manufacturer = Build.MANUFACTURER ?: "Unknown",
            model = Build.MODEL ?: "Unknown",
            androidVersion = Build.VERSION.RELEASE ?: "Unknown",
            sdkVersion = Build.VERSION.SDK_INT
        )
    }
}
