package com.example.aitrainingassistant

import android.app.ActivityManager
import android.content.Context
import android.content.res.Configuration
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import android.os.Environment
import android.os.StatFs
import android.os.SystemClock
import android.provider.Settings
import java.util.TimeZone

data class ExtendedDeviceInfo(
    val securityPatch: String,
    val isAdbEnabled: Boolean,
    val isVpnActive: Boolean,
    val screenResolution: String,
    val totalRamGb: Double,
    val availableStorageGb: Double,
    val systemUptimeHours: Long,
    val timeZone: String,
    val isDarkMode: Boolean,
)

object ExtendedDeviceInfoCollector {

    fun collect(context: Context): ExtendedDeviceInfo {
        return ExtendedDeviceInfo(
            securityPatch = getSecurityPatch(),
            isAdbEnabled = isAdbEnabled(context),
            isVpnActive = isVpnActive(context),
            screenResolution = getScreenResolution(context),
            totalRamGb = getTotalRamGb(context),
            availableStorageGb = getAvailableStorageGb(),
            systemUptimeHours = getSystemUptimeHours(),
            timeZone = getTimeZone(),
            isDarkMode = isDarkMode(context),
        )
    }

    private fun getSecurityPatch(): String {
        return Build.VERSION.SECURITY_PATCH ?: "Unknown"
    }

    private fun isAdbEnabled(context: Context): Boolean {
        return try {
            Settings.Global.getInt(
                context.contentResolver,
                Settings.Global.ADB_ENABLED, 0
            ) == 1
        } catch (e: Exception) {
            false
        }
    }

    private fun isVpnActive(context: Context): Boolean {
        val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = cm.activeNetwork ?: return false
        val capabilities = cm.getNetworkCapabilities(network) ?: return false
        return capabilities.hasTransport(NetworkCapabilities.TRANSPORT_VPN)
    }

    private fun getScreenResolution(context: Context): String {
        val metrics = context.resources.displayMetrics
        return "${metrics.widthPixels}x${metrics.heightPixels}"
    }

    private fun getTotalRamGb(context: Context): Double {
        val am = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val memInfo = ActivityManager.MemoryInfo()
        am.getMemoryInfo(memInfo)
        return memInfo.totalMem / (1024.0 * 1024.0 * 1024.0)
    }

    private fun getAvailableStorageGb(): Double {
        val stat = StatFs(Environment.getDataDirectory().path)
        val availableBytes = stat.availableBlocksLong * stat.blockSizeLong
        return availableBytes / (1024.0 * 1024.0 * 1024.0)
    }

    private fun getSystemUptimeHours(): Long {
        return SystemClock.elapsedRealtime() / (1000 * 60 * 60)
    }

    private fun getTimeZone(): String {
        return TimeZone.getDefault().id
    }

    private fun isDarkMode(context: Context): Boolean {
        val nightModeFlags = context.resources.configuration.uiMode and
                Configuration.UI_MODE_NIGHT_MASK
        return nightModeFlags == Configuration.UI_MODE_NIGHT_YES
    }
}