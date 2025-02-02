package com.jeevan.backend.services

import com.jeevan.backend.repositories.UserRepository
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class AuthService(private val userRepository: UserRepository, private val emailService: EmailService) {

    fun forgotPassword(email: String): ResponseEntity<String> {
        val user = userRepository.findByEmail(email)

        if (user.isEmpty) {
            return ResponseEntity.badRequest().body("User not found")
        }

        val resetToken = UUID.randomUUID().toString()

        // Here, you should save the token in the database (implement token storage logic)
        println("Generated Reset Token: $resetToken for user: ${user.get().email}")

        // Send Reset Email
        emailService.sendResetEmail(email, resetToken)

        return ResponseEntity.ok("Password reset email sent")
    }
}
