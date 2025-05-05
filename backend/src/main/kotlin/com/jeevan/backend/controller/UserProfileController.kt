package com.jeevan.backend.controller

import com.jeevan.backend.dto.UserProfileRequest
import com.jeevan.backend.dto.UserProfileResponse
import com.jeevan.backend.repositories.UserRepository
import com.jeevan.backend.security.JwtService
import com.jeevan.backend.services.UserProfileService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.NoSuchElementException

@RestController
@RequestMapping("/api/user")
@PreAuthorize("isAuthenticated()")
class UserProfileController(
    private val userProfileService: UserProfileService,
    private val userRepository: UserRepository,
    private val jwtService: JwtService
) {

    @GetMapping("/profile")
    fun getUserProfile(@RequestHeader("Authorization") authHeader: String): ResponseEntity<UserProfileResponse> {
        return try {
            val token = authHeader.substring(7) // Remove "Bearer " prefix
            val email = jwtService.extractUsername(token)
            val user = userRepository.findByEmail(email)
                .orElseThrow { NoSuchElementException("User not found") }
            
            val response = userProfileService.getUserProfile(user)
            ResponseEntity.ok(response)
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(
                UserProfileResponse(error = e.message)
            )
        }
    }

    @PostMapping("/profile")
    fun createOrUpdateUserProfile(
        @RequestHeader("Authorization") authHeader: String,
        @RequestBody request: UserProfileRequest
    ): ResponseEntity<UserProfileResponse> {
        return try {
            val token = authHeader.substring(7) // Remove "Bearer " prefix
            val email = jwtService.extractUsername(token)
            val user = userRepository.findByEmail(email)
                .orElseThrow { NoSuchElementException("User not found") }
            
            val response = userProfileService.createOrUpdateProfile(user, request)
            ResponseEntity.ok(response)
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(
                UserProfileResponse(error = e.message)
            )
        }
    }
} 