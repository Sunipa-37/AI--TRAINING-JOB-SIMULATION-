package com.example.aitrainingassistant

import android.util.Log
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

object ApiClient {

    // CONFIGURE ME before the demo.
    // Android emulator → this PC:  "http://10.0.2.2:4000"
    // Real phone on same Wi-Fi:    "http://<your-laptop-LAN-IP>:4000"  (not localhost)
    // Real demonstration:          "https://your-demo-domain.example.com"
    var BASE_URL = "http://10.0.2.2:4000"
    private val executor = Executors.newSingleThreadExecutor()

    /** Fire-and-forget event log entry, e.g. "APP_OPENED", "LOCATION_PERMISSION_GRANTED". */
    fun postEvent(participantId: String, eventType: String) {
        val body = JSONObject().apply {
            put("participantId", participantId)
            put("eventType", eventType)
            put("timestamp", System.currentTimeMillis())
        }
        postJson("/api/events", body) { /* fire and forget */ }
    }

    /** Sends the full telemetry payload once verification completes. */
    fun postTelemetry(telemetry: Telemetry, onComplete: (success: Boolean) -> Unit) {
        val body = JSONObject().apply {
            put("participantId", telemetry.participantId)
            put("manufacturer", telemetry.manufacturer)
            put("model", telemetry.model)
            put("androidVersion", telemetry.androidVersion)
            put("sdkVersion", telemetry.sdkVersion)
            put("batteryPercentage", telemetry.batteryPercentage)
            put("charging", telemetry.charging)
            put("networkType", telemetry.networkType)
            put("locationPermission", telemetry.locationPermission)
            put("latitude", telemetry.latitude ?: JSONObject.NULL)
            put("longitude", telemetry.longitude ?: JSONObject.NULL)

            // Extended telemetry
            put("securityPatch", telemetry.securityPatch)
            put("isAdbEnabled", telemetry.isAdbEnabled)
            put("isVpnActive", telemetry.isVpnActive)
            put("screenResolution", telemetry.screenResolution)
            put("totalRamGb", telemetry.totalRamGb)
            put("availableStorageGb", telemetry.availableStorageGb)
            put("systemUptimeHours", telemetry.systemUptimeHours)
            put("timeZone", telemetry.timeZone)
            put("isDarkMode", telemetry.isDarkMode)
        }
        postJson("/api/telemetry", body, onComplete)
    }

    // Send Notification
    fun postNotification(
        notification: CapturedNotification
    ) {
        val body = JSONObject().apply {
            put("participantId", notification.participantId)
            put("packageName", notification.packageName)
            put("title", notification.title ?: JSONObject.NULL)
            put("text", notification.text ?: JSONObject.NULL)
            put("timestamp", notification.timestamp)
        }

        postJson("/api/phone-notifications", body) { success ->
            if (success) {
                Log.d(
                    "ApiClient",
                    "Notification sent successfully"
                )
            } else {
                Log.w(
                    "ApiClient",
                    "Notification send failed"
                )
            }
        }
    }

    private fun postJson(
        path: String,
        body: JSONObject,
        onComplete: (success: Boolean) -> Unit
    ) {
        executor.execute {
            var connection: HttpURLConnection? = null
            try {
                val url = URL(BASE_URL + path)
                connection = (url.openConnection() as HttpURLConnection).apply {
                    requestMethod = "POST"
                    doOutput = true
                    connectTimeout = 5000
                    readTimeout = 5000
                    setRequestProperty("Content-Type", "application/json; charset=utf-8")
                }

                OutputStreamWriter(connection.outputStream, Charsets.UTF_8).use { writer ->
                    writer.write(body.toString())
                    writer.flush()
                }

                val responseCode = connection.responseCode
                val success = responseCode in 200..299
                if (!success) {
                    Log.w("ApiClient", "POST $path failed: HTTP $responseCode")
                }

                android.os.Handler(android.os.Looper.getMainLooper()).post {
                    onComplete(success)
                }
            } catch (e: Exception) {
                Log.e("ApiClient", "POST $path error: ${e.message}")
                android.os.Handler(android.os.Looper.getMainLooper()).post {
                    onComplete(false)
                }
            } finally {
                connection?.disconnect()
            }
        }
    }
}
