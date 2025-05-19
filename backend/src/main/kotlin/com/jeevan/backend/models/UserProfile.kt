package com.jeevan.backend.models

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "user_profiles")
data class UserProfile(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    val user: User,
    
    @Column(name = "first_name")
    val firstName: String? = null,
    
    @Column(name = "last_name")
    val lastName: String? = null,
    
    @Column(name = "date_of_birth")
    val dateOfBirth: String? = null,
    
    @Column(name = "gender")
    val gender: String? = null,
    
    @Column(name = "blood_group")
    val bloodGroup: String? = null,
    
    @Column(name = "height")
    val height: Float? = null,
    
    @Column(name = "weight")
    val weight: Float? = null,
    
    @Column(name = "phone")
    val phone: String? = null,
    
    @Column(name = "address", columnDefinition = "TEXT")
    val address: String? = null,
    
    @Column(name = "emergency_contact")
    val emergencyContact: String? = null,
    
    @Column(name = "allergies", columnDefinition = "TEXT")
    val allergies: String? = null, // Comma-separated list
    
    @Column(name = "medical_conditions", columnDefinition = "TEXT")
    val medicalConditions: String? = null, // Comma-separated list
    
    @Column(name = "medications", columnDefinition = "TEXT")
    val medications: String? = null, // Comma-separated list
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
) 