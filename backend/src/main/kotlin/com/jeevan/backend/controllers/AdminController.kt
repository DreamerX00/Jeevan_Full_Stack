package com.jeevan.backend.controllers

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/admin")
class AdminController {

    @GetMapping("/dashboard")
    fun getAdminDashboard(): String {
        return "Welcome, Admin! You have full access."
    }
}
