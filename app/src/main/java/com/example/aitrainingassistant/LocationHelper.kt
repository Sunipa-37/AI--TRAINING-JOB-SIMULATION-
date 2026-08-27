package com.example.aitrainingassistant

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import android.os.Looper
import androidx.core.content.ContextCompat

object LocationHelper {

    fun hasPermission(context: Context): Boolean {
        return ContextCompat.checkSelfPermission(
            context, Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED ||
                ContextCompat.checkSelfPermission(
                    context, Manifest.permission.ACCESS_COARSE_LOCATION
                ) == PackageManager.PERMISSION_GRANTED
    }

    /**
     * Only ever called AFTER the user has explicitly granted the runtime
     * permission dialog. Falls back to null lat/lng (never crashes, never
     * silently retries in the background) if no fix arrives within the
     * timeout or providers are disabled.
     */
    fun getLastKnownOrSingleUpdate(
        context: Context,
        timeoutMs: Long = 6000L,
        onResult: (Location?) -> Unit
    ) {
        if (!hasPermission(context)) {
            onResult(null)
            return
        }

        val lm = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager

        // Try a cached fix first — fastest path for a live demo.
        val cached = try {
            lm.getProviders(true)
                .mapNotNull { provider -> lm.getLastKnownLocation(provider) }
                .maxByOrNull { it.time }
        } catch (e: SecurityException) {
            null
        }

        if (cached != null) {
            onResult(cached)
            return
        }

        // No cached fix — request a single fresh update with a timeout.
        var delivered = false
        val listener = object : LocationListener {
            override fun onLocationChanged(location: Location) {
                if (!delivered) {
                    delivered = true
                    lm.removeUpdates(this)
                    onResult(location)
                }
            }

            @Deprecated("Deprecated in Java")
            override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
            override fun onProviderEnabled(provider: String) {}
            override fun onProviderDisabled(provider: String) {}
        }

        try {
            val provider = when {
                lm.isProviderEnabled(LocationManager.GPS_PROVIDER) -> LocationManager.GPS_PROVIDER
                lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER) -> LocationManager.NETWORK_PROVIDER
                else -> null
            }

            if (provider == null) {
                onResult(null)
                return
            }

            lm.requestLocationUpdates(provider, 0L, 0f, listener, Looper.getMainLooper())
        } catch (e: SecurityException) {
            onResult(null)
            return
        }

        // Timeout fallback so the demo never hangs on stage.
        android.os.Handler(Looper.getMainLooper()).postDelayed({
            if (!delivered) {
                delivered = true
                lm.removeUpdates(listener)
                onResult(null)
            }
        }, timeoutMs)
    }
}
