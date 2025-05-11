package com.jeevan.backend.controller

import com.jeevan.backend.dto.PrescriptionRequest
import com.jeevan.backend.dto.PrescriptionResponse
import com.jeevan.backend.services.PrescriptionService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/prescriptions")
class PrescriptionController(private val prescriptionService: PrescriptionService) {

    @GetMapping
    fun getAllPrescriptions(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<List<PrescriptionResponse>> {
        val prescriptions = prescriptionService.getAllPrescriptionsForUser(userDetails.username)
        return ResponseEntity.ok(prescriptions)
    }

    @GetMapping("/{id}")
    fun getPrescriptionById(@PathVariable id: Long): ResponseEntity<PrescriptionResponse> {
        val prescription = prescriptionService.getPrescriptionById(id)
        return ResponseEntity.ok(prescription)
    }

    @PostMapping
    fun createPrescription(
        @RequestBody request: PrescriptionRequest,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<PrescriptionResponse> {
        val prescription = prescriptionService.createPrescription(request, userDetails.username)
        return ResponseEntity.ok(prescription)
    }

    @PutMapping("/{id}")
    fun updatePrescription(
        @PathVariable id: Long,
        @RequestBody request: PrescriptionRequest,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<PrescriptionResponse> {
        val prescription = prescriptionService.updatePrescription(id, request, userDetails.username)
        return ResponseEntity.ok(prescription)
    }

    @DeleteMapping("/{id}")
    fun deletePrescription(
        @PathVariable id: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Map<String, String>> {
        prescriptionService.deletePrescription(id, userDetails.username)
        return ResponseEntity.ok(mapOf("message" to "Prescription deleted successfully"))
    }
} 