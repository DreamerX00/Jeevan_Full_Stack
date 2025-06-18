package com.jeevan.backend.controller

import com.jeevan.backend.dto.UserIdentificationRequest
import com.jeevan.backend.dto.UserIdentificationResponse
import com.jeevan.backend.services.UserIdentificationService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/user/identification")
class UserIdentificationController(
    private val userIdentificationService: UserIdentificationService
) {
    @GetMapping
    fun getIdentification(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<UserIdentificationResponse> {
        val user = userDetails as com.jeevan.backend.models.User
        return ResponseEntity.ok(userIdentificationService.getIdentification(user))
    }
    
    @PostMapping
    fun updateIdentification(
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestBody request: UserIdentificationRequest
    ): ResponseEntity<UserIdentificationResponse> {
        val user = userDetails as com.jeevan.backend.models.User
        return ResponseEntity.ok(userIdentificationService.createOrUpdateIdentification(user, request))
    }
} 