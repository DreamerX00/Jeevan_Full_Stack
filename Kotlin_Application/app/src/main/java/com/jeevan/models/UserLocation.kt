package com.jeevan.models

data class UserLocation(
    val latitude: Double,
    val longitude: Double,
    val address: String = ""
) 