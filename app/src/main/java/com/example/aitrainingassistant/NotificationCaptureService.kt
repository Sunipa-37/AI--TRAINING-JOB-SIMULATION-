package com.example.aitrainingassistant

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log

class NotificationCaptureService : NotificationListenerService() {

    override fun onListenerConnected() {
        super.onListenerConnected()

        Log.d(
            "NotificationCapture",
            "NOTIFICATION LISTENER CONNECTED"
        )
    }

    override fun onNotificationPosted(
        sbn: StatusBarNotification
    ) {
        super.onNotificationPosted(sbn)

        val extras = sbn.notification.extras

        val packageName = sbn.packageName
        val title = extras.getString("android.title")
        val text = extras
            .getCharSequence("android.text")
            ?.toString()

        Log.d(
            "NotificationCapture",
            "NOTIFICATION RECEIVED | " +
                    "Package=$packageName | " +
                    "Title=$title | " +
                    "Text=$text"
        )
    }
}