package com.jeevan.backend.controllers

import com.jeevan.backend.models.Role
import com.jeevan.backend.services.AuthService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    data class AuthRequest(val email: String, val password: String, val role: Role?)

    @PostMapping("/register")
    fun register(@RequestBody request: AuthRequest): String {
        val assignedRole = request.role ?: Role.USER  // Default role is USER
        return authService.registerUser(request.email, request.password, assignedRole)
    }

    @PostMapping("/login")
    fun login(@RequestBody request: AuthRequest): String {
        return authService.loginUser(request.email, request.password)
    }
}
