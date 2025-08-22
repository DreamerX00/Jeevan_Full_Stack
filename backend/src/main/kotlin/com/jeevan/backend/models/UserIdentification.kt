package com.jeevan.backend.models

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "user_identifications")
data class UserIdentification(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    val user: User,
    
    @Column(name = "aadhaar_number", unique = true)
    val aadhaarNumber: String? = null,
    
    @Column(name = "pan_number", unique = true)
    val panNumber: String? = null,
    
    @Column(name = "abha_number", unique = true)
    val abhaNumber: String? = null,
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
) 