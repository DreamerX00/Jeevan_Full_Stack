package com.jeevan.backend.controllers

import com.jeevan.backend.dtos.PasswordResetRequest
import com.jeevan.backend.services.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    data class AuthRequest(val email: String, val password: String)

    @PostMapping("/register")
    fun register(@RequestBody request: AuthRequest): ResponseEntity<String> {
        return authService.registerUser(request.email, request.password)
    }

    @PostMapping("/login")
    fun login(@RequestBody request: AuthRequest): ResponseEntity<Any> {
        return authService.loginUser(request.email, request.password)
    }

    @PostMapping("/forgot-password")
    fun forgotPassword(@RequestBody request: PasswordResetRequest): ResponseEntity<String> {
        return authService.forgotPassword(request.email)
    }
}

