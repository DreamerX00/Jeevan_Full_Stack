package com.jeevan.backend.dto

import java.time.LocalDateTime

data class MedicalRecordRequest(
    val diagnosis: String? = null,
    val prescription: String? = null,
    val notes: String? = null,
    val visitDate: LocalDateTime? = null,
    val doctorName: String? = null,
    val hospitalName: String? = null,
    val followUpDate: LocalDateTime? = null
)

data class MedicalRecordResponse(
    val id: Long? = null,
    val userId: Long? = null,
    val diagnosis: String? = null,
    val prescription: String? = null,
    val notes: String? = null,
    val visitDate: LocalDateTime? = null,
    val doctorName: String? = null,
    val hospitalName: String? = null,
    val followUpDate: LocalDateTime? = null,
    val createdAt: LocalDateTime? = null,
    val updatedAt: LocalDateTime? = null,
    val error: String? = null
) 