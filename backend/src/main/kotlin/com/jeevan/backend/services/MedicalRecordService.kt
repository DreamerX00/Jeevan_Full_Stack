package com.jeevan.backend.services

import com.jeevan.backend.dto.MedicalRecordRequest
import com.jeevan.backend.dto.MedicalRecordResponse
import com.jeevan.backend.models.MedicalRecord
import com.jeevan.backend.models.User
import com.jeevan.backend.repositories.MedicalRecordRepository
import com.jeevan.backend.repositories.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.NoSuchElementException
import org.springframework.orm.ObjectOptimisticLockingFailureException

@Service
class MedicalRecordService(
    private val medicalRecordRepository: MedicalRecordRepository,
    private val userRepository: UserRepository,
    private val webSocketService: WebSocketService
) {
    fun getAllMedicalRecordsForUser(email: String): List<MedicalRecordResponse> {
        val user = getUserByEmail(email)
        return medicalRecordRepository.findByUser(user)
            .map { mapToResponse(it) }
    }

    fun getMedicalRecordById(id: Long): MedicalRecordResponse {
        val record = medicalRecordRepository.findById(id)
            .orElseThrow { NoSuchElementException("Medical record not found with id: $id") }
        return mapToResponse(record)
    }

    @Transactional
    fun createMedicalRecord(request: MedicalRecordRequest, email: String): MedicalRecordResponse {
        val user = getUserByEmail(email)
        
        val medicalRecord = MedicalRecord(
            user = user,
            diagnosis = request.diagnosis,
            prescription = request.prescription,
            notes = request.notes,
            visitDate = request.visitDate,
            doctorName = request.doctorName,
            hospitalName = request.hospitalName,
            followUpDate = request.followUpDate
        )
        
        val savedRecord = medicalRecordRepository.save(medicalRecord)
        val response = mapToResponse(savedRecord)
        
        // Send real-time update
        webSocketService.sendMedicalRecordUpdate(user.id!!, response)
        
        return response
    }

    @Transactional
    fun updateMedicalRecord(id: Long, request: MedicalRecordRequest, email: String): MedicalRecordResponse {
        val user = getUserByEmail(email)
        val existingRecord = medicalRecordRepository.findById(id)
            .orElseThrow { NoSuchElementException("Medical record not found with id: $id") }
            
        if (existingRecord.user.id != user.id) {
            throw IllegalStateException("You are not authorized to update this medical record")
        }
        
        try {
            val updatedRecord = existingRecord.copy(
                diagnosis = request.diagnosis ?: existingRecord.diagnosis,
                prescription = request.prescription ?: existingRecord.prescription,
                notes = request.notes ?: existingRecord.notes,
                visitDate = request.visitDate ?: existingRecord.visitDate,
                doctorName = request.doctorName ?: existingRecord.doctorName,
                hospitalName = request.hospitalName ?: existingRecord.hospitalName,
                followUpDate = request.followUpDate ?: existingRecord.followUpDate,
                updatedAt = LocalDateTime.now()
            )
            
            val savedRecord = medicalRecordRepository.save(updatedRecord)
            val response = mapToResponse(savedRecord)
            
            // Send real-time update
            webSocketService.sendMedicalRecordUpdate(user.id!!, response)
            
            return response
        } catch (e: ObjectOptimisticLockingFailureException) {
            throw IllegalStateException("The record was modified by another user. Please refresh and try again.")
        }
    }

    @Transactional
    fun deleteMedicalRecord(id: Long, email: String) {
        val user = getUserByEmail(email)
        val record = medicalRecordRepository.findById(id)
            .orElseThrow { NoSuchElementException("Medical record not found with id: $id") }
            
        if (record.user.id != user.id) {
            throw IllegalStateException("You are not authorized to delete this medical record")
        }
        
        medicalRecordRepository.delete(record)
        
        // Send real-time update
        webSocketService.sendMedicalRecordUpdate(user.id!!, mapOf(
            "type" to "DELETE",
            "id" to id
        ))
    }

    private fun getUserByEmail(email: String): User {
        return userRepository.findByEmail(email)
            .orElseThrow { NoSuchElementException("User not found with email: $email") }
    }

    private fun mapToResponse(record: MedicalRecord): MedicalRecordResponse {
        return MedicalRecordResponse(
            id = record.id,
            userId = record.user.id,
            diagnosis = record.diagnosis,
            prescription = record.prescription,
            notes = record.notes,
            visitDate = record.visitDate,
            doctorName = record.doctorName,
            hospitalName = record.hospitalName,
            followUpDate = record.followUpDate,
            createdAt = record.createdAt,
            updatedAt = record.updatedAt
        )
    }
} 