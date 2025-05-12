package com.jeevan.backend.dto

import java.time.LocalDateTime

data class AppointmentRequest(
    val userId: Long,
    val doctorId: Long,
    val appointmentDate: LocalDateTime,
    val reason: String,
    val notes: String?
)

data class AppointmentResponse(
    val id: Long,
    val userId: Long,
    val doctorId: Long,
    val appointmentDate: LocalDateTime,
    val reason: String,
    val notes: String?,
    val status: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) 