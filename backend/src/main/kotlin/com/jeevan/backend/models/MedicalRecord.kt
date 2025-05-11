package com.jeevan.backend.models

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "medical_records")
data class MedicalRecord(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,
    
    @Column(nullable = false)
    val recordType: String, // e.g., "Lab Test", "Imaging", "Surgery", "Vaccination"
    
    @Column(nullable = false)
    val recordDate: LocalDateTime,
    
    @Column(nullable = false)
    val providerName: String,
    
    @Column(nullable = false, columnDefinition = "TEXT")
    val description: String,
    
    @Column(columnDefinition = "TEXT")
    val results: String? = null,
    
    @Column
    val attachmentUrl: String? = null,
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
) 