package com.jeevan.backend.models

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "prescriptions")
data class Prescription(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,
    
    @Column(nullable = false)
    val doctorName: String,
    
    @Column(nullable = false)
    val issueDate: LocalDateTime,
    
    @Column(nullable = false)
    val diagnosis: String,
    
    @Column(nullable = false, columnDefinition = "TEXT")
    val medications: String, // JSON string of medications
    
    @Column
    val instructions: String? = null,
    
    @Column
    val expiryDate: LocalDateTime? = null,
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
) 