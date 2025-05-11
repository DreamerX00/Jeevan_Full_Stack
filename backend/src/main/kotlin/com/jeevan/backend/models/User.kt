package com.jeevan.backend.models

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @Column(nullable = false, unique = true)
    val email: String,
    
    @Column(nullable = false)
    val password: String,
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val role: UserRole = UserRole.USER,
    
    @Column(name = "reset_token")
    val resetToken: String? = null,
    
    @Column(name = "reset_token_expiry")
    val resetTokenExpiry: LocalDateTime? = null,
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

enum class UserRole {
    USER,
    ADMIN,
    DOCTOR,
    PHARMACIST
} 