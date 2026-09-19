package com.example.aitrainingassistant

data class CapturedNotification(
    val participantId: String,
    val packageName: String,
    val title: String?,
    val text: String?,
    val timestamp: Long
)