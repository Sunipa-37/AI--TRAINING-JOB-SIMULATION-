package com.example.aitrainingassistant

/**
 * The exact set of fields this demonstration collects.
 *
 * IMPORTANT (per the master plan): this list is intentionally short.
 * Do NOT add contacts, SMS, camera, microphone, call logs, installed-app
 * lists, or clipboard access. None of that is needed to make the point,
 * and adding it would turn a permission-awareness demo into something
 * that behaves like real spyware.
 */
data class Telemetry(
    val participantId: String,
    val manufacturer: String,
    val model: String,
    val androidVersion: String,
    val sdkVersion: Int,
    val batteryPercentage: Int,
    val charging: Boolean,
    val networkType: String,
    val locationPermission: String, // "GRANTED" | "DENIED" | "UNAVAILABLE"
    val latitude: Double?,
    val longitude: Double?
)
