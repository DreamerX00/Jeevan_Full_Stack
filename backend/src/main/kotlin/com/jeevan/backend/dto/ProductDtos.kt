package com.jeevan.backend.dto

import java.time.LocalDateTime

data class ProductRequest(
    val name: String,
    val description: String,
    val price: Double,
    val stock: Int,
    val category: String,
    val imageUrl: String?
)

data class ProductResponse(
    val id: Long,
    val name: String,
    val description: String,
    val price: Double,
    val stock: Int,
    val category: String,
    val imageUrl: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) 