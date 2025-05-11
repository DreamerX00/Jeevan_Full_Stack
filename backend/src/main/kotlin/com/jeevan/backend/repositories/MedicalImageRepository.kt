package com.jeevan.backend.repositories

import com.jeevan.backend.models.MedicalImage
import com.jeevan.backend.models.MedicalRecord
import com.jeevan.backend.models.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface MedicalImageRepository : JpaRepository<MedicalImage, Long> {
    fun findByUser(user: User): List<MedicalImage>
    fun findByMedicalRecord(medicalRecord: MedicalRecord): List<MedicalImage>
    fun findByUserId(userId: Long): List<MedicalImage>
    
    @Query("SELECT mi FROM MedicalImage mi WHERE mi.user.id = :userId AND mi.imageType = :imageType")
    fun findByUserIdAndImageType(userId: Long, imageType: String): List<MedicalImage>
    
    @Query("SELECT mi FROM MedicalImage mi WHERE mi.user.id = :userId AND mi.medicalRecord.id = :recordId")
    fun findByUserIdAndRecordId(userId: Long, recordId: Long): List<MedicalImage>
} 