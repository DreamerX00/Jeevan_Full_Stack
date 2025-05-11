package com.jeevan.backend.web.controller

import com.jeevan.backend.dto.AppointmentRequest
import com.jeevan.backend.dto.AppointmentResponse
import com.jeevan.backend.services.AppointmentService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

/**
 * Web-specific controller for handling appointment operations via REST API.
 * This controller is specifically for the web application.
 */
@RestController
@RequestMapping("/api/web/appointments")
class AppointmentWebController(private val appointmentService: AppointmentService) {

    @GetMapping
    fun getAllAppointments(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<List<AppointmentResponse>> {
        val appointments = appointmentService.getAllAppointmentsForUser(userDetails.username)
        return ResponseEntity.ok(appointments)
    }

    @GetMapping("/{id}")
    fun getAppointmentById(@PathVariable id: Long): ResponseEntity<AppointmentResponse> {
        val appointment = appointmentService.getAppointmentById(id)
        return ResponseEntity.ok(appointment)
    }

    @PostMapping
    fun createAppointment(
        @RequestBody request: AppointmentRequest,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<AppointmentResponse> {
        val appointment = appointmentService.createAppointment(request, userDetails.username)
        return ResponseEntity.ok(appointment)
    }

    @PutMapping("/{id}")
    fun updateAppointment(
        @PathVariable id: Long,
        @RequestBody request: AppointmentRequest,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<AppointmentResponse> {
        val appointment = appointmentService.updateAppointment(id, request, userDetails.username)
        return ResponseEntity.ok(appointment)
    }

    @DeleteMapping("/{id}")
    fun deleteAppointment(
        @PathVariable id: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Map<String, String>> {
        appointmentService.deleteAppointment(id, userDetails.username)
        return ResponseEntity.ok(mapOf("message" to "Appointment deleted successfully"))
    }
} 