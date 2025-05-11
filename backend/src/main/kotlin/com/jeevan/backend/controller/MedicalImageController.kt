package com.jeevan.backend.controller

import com.jeevan.backend.dto.MedicalImageRequest
import com.jeevan.backend.dto.MedicalImageResponse
import com.jeevan.backend.services.MedicalImageService
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/medical-images")
class MedicalImageController(private val medicalImageService: MedicalImageService) {

    @GetMapping
    fun getAllImages(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<List<MedicalImageResponse>> {
        val images = medicalImageService.getAllImagesForUser(userDetails.username)
        return ResponseEntity.ok(images)
    }

    @GetMapping("/{id}")
    fun getImageById(@PathVariable id: Long): ResponseEntity<MedicalImageResponse> {
        val image = medicalImageService.getImageById(id)
        return ResponseEntity.ok(image)
    }

    @PostMapping
    fun uploadImage(
        @RequestBody request: MedicalImageRequest,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<MedicalImageResponse> {
        val response = medicalImageService.uploadImage(request, userDetails.username)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/upload", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun uploadImageFromFile(
        @RequestParam("file") file: MultipartFile,
        @RequestParam("imageType") imageType: String,
        @RequestParam("description", required = false) description: String?,
        @RequestParam("medicalRecordId", required = false) medicalRecordId: Long?,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<MedicalImageResponse> {
        val response = medicalImageService.uploadImageFromFile(
            file = file,
            imageType = imageType,
            description = description,
            medicalRecordId = medicalRecordId,
            email = userDetails.username
        )
        return ResponseEntity.ok(response)
    }

    @DeleteMapping("/{id}")
    fun deleteImage(
        @PathVariable id: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Map<String, String>> {
        medicalImageService.deleteImage(id, userDetails.username)
        return ResponseEntity.ok(mapOf("message" to "Image deleted successfully"))
    }
} 