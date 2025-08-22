package com.jeevan.utils

import android.os.Build

object NetworkUtils {
    /**
     * Detects if the app is running on an emulator
     */
    fun isRunningOnEmulator(): Boolean {
        return Build.FINGERPRINT.startsWith("generic") ||
               Build.FINGERPRINT.startsWith("unknown") ||
               Build.MODEL.contains("google_sdk") ||
               Build.MODEL.contains("Emulator") ||
               Build.MODEL.contains("Android SDK built for x86") ||
               Build.BRAND.startsWith("generic") ||
               Build.DEVICE.startsWith("generic")
    }
    
    /**
     * Returns the base URL based on device type (emulator or physical device)
     */
    fun getBaseUrl(emulatorUrl: String, deviceUrl: String): String {
        return if (isRunningOnEmulator()) emulatorUrl else deviceUrl
    }
}