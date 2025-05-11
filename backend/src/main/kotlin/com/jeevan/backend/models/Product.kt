package com.jeevan.backend.models

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "products")
data class Product(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @Column(nullable = false)
    val name: String,
    
    @Column(nullable = false, columnDefinition = "TEXT")
    val description: String,
    
    @Column(nullable = false, precision = 10, scale = 2)
    val price: BigDecimal,
    
    @Column(nullable = false)
    val category: String, // e.g., "Medicines", "Medical Devices", "Personal Care"
    
    @Column(nullable = false)
    val manufacturer: String,
    
    @Column
    val imageUrl: String? = null,
    
    @Column(nullable = false)
    val stockQuantity: Int,
    
    @Column(nullable = false)
    val requiresPrescription: Boolean = false,
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
) 