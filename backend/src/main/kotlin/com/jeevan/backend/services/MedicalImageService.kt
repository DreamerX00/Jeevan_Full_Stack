package com.jeevan.backend.services

import com.jeevan.backend.dto.MedicalImageRequest
import com.jeevan.backend.dto.MedicalImageResponse
import com.jeevan.backend.models.MedicalImage
import com.jeevan.backend.models.MedicalRecord
import com.jeevan.backend.models.User
import com.jeevan.backend.repositories.MedicalImageRepository
import com.jeevan.backend.repositories.MedicalRecordRepository
import com.jeevan.backend.repositories.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDateTime
import java.util.NoSuchElementException

@Service
class MedicalImageService(
    private val medicalImageRepository: MedicalImageRepository,
    private val medicalRecordRepository: MedicalRecordRepository,
    private val userRepository: UserRepository,
    private val webSocketService: WebSocketService
) {
    fun getAllImagesForUser(email: String): List<MedicalImageResponse> {
        val user = getUserByEmail(email)
        return medicalImageRepository.findByUser(user)
            .map { mapToResponse(it) }
    }

    fun getImageById(id: Long): MedicalImageResponse {
        val image = medicalImageRepository.findById(id)
            .orElseThrow { NoSuchElementException("Medical image not found with id: $id") }
        return mapToResponse(image)
    }

    @Transactional
    fun uploadImage(request: MedicalImageRequest, email: String): MedicalImageResponse {
        val user = getUserByEmail(email)
        val medicalRecord = request.medicalRecordId?.let {
            medicalRecordRepository.findById(it)
                .orElseThrow { NoSuchElementException("Medical record not found with id: $it") }
        }

        val image = MedicalImage(
            user = user,
            medicalRecord = medicalRecord,
            imageName = request.imageName,
            contentType = request.contentType,
            imageData = request.imageData,
            size = request.imageData.size.toLong(),
            description = request.description,
            imageType = request.imageType
        )

        val savedImage = medicalImageRepository.save(image)
        val response = mapToResponse(savedImage)

        // Send real-time update
        webSocketService.sendMedicalRecordUpdate(user.id!!, mapOf(
            "type" to "IMAGE_ADDED",
            "imageId" to savedImage.id,
            "recordId" to medicalRecord?.id
        ))

        return response
    }

    @Transactional
    fun uploadImageFromFile(file: MultipartFile, imageType: String, description: String?, medicalRecordId: Long?, email: String): MedicalImageResponse {
        val user = getUserByEmail(email)
        val medicalRecord = medicalRecordId?.let {
            medicalRecordRepository.findById(it)
                .orElseThrow { NoSuchElementException("Medical record not found with id: $it") }
        }

        val image = MedicalImage(
            user = user,
            medicalRecord = medicalRecord,
            imageName = file.originalFilename ?: "unnamed_image",
            contentType = file.contentType ?: "application/octet-stream",
            imageData = file.bytes,
            size = file.size,
            description = description,
            imageType = imageType
        )

        val savedImage = medicalImageRepository.save(image)
        val response = mapToResponse(savedImage)

        // Send real-time update
        webSocketService.sendMedicalRecordUpdate(user.id!!, mapOf(
            "type" to "IMAGE_ADDED",
            "imageId" to savedImage.id,
            "recordId" to medicalRecord?.id
        ))

        return response
    }

    @Transactional
    fun deleteImage(id: Long, email: String) {
        val user = getUserByEmail(email)
        val image = medicalImageRepository.findById(id)
            .orElseThrow { NoSuchElementException("Medical image not found with id: $id") }

        if (image.user.id != user.id) {
            throw IllegalStateException("You are not authorized to delete this image")
        }

        medicalImageRepository.delete(image)

        // Send real-time update
        webSocketService.sendMedicalRecordUpdate(user.id!!, mapOf(
            "type" to "IMAGE_DELETED",
            "imageId" to id,
            "recordId" to image.medicalRecord?.id
        ))
    }

    private fun getUserByEmail(email: String): User {
        return userRepository.findByEmail(email)
            .orElseThrow { NoSuchElementException("User not found with email: $email") }
    }

    private fun mapToResponse(image: MedicalImage): MedicalImageResponse {
        return MedicalImageResponse(
            id = image.id,
            userId = image.user.id,
            medicalRecordId = image.medicalRecord?.id,
            imageName = image.imageName,
            contentType = image.contentType,
            imageData = image.imageData,
            size = image.size,
            description = image.description,
            imageType = image.imageType,
            createdAt = image.createdAt,
            updatedAt = image.updatedAt
        )
    }
} 