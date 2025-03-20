package com.jeevan.backend.services

import com.jeevan.backend.models.User
import com.jeevan.backend.repositories.UserRepository
import com.jeevan.backend.security.JwtUtil
import com.jeevan.backend.utils.PasswordEncoderConfig
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val emailService: EmailService,
    private val passwordEncoder: PasswordEncoderConfig,
    private val jwtUtil: JwtUtil
) {
    private val logger = LoggerFactory.getLogger(AuthService::class.java)

    fun registerUser(email: String, password: String): ResponseEntity<String> {
        if (userRepository.findByEmail(email).isPresent) {
            logger.warn("Attempted registration with existing email: $email")
            return ResponseEntity.badRequest().body("Email already registered!")
        }

        val hashedPassword = passwordEncoder.passwordEncoder().encode(password)
        val newUser = User(email = email, password = hashedPassword)
        userRepository.save(newUser)

        logger.info("User registered successfully with email: $email")
        return ResponseEntity.ok("User registered successfully")
    }

    fun loginUser(email: String, password: String): ResponseEntity<Any> {
        val user = userRepository.findByEmail(email).orElse(null)
            ?: return ResponseEntity.badRequest().body(mapOf("message" to "Invalid email or password"))

        if (!passwordEncoder.passwordEncoder().matches(password, user.password)) {
            return ResponseEntity.badRequest().body(mapOf("message" to "Invalid email or password"))
        }

        val token = jwtUtil.generateToken(email)
        logger.info("User logged in successfully with email: $email")
        return ResponseEntity.ok(mapOf("token" to token, "message" to "Login successful"))
    }

    fun forgotPassword(email: String): ResponseEntity<String> {
        val user = userRepository.findByEmail(email).orElse(null)
            ?: return ResponseEntity.badRequest().body("User not found")

        val resetToken = UUID.randomUUID().toString()

        // Save the token in the database (implement token storage logic)
        logger.info("Generated Reset Token: $resetToken for user: ${user.email}")

        // Send Reset Email
        emailService.sendResetEmail(email, resetToken)

        return ResponseEntity.ok("Password reset email sent")
    }
}
