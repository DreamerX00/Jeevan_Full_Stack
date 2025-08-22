package com.jeevan.models

data class User(
    val id: Long? = null,
    val email: String,
    val profile: UserProfile? = null
)

data class UserProfile(
    val id: Long? = null,
    val userId: Long? = null,
    val firstName: String = "",
    val lastName: String = "",
    val dateOfBirth: String = "",
    val gender: String = "",
    val bloodGroup: String = "",
    val height: Float = 0f,
    val weight: Float = 0f,
    val phone: String = "",
    val address: String = "",
    val emergencyContact: String = "",
    val allergies: List<String> = emptyList(),
    val medicalConditions: List<String> = emptyList(),
    val medications: List<String> = emptyList()
)

// Available blood groups
enum class BloodGroup(val value: String) {
    A_POSITIVE("A+"),
    A_NEGATIVE("A-"),
    B_POSITIVE("B+"),
    B_NEGATIVE("B-"),
    AB_POSITIVE("AB+"),
    AB_NEGATIVE("AB-"),
    O_POSITIVE("O+"),
    O_NEGATIVE("O-"),
    UNKNOWN("Unknown")
}

// Available genders
enum class Gender(val value: String) {
    MALE("Male"),
    FEMALE("Female"),
    OTHER("Other"),
    PREFER_NOT_TO_SAY("Prefer not to say")
}