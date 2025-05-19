package com.jeevan.backend.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HomeController {

    @GetMapping("/")
    fun home(): Map<String, String> {
        return mapOf(
            "message" to "Welcome to Jeevan Healthcare API",
            "status" to "running",
            "version" to "1.0.0"
        )
    }
    
    @GetMapping("/api")
    fun api(): Map<String, Any> {
        return mapOf(
            "message" to "Jeevan Healthcare API is running",
            "endpoints" to listOf(
                "/api/auth/register",
                "/api/auth/login",
                "/api/auth/forgot-password",
                "/api/auth/reset-password",
                "/api/dashboard/info",
                "/api/public/test/health",
                "/api/public/test/status",
                "/api/public/test/users/count",
                "/api/public/test/schema"
            ),
            "publicEndpoints" to listOf(
                "/",
                "/api",
                "/api/auth/register",
                "/api/auth/login",
                "/api/auth/forgot-password",
                "/api/public/test/health",
                "/api/public/test/status"
            )
        )
    }
} 