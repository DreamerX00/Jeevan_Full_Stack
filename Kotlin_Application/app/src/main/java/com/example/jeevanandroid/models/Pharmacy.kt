package com.example.jeevanandroid.models

data class Pharmacy(
    val id: String,
    val name: String,
    val address: String,
    val latitude: Double,
    val longitude: Double,
    val distance: Double = 0.0, // Distance in kilometers from user
    val phone: String = "",
    val isOpen: Boolean = true,
    val rating: Float = 0.0f,
    val photoUrl: String = ""
) 