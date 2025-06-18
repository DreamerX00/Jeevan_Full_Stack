package com.jeevan.backend.services

import com.jeevan.backend.dto.UserIdentificationRequest
import com.jeevan.backend.dto.UserIdentificationResponse
import com.jeevan.backend.models.User
import com.jeevan.backend.models.UserIdentification
import com.jeevan.backend.repository.UserIdentificationRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserIdentificationService(
    private val userIdentificationRepository: UserIdentificationRepository
) {
    @Transactional
    fun createOrUpdateIdentification(user: User, request: UserIdentificationRequest): UserIdentificationResponse {
        val existingIdentification = userIdentificationRepository.findByUser(user)
        
        val identification = if (existingIdentification.isPresent) {
            // Update existing identification
            val current = existingIdentification.get()
            val updated = current.copy(
                aadhaarNumber = request.aadhaarNumber ?: current.aadhaarNumber,
                panNumber = request.panNumber ?: current.panNumber,
                abhaNumber = request.abhaNumber ?: current.abhaNumber,
                updatedAt = java.time.LocalDateTime.now()
            )
            userIdentificationRepository.save(updated)
        } else {
            // Create new identification
            val newIdentification = UserIdentification(
                user = user,
                aadhaarNumber = request.aadhaarNumber,
                panNumber = request.panNumber,
                abhaNumber = request.abhaNumber
            )
            userIdentificationRepository.save(newIdentification)
        }
        
        return UserIdentificationResponse(
            aadhaarNumber = identification.aadhaarNumber,
            panNumber = identification.panNumber,
            abhaNumber = identification.abhaNumber
        )
    }
    
    fun getIdentification(user: User): UserIdentificationResponse {
        val identification = userIdentificationRepository.findByUser(user)
            .orElseThrow { NoSuchElementException("Identification not found for user") }
            
        return UserIdentificationResponse(
            aadhaarNumber = identification.aadhaarNumber,
            panNumber = identification.panNumber,
            abhaNumber = identification.abhaNumber
        )
    }
} 