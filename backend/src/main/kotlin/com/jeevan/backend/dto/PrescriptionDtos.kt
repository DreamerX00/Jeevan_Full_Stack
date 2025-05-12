package com.jeevan.backend.dto

import java.time.LocalDateTime

data class PrescriptionRequest(
    val userId: Long,
    val doctorId: Long,
    val medications: List<MedicationRequest>,
    val diagnosis: String,
    val notes: String?
)

data class MedicationRequest(
    val name: String,
    val dosage: String,
    val frequency: String,
    val duration: String
)

data class PrescriptionResponse(
    val id: Long,
    val userId: Long,
    val doctorId: Long,
    val medications: List<MedicationResponse>,
    val diagnosis: String,
    val notes: String?,
    val status: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class MedicationResponse(
    val id: Long,
    val name: String,
    val dosage: String,
    val frequency: String,
    val duration: String
) 