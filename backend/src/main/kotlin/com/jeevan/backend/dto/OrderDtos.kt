package com.jeevan.backend.dto

import java.time.LocalDateTime

data class OrderRequest(
    val userId: Long,
    val items: List<OrderItemRequest>,
    val deliveryAddress: String,
    val paymentMethod: String
)

data class OrderItemRequest(
    val productId: Long,
    val quantity: Int
)

data class OrderResponse(
    val id: Long,
    val userId: Long,
    val items: List<OrderItemResponse>,
    val totalAmount: Double,
    val status: String,
    val deliveryAddress: String,
    val paymentMethod: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class OrderItemResponse(
    val id: Long,
    val productId: Long,
    val productName: String,
    val quantity: Int,
    val price: Double
) 