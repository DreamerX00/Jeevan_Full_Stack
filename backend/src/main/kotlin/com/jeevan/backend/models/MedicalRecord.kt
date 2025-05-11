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
    
    @Column(columnDefinition = "TEXT")
    val diagnosis: String? = null,
    
    @Column(columnDefinition = "TEXT")
    val prescription: String? = null,
    
    @Column(columnDefinition = "TEXT")
    val notes: String? = null,
    
    @Column(name = "visit_date")
    val visitDate: LocalDateTime? = null,
    
    @Column(name = "doctor_name")
    val doctorName: String? = null,
    
    @Column(name = "hospital_name")
    val hospitalName: String? = null,
    
    @Column(name = "follow_up_date")
    val followUpDate: LocalDateTime? = null,
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now(),
    
    @Version
    @Column(name = "version")
    val version: Long = 0
) 