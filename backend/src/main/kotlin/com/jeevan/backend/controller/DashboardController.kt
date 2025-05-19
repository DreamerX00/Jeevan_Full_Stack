package com.jeevan.backend.controller

import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/dashboard")
class DashboardController {

    @GetMapping("/info")
    fun getDashboardInfo(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<Map<String, Any>> {
        val dashboardInfo = mapOf(
            "email" to userDetails.username,
            "greeting" to "Welcome to Jeevan Healthcare Dashboard",
            "lastLogin" to System.currentTimeMillis(),
            "quickStats" to mapOf(
                "notifications" to 3,
                "pendingAppointments" to 2,
                "medicalAlerts" to 1
            )
        )
        
        return ResponseEntity.ok(dashboardInfo)
    }
} 