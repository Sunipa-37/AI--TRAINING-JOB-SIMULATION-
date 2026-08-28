package com.example.aitrainingassistant

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities

object NetworkInfoCollector {
    fun networkType(context: Context): String {
        val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
            ?: return "Unknown"

        val network = cm.activeNetwork ?: return "No Connection"
        val capabilities = cm.getNetworkCapabilities(network) ?: return "No Connection"

        return when {
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> "Wi-Fi"
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> "Mobile Data"
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> "Ethernet"
            else -> "No Connection"
        }
    }
}
