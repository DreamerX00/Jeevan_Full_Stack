package com.jeevan.backend.controller

import com.jeevan.backend.dto.AuthResponse
import com.jeevan.backend.dto.ForgotPasswordRequest
import com.jeevan.backend.dto.LoginRequest
import com.jeevan.backend.dto.RegisterRequest
import com.jeevan.backend.dto.ResetPasswordRequest
import com.jeevan.backend.services.AuthService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<AuthResponse> {
        val response = authService.register(request)
        
        // If there's an error, return a bad request
        if (response.error != null) {
            return ResponseEntity.badRequest().body(response)
        }
        
        return ResponseEntity.ok(response)
    }

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<AuthResponse> {
        val response = authService.login(request)
        
        // If there's an error, return a bad request
        if (response.error != null) {
            return ResponseEntity.badRequest().body(response)
        }
        
        return ResponseEntity.ok(response)
    }

    @PostMapping("/forgot-password")
    fun forgotPassword(@Valid @RequestBody request: ForgotPasswordRequest): ResponseEntity<AuthResponse> {
        val response = authService.forgotPassword(request)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/reset-password")
    fun resetPassword(@Valid @RequestBody request: ResetPasswordRequest): ResponseEntity<AuthResponse> {
        val response = authService.resetPassword(request)
        
        // If there's an error, return a bad request
        if (response.error != null) {
            return ResponseEntity.badRequest().body(response)
        }
        
        return ResponseEntity.ok(response)
    }
} 