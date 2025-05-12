package com.jeevan.backend.services

import com.jeevan.backend.dto.PrescriptionRequest
import com.jeevan.backend.dto.PrescriptionResponse
import org.springframework.stereotype.Service

@Service
class PrescriptionService {
    fun getAllPrescriptions(): List<PrescriptionResponse> {
        // TODO: Implement get all prescriptions logic
        throw UnsupportedOperationException("Not implemented yet")
    }

    fun getAllPrescriptionsForUser(username: String): List<PrescriptionResponse> {
        // TODO: Implement get all prescriptions for user logic
        throw UnsupportedOperationException("Not implemented yet")
    }

    fun getPrescriptionById(id: Long): PrescriptionResponse {
        // TODO: Implement get prescription by id logic
        throw UnsupportedOperationException("Not implemented yet")
    }

    fun createPrescription(request: PrescriptionRequest, username: String): PrescriptionResponse {
        // TODO: Implement prescription creation logic
        throw UnsupportedOperationException("Not implemented yet")
    }

    fun updatePrescription(id: Long, request: PrescriptionRequest, username: String): PrescriptionResponse {
        // TODO: Implement update prescription logic
        throw UnsupportedOperationException("Not implemented yet")
    }

    fun deletePrescription(id: Long, username: String) {
        // TODO: Implement delete prescription logic
        throw UnsupportedOperationException("Not implemented yet")
    }
} 