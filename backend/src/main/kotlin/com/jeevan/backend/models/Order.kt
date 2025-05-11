package com.jeevan.backend.models

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "orders")
data class Order(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,
    
    @Column(nullable = false)
    val orderDate: LocalDateTime = LocalDateTime.now(),
    
    @Column(nullable = false, precision = 10, scale = 2)
    val totalAmount: BigDecimal,
    
    @Column(nullable = false)
    val status: String = "PENDING", // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    
    @Column
    val shippingAddress: String? = null,
    
    @Column
    val paymentMethod: String? = null,
    
    @Column
    val paymentStatus: String? = null,
    
    @OneToMany(mappedBy = "order", cascade = [CascadeType.ALL], orphanRemoval = true)
    val orderItems: MutableList<OrderItem> = mutableListOf(),
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
) 