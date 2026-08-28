package com.example.aitrainingassistant

import android.util.Log
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

object ApiClient {

    // CONFIGURE ME before the demo.
    // Local LAN testing:  "http://192.168.1.10:5000"   (laptop's LAN IP, NOT localhost)
    // Real demonstration: "https://your-demo-domain.example.com"
    var BASE_URL = "http://192.168.1.10:5000"

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
        }
        postJson("/api/telemetry", body, onComplete)
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
