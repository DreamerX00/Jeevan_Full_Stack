package com.jeevan.backend.controller

import com.jeevan.backend.dto.MedicalRecordRequest
import com.jeevan.backend.dto.MedicalRecordResponse
import com.jeevan.backend.services.MedicalRecordService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/medicalrecords")
class MedicalRecordController(private val medicalRecordService: MedicalRecordService) {

    @GetMapping
    fun getAllMedicalRecords(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<List<MedicalRecordResponse>> {
        val medicalRecords = medicalRecordService.getAllMedicalRecordsForUser(userDetails.username)
        return ResponseEntity.ok(medicalRecords)
    }

    @GetMapping("/{id}")
    fun getMedicalRecordById(@PathVariable id: Long): ResponseEntity<MedicalRecordResponse> {
        val medicalRecord = medicalRecordService.getMedicalRecordById(id)
        return ResponseEntity.ok(medicalRecord)
    }

    @PostMapping
    fun createMedicalRecord(
        @RequestBody request: MedicalRecordRequest,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<MedicalRecordResponse> {
        val medicalRecord = medicalRecordService.createMedicalRecord(request, userDetails.username)
        return ResponseEntity.ok(medicalRecord)
    }

    @PutMapping("/{id}")
    fun updateMedicalRecord(
        @PathVariable id: Long,
        @RequestBody request: MedicalRecordRequest,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<MedicalRecordResponse> {
        val medicalRecord = medicalRecordService.updateMedicalRecord(id, request, userDetails.username)
        return ResponseEntity.ok(medicalRecord)
    }

    @DeleteMapping("/{id}")
    fun deleteMedicalRecord(
        @PathVariable id: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Map<String, String>> {
        medicalRecordService.deleteMedicalRecord(id, userDetails.username)
        return ResponseEntity.ok(mapOf("message" to "Medical record deleted successfully"))
    }
} 