package com.jeevan.backend.models

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "appointments")
data class Appointment(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,
    
    @Column(nullable = false)
    val doctorName: String,
    
    @Column(nullable = false)
    val specialty: String,
    
    @Column(nullable = false)
    val hospitalName: String,
    
    @Column(nullable = false)
    val appointmentDate: LocalDateTime,
    
    @Column
    val notes: String? = null,
    
    @Column(nullable = false)
    val status: String = "SCHEDULED", // SCHEDULED, COMPLETED, CANCELLED
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
) 