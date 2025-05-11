package com.jeevan.backend.models

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "medical_images")
data class MedicalImage(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medical_record_id")
    val medicalRecord: MedicalRecord? = null,

    @Column(name = "image_name", nullable = false)
    val imageName: String,

    @Column(name = "content_type", nullable = false)
    val contentType: String,

    @Column(name = "image_data", nullable = false, columnDefinition = "BYTEA")
    val imageData: ByteArray,

    @Column(name = "image_size")
    val size: Long,

    @Column(name = "description")
    val description: String? = null,

    @Column(name = "image_type")
    val imageType: String, // e.g., "X-Ray", "MRI", "CT Scan", "Prescription", "Lab Report"

    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now(),

    @Version
    @Column(name = "version")
    val version: Long = 0
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as MedicalImage

        if (id != other.id) return false
        if (!imageData.contentEquals(other.imageData)) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id?.hashCode() ?: 0
        result = 31 * result + imageData.contentHashCode()
        return result
    }
} 