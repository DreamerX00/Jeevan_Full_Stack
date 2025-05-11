package com.jeevan.backend.web.controller

import com.jeevan.backend.dto.ProductRequest
import com.jeevan.backend.dto.ProductResponse
import com.jeevan.backend.services.ProductService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * Web-specific controller for handling product operations via REST API.
 * This controller is specifically for the web application's medical shop.
 */
@RestController
@RequestMapping("/api/web/products")
class ProductWebController(private val productService: ProductService) {

    @GetMapping
    fun getAllProducts(): ResponseEntity<List<ProductResponse>> {
        val products = productService.getAllProducts()
        return ResponseEntity.ok(products)
    }

    @GetMapping("/{id}")
    fun getProductById(@PathVariable id: Long): ResponseEntity<ProductResponse> {
        val product = productService.getProductById(id)
        return ResponseEntity.ok(product)
    }

    @GetMapping("/category/{category}")
    fun getProductsByCategory(@PathVariable category: String): ResponseEntity<List<ProductResponse>> {
        val products = productService.getProductsByCategory(category)
        return ResponseEntity.ok(products)
    }

    @PostMapping
    fun createProduct(@RequestBody request: ProductRequest): ResponseEntity<ProductResponse> {
        val product = productService.createProduct(request)
        return ResponseEntity.ok(product)
    }

    @PutMapping("/{id}")
    fun updateProduct(
        @PathVariable id: Long,
        @RequestBody request: ProductRequest
    ): ResponseEntity<ProductResponse> {
        val product = productService.updateProduct(id, request)
        return ResponseEntity.ok(product)
    }

    @DeleteMapping("/{id}")
    fun deleteProduct(@PathVariable id: Long): ResponseEntity<Map<String, String>> {
        productService.deleteProduct(id)
        return ResponseEntity.ok(mapOf("message" to "Product deleted successfully"))
    }

    @GetMapping("/search")
    fun searchProducts(@RequestParam query: String): ResponseEntity<List<ProductResponse>> {
        val products = productService.searchProducts(query)
        return ResponseEntity.ok(products)
    }
} 