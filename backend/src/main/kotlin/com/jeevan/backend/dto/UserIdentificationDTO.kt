package com.jeevan.backend.dto

data class UserIdentificationRequest(
    val aadhaarNumber: String? = null,
    val panNumber: String? = null,
    val abhaNumber: String? = null
)

data class UserIdentificationResponse(
    val aadhaarNumber: String? = null,
    val panNumber: String? = null,
    val abhaNumber: String? = null
) 