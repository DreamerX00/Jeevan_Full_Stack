package com.jeevan.backend.controller

import com.jeevan.backend.models.User
import com.jeevan.backend.repositories.UserRepository
import com.jeevan.backend.services.AuthService
import com.jeevan.backend.dto.RegisterRequest
import com.jeevan.backend.dto.LoginRequest
import com.jeevan.backend.security.JwtService
import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*
import java.util.HashMap

@RestController
@RequestMapping("/api/public/test")
class TestController(
    private val userRepository: UserRepository,
    private val jdbcTemplate: JdbcTemplate,
    private val authService: AuthService,
    private val userDetailsService: UserDetailsService,
    private val jwtService: JwtService,
    private val passwordEncoder: PasswordEncoder
) {
    
    @GetMapping("/status")
    fun getStatus(): ResponseEntity<Map<String, Any>> {
        val status = mapOf(
            "status" to "running",
            "timestamp" to System.currentTimeMillis(),
            "database" to "connected"
        )
        return ResponseEntity.ok(status)
    }
    
    @GetMapping("/users/count")
    fun getUserCount(): ResponseEntity<Map<String, Any>> {
        val count = userRepository.count()
        val response = mapOf(
            "userCount" to count,
            "message" to "Found $count users in the database"
        )
        return ResponseEntity.ok(response)
    }
    
    @GetMapping("/health")
    fun getHealthCheck(): ResponseEntity<Map<String, Any>> {
        val health = HashMap<String, Any>()
        
        // Check database connection
        try {
            val userCount = userRepository.count()
            health["database"] = "connected"
            health["userCount"] = userCount
        } catch (e: Exception) {
            health["database"] = "error: ${e.message}"
        }
        
        health["service"] = "running"
        health["version"] = "1.0.0"
        
        return ResponseEntity.ok(health)
    }
    
    @GetMapping("/schema")
    fun getDatabaseSchema(): ResponseEntity<Map<String, Any>> {
        val tables = jdbcTemplate.queryForList(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
        )
        
        val usersColumns = jdbcTemplate.queryForList(
            """
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'users'
            """
        )
        
        val dbType = jdbcTemplate.dataSource?.connection?.metaData?.databaseProductName ?: "Unknown"
        
        val response = mapOf<String, Any>(
            "tables" to tables,
            "users_table_columns" to usersColumns,
            "database_type" to dbType
        )
        
        return ResponseEntity.ok(response)
    }
    
    @GetMapping("/register-test-user")
    fun registerTestUser(): ResponseEntity<Map<String, Any>> {
        val testUser = RegisterRequest(
            email = "testuser@example.com",
            password = "password123"
        )
        
        val authResponse = authService.register(testUser)
        
        return ResponseEntity.ok(mapOf(
            "success" to (authResponse.error == null),
            "message" to (authResponse.message ?: authResponse.error ?: "Unknown error"),
            "token" to (authResponse.token ?: "No token")
        ))
    }
    
    @GetMapping("/login-test-user")
    fun loginTestUser(): ResponseEntity<Map<String, Any>> {
        val loginRequest = LoginRequest(
            email = "testuser@example.com",
            password = "password123"
        )
        
        val authResponse = authService.login(loginRequest)
        
        return ResponseEntity.ok(mapOf(
            "success" to (authResponse.error == null),
            "message" to (authResponse.message ?: authResponse.error ?: "Unknown error"),
            "token" to (authResponse.token ?: "No token")
        ))
    }
    
    @GetMapping("/dashboard-test")
    fun dashboardTest(): ResponseEntity<Map<String, Any>> {
        // First register a test user if not exists
        if (!userRepository.existsByEmail("dashboard-test@example.com")) {
            val testUser = RegisterRequest(
                email = "dashboard-test@example.com",
                password = "password123"
            )
            authService.register(testUser)
        }
        
        // Generate a JWT token for this user
        val userDetails = userDetailsService.loadUserByUsername("dashboard-test@example.com")
        val token = jwtService.generateToken(userDetails)
        
        return ResponseEntity.ok(mapOf(
            "message" to "You can use this token to access the dashboard",
            "token" to token,
            "dashboardUrl" to "/api/dashboard/info",
            "howToUse" to "Add this token to your Authorization header as 'Bearer $token'"
        ))
    }

    @PostMapping("/update-password")
    fun updateUserPassword(
        @RequestParam email: String,
        @RequestParam newPassword: String
    ): ResponseEntity<Map<String, String>> {
        val userOptional = userRepository.findByEmail(email)
        
        if (userOptional.isEmpty) {
            return ResponseEntity.badRequest().body(mapOf(
                "message" to "User not found"
            ))
        }

        val user = userOptional.get()
        val updatedUser = user.copy(
            password = passwordEncoder.encode(newPassword)
        )
        userRepository.save(updatedUser)

        return ResponseEntity.ok(mapOf(
            "message" to "Password updated successfully",
            "email" to email
        ))
    }
} 