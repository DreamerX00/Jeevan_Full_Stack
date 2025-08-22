package com.jeevan.models

data class DiagnosticCenter(
    val id: String,
    val name: String,
    val address: String,
    val distance: String,
    val latitude: Double,
    val longitude: Double,
    val phone: String,
    val email: String,
    val website: String,
    val availableTests: List<String>
) 