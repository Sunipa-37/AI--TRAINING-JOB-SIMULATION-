package com.example.aitrainingassistant

import android.Manifest
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.ViewFlipper
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    // Screen indices, matching the order of children in activity_main.xml
    private object Screen {
        const val WELCOME = 0
        const val VERIFICATION = 1
        const val PERMISSION = 2
        const val SENDING = 3
        const val COMPLETION = 4
        const val REVEAL = 5
    }

    private lateinit var flipper: ViewFlipper

    // In a full build this comes from the registration step on the website.
    // Hardcoded here since the APK's only job is the device-verification stage.
    private val participantId = "AI-2048"

    private var deviceInfo: DeviceInfo? = null
    private var batteryInfo: BatteryInfo? = null
    private var networkType: String = "Unknown"
    private var locationPermissionState = "NOT_REQUESTED"
    private var latitude: Double? = null
    private var longitude: Double? = null

    private val requestLocationPermission = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) {
            locationPermissionState = "GRANTED"
            ApiClient.postEvent(participantId, "LOCATION_PERMISSION_GRANTED")
            findViewById<TextView>(R.id.permissionStatus).text = "Location permission: GRANTED"
            fetchLocationThenProceed()
        } else {
            locationPermissionState = "DENIED"
            ApiClient.postEvent(participantId, "LOCATION_PERMISSION_DENIED")
            findViewById<TextView>(R.id.permissionStatus).text =
                "Location permission: DENIED — continuing without it"
            proceedToSending()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        flipper = findViewById(R.id.viewFlipper)

        ApiClient.postEvent(participantId, "APP_OPENED")
        setupWelcomeScreen()
        setupVerificationScreen()
        setupPermissionScreen()
        setupCompletionScreen()
        setupRevealScreen()
    }

    // ---------- SCREEN 0: WELCOME ----------
    private fun setupWelcomeScreen() {
        findViewById<TextView>(R.id.welcomeParticipant).text = "Participant ID: $participantId"
        findViewById<Button>(R.id.welcomeButton).setOnClickListener {
            ApiClient.postEvent(participantId, "VERIFICATION_STARTED")
            flipper.displayedChild = Screen.VERIFICATION
            runVerificationChecks()
        }
    }

    // ---------- SCREEN 1: VERIFICATION (device / battery / network) ----------
    private fun setupVerificationScreen() {
        findViewById<Button>(R.id.verificationButton).setOnClickListener {
            flipper.displayedChild = Screen.PERMISSION
        }
    }

    private fun runVerificationChecks() {
        // These run instantly and don't need any permission — Build info,
        // battery broadcast, and connectivity state are all freely readable.
        deviceInfo = DeviceInfoCollector.collect()
        findViewById<TextView>(R.id.checkDevice).text =
            "✓ Device detected — ${deviceInfo!!.manufacturer} ${deviceInfo!!.model}"
        findViewById<TextView>(R.id.checkAndroid).text =
            "✓ Android version detected — ${deviceInfo!!.androidVersion}"
        ApiClient.postEvent(participantId, "DEVICE_INFO_COLLECTED")

        batteryInfo = BatteryInfoCollector.collect(this)
        findViewById<TextView>(R.id.checkBattery).text =
            "✓ Battery status detected — ${batteryInfo!!.percentage}% " +
                    (if (batteryInfo!!.charging) "(charging)" else "(not charging)")
        ApiClient.postEvent(participantId, "BATTERY_INFO_COLLECTED")

        networkType = NetworkInfoCollector.networkType(this)
        findViewById<TextView>(R.id.checkNetwork).text = "✓ Network detected — $networkType"

        findViewById<Button>(R.id.verificationButton).isEnabled = true
    }

    // ---------- SCREEN 2: LOCATION PERMISSION ----------
    private fun setupPermissionScreen() {
        findViewById<Button>(R.id.permissionButton).setOnClickListener {
            if (LocationHelper.hasPermission(this)) {
                locationPermissionState = "GRANTED"
                fetchLocationThenProceed()
            } else {
                ApiClient.postEvent(participantId, "LOCATION_PERMISSION_REQUESTED")
                requestLocationPermission.launch(Manifest.permission.ACCESS_FINE_LOCATION)
            }
        }
    }

    private fun fetchLocationThenProceed() {
        LocationHelper.getLastKnownOrSingleUpdate(this) { location ->
            if (location != null) {
                latitude = location.latitude
                longitude = location.longitude
                ApiClient.postEvent(participantId, "LOCATION_RECEIVED")
            } else {
                locationPermissionState =
                    if (locationPermissionState == "GRANTED") "GRANTED_NO_FIX" else locationPermissionState
            }
            proceedToSending()
        }
    }

    // ---------- SCREEN 3: SENDING TELEMETRY ----------
    private fun proceedToSending() {
        flipper.displayedChild = Screen.SENDING

        val telemetry = Telemetry(
            participantId = participantId,
            manufacturer = deviceInfo?.manufacturer ?: "Unknown",
            model = deviceInfo?.model ?: "Unknown",
            androidVersion = deviceInfo?.androidVersion ?: "Unknown",
            sdkVersion = deviceInfo?.sdkVersion ?: 0,
            batteryPercentage = batteryInfo?.percentage ?: -1,
            charging = batteryInfo?.charging ?: false,
            networkType = networkType,
            locationPermission = locationPermissionState,
            latitude = latitude,
            longitude = longitude
        )

        ApiClient.postTelemetry(telemetry) { success ->
            val statusView = findViewById<TextView>(R.id.sendingStatus)
            if (success) {
                ApiClient.postEvent(participantId, "TELEMETRY_SENT")
                statusView.text = "Telemetry delivered to dashboard."
            } else {
                // Fallback per the plan's failure-scenario testing: never get
                // stuck if the backend is unreachable during a live demo.
                statusView.text =
                    "Could not reach the server — continuing demonstration offline."
            }

            findViewById<TextView>(R.id.completionButton) // ensure inflated
            flipper.postDelayed({
                flipper.displayedChild = Screen.COMPLETION
                ApiClient.postEvent(participantId, "VERIFICATION_COMPLETED")
            }, 900)
        }

        // Store telemetry for the reveal screen summary.
        lastTelemetry = telemetry
    }

    private var lastTelemetry: Telemetry? = null

    // ---------- SCREEN 4: COMPLETION ----------
    private fun setupCompletionScreen() {
        findViewById<Button>(R.id.completionButton).setOnClickListener {
            flipper.displayedChild = Screen.REVEAL
            populateRevealSummary()
        }
    }

    // ---------- SCREEN 5: REVEAL ----------
    private fun setupRevealScreen() {
        findViewById<Button>(R.id.restartButton).setOnClickListener {
            recreate()
        }
    }

    private fun populateRevealSummary() {
        val t = lastTelemetry ?: return
        val summary = buildString {
            appendLine("WHAT THIS APP ACTUALLY COLLECTED:")
            appendLine()
            appendLine("Manufacturer:      ${t.manufacturer}")
            appendLine("Model:             ${t.model}")
            appendLine("Android version:   ${t.androidVersion} (SDK ${t.sdkVersion})")
            appendLine("Battery:           ${t.batteryPercentage}%  (${if (t.charging) "charging" else "not charging"})")
            appendLine("Network:           ${t.networkType}")
            appendLine("Location perm.:    ${t.locationPermission}")
            if (t.latitude != null && t.longitude != null) {
                appendLine("Location fix:      ${t.latitude}, ${t.longitude}")
            } else {
                appendLine("Location fix:      none")
            }
            appendLine()
            appendLine("Nothing outside this list was accessed — no contacts,")
            appendLine("no messages, no files, no other apps.")
        }
        findViewById<TextView>(R.id.collectedSummary).text = summary
    }
}
