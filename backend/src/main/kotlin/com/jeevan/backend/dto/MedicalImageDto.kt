package com.jeevan.backend.dto

import java.time.LocalDateTime

data class MedicalImageRequest(
    val imageName: String,
    val contentType: String,
    val imageData: ByteArray,
    val description: String? = null,
    val imageType: String,
    val medicalRecordId: Long? = null
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as MedicalImageRequest

        if (!imageData.contentEquals(other.imageData)) return false
        if (imageName != other.imageName) return false
        if (contentType != other.contentType) return false
        if (description != other.description) return false
        if (imageType != other.imageType) return false
        if (medicalRecordId != other.medicalRecordId) return false

        return true
    }

    override fun hashCode(): Int {
        var result = imageName.hashCode()
        result = 31 * result + contentType.hashCode()
        result = 31 * result + imageData.contentHashCode()
        result = 31 * result + (description?.hashCode() ?: 0)
        result = 31 * result + imageType.hashCode()
        result = 31 * result + (medicalRecordId?.hashCode() ?: 0)
        return result
    }
}

data class MedicalImageResponse(
    val id: Long? = null,
    val userId: Long? = null,
    val medicalRecordId: Long? = null,
    val imageName: String? = null,
    val contentType: String? = null,
    val imageData: ByteArray? = null,
    val size: Long? = null,
    val description: String? = null,
    val imageType: String? = null,
    val createdAt: LocalDateTime? = null,
    val updatedAt: LocalDateTime? = null,
    val error: String? = null
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as MedicalImageResponse

        if (id != other.id) return false
        if (userId != other.userId) return false
        if (medicalRecordId != other.medicalRecordId) return false
        if (imageName != other.imageName) return false
        if (contentType != other.contentType) return false
        if (imageData != null) {
            if (other.imageData == null) return false
            if (!imageData.contentEquals(other.imageData)) return false
        } else if (other.imageData != null) return false
        if (size != other.size) return false
        if (description != other.description) return false
        if (imageType != other.imageType) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (error != other.error) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id?.hashCode() ?: 0
        result = 31 * result + (userId?.hashCode() ?: 0)
        result = 31 * result + (medicalRecordId?.hashCode() ?: 0)
        result = 31 * result + (imageName?.hashCode() ?: 0)
        result = 31 * result + (contentType?.hashCode() ?: 0)
        result = 31 * result + (imageData?.contentHashCode() ?: 0)
        result = 31 * result + (size?.hashCode() ?: 0)
        result = 31 * result + (description?.hashCode() ?: 0)
        result = 31 * result + (imageType?.hashCode() ?: 0)
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + (error?.hashCode() ?: 0)
        return result
    }
} 