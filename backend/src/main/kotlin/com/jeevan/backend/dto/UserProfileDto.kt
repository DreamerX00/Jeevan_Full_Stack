package com.jeevan.backend.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Size

data class UserProfileRequest(
    val firstName: String? = null,
    val lastName: String? = null,
    val dateOfBirth: String? = null,
    val gender: String? = null,
    val bloodGroup: String? = null,
    val height: Float? = null,
    val weight: Float? = null,
    val phone: String? = null,
    val address: String? = null,
    val emergencyContact: String? = null,
    val allergies: List<String>? = null,
    val medicalConditions: List<String>? = null,
    val medications: List<String>? = null
)

data class UserProfileResponse(
    val id: Long? = null,
    val userId: Long? = null,
    val firstName: String? = null,
    val lastName: String? = null,
    val dateOfBirth: String? = null,
    val gender: String? = null,
    val bloodGroup: String? = null,
    val height: Float? = null,
    val weight: Float? = null,
    val phone: String? = null,
    val address: String? = null,
    val emergencyContact: String? = null,
    val allergies: List<String>? = null,
    val medicalConditions: List<String>? = null,
    val medications: List<String>? = null,
    val message: String? = null,
    val error: String? = null
) 