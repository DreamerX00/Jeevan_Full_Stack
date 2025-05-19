package com.jeevan.backend.controller

import com.jeevan.backend.dto.OrderRequest
import com.jeevan.backend.dto.OrderResponse
import com.jeevan.backend.services.OrderService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/orders")
class OrderController(private val orderService: OrderService) {

    @GetMapping
    fun getAllOrders(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<List<OrderResponse>> {
        val orders = orderService.getAllOrdersForUser(userDetails.username)
        return ResponseEntity.ok(orders)
    }

    @GetMapping("/{id}")
    fun getOrderById(
        @PathVariable id: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<OrderResponse> {
        val order = orderService.getOrderById(id, userDetails.username)
        return ResponseEntity.ok(order)
    }

    @PostMapping
    fun createOrder(
        @RequestBody request: OrderRequest,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<OrderResponse> {
        val order = orderService.createOrder(request, userDetails.username)
        return ResponseEntity.ok(order)
    }

    @PutMapping("/{id}/cancel")
    fun cancelOrder(
        @PathVariable id: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<OrderResponse> {
        val order = orderService.cancelOrder(id, userDetails.username)
        return ResponseEntity.ok(order)
    }

    @GetMapping("/status/{status}")
    fun getOrdersByStatus(
        @PathVariable status: String,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<List<OrderResponse>> {
        val orders = orderService.getOrdersByStatus(status, userDetails.username)
        return ResponseEntity.ok(orders)
    }
} 