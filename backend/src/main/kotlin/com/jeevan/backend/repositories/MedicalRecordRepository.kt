package com.jeevan.backend.repositories

import com.jeevan.backend.models.MedicalRecord
import com.jeevan.backend.models.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MedicalRecordRepository : JpaRepository<MedicalRecord, Long> {
    fun findByUser(user: User): List<MedicalRecord>
    fun findByUserId(userId: Long): List<MedicalRecord>
} 