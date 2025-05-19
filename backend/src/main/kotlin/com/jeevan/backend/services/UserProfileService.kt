package com.jeevan.backend.services

import com.jeevan.backend.dto.UserProfileRequest
import com.jeevan.backend.dto.UserProfileResponse
import com.jeevan.backend.models.User
import com.jeevan.backend.models.UserProfile
import com.jeevan.backend.repositories.UserProfileRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class UserProfileService(
    private val userProfileRepository: UserProfileRepository
) {
    fun getUserProfile(user: User): UserProfileResponse {
        val profileOptional = userProfileRepository.findByUser(user)
        
        return if (profileOptional.isPresent) {
            val profile = profileOptional.get()
            mapToResponse(profile)
        } else {
            UserProfileResponse(userId = user.id, message = "Profile not found")
        }
    }
    
    fun createOrUpdateProfile(user: User, request: UserProfileRequest): UserProfileResponse {
        val existingProfile = userProfileRepository.findByUser(user)
        
        val profile = if (existingProfile.isPresent) {
            // Update existing profile
            val current = existingProfile.get()
            val updated = current.copy(
                firstName = request.firstName ?: current.firstName,
                lastName = request.lastName ?: current.lastName,
                dateOfBirth = request.dateOfBirth ?: current.dateOfBirth,
                gender = request.gender ?: current.gender,
                bloodGroup = request.bloodGroup ?: current.bloodGroup,
                height = request.height ?: current.height,
                weight = request.weight ?: current.weight,
                phone = request.phone ?: current.phone,
                address = request.address ?: current.address,
                emergencyContact = request.emergencyContact ?: current.emergencyContact,
                allergies = request.allergies?.joinToString(",") ?: current.allergies,
                medicalConditions = request.medicalConditions?.joinToString(",") ?: current.medicalConditions,
                medications = request.medications?.joinToString(",") ?: current.medications,
                updatedAt = LocalDateTime.now()
            )
            userProfileRepository.save(updated)
        } else {
            // Create new profile
            val newProfile = UserProfile(
                user = user,
                firstName = request.firstName,
                lastName = request.lastName,
                dateOfBirth = request.dateOfBirth,
                gender = request.gender,
                bloodGroup = request.bloodGroup,
                height = request.height,
                weight = request.weight,
                phone = request.phone,
                address = request.address,
                emergencyContact = request.emergencyContact,
                allergies = request.allergies?.joinToString(","),
                medicalConditions = request.medicalConditions?.joinToString(","),
                medications = request.medications?.joinToString(",")
            )
            userProfileRepository.save(newProfile)
        }
        
        return mapToResponse(profile, "Profile saved successfully")
    }
    
    private fun mapToResponse(profile: UserProfile, message: String? = null): UserProfileResponse {
        return UserProfileResponse(
            id = profile.id,
            userId = profile.user.id,
            firstName = profile.firstName,
            lastName = profile.lastName,
            dateOfBirth = profile.dateOfBirth,
            gender = profile.gender,
            bloodGroup = profile.bloodGroup,
            height = profile.height,
            weight = profile.weight,
            phone = profile.phone,
            address = profile.address,
            emergencyContact = profile.emergencyContact,
            allergies = profile.allergies?.split(",")?.filter { it.isNotBlank() },
            medicalConditions = profile.medicalConditions?.split(",")?.filter { it.isNotBlank() },
            medications = profile.medications?.split(",")?.filter { it.isNotBlank() },
            message = message
        )
    }
} 