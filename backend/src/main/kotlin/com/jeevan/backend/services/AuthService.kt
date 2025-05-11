package com.jeevan.backend.services

import com.jeevan.backend.dto.AuthResponse
import com.jeevan.backend.dto.ForgotPasswordRequest
import com.jeevan.backend.dto.LoginRequest
import com.jeevan.backend.dto.RegisterRequest
import com.jeevan.backend.dto.ResetPasswordRequest
import com.jeevan.backend.models.User
import com.jeevan.backend.repositories.UserRepository
import com.jeevan.backend.security.JwtService
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.UUID

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
    private val authenticationManager: AuthenticationManager,
    private val userDetailsService: UserDetailsService,
    private val emailService: EmailService
) {

    fun register(request: RegisterRequest): AuthResponse {
        // Check if email already exists
        if (userRepository.existsByEmail(request.email)) {
            return AuthResponse(error = "Email already exists")
        }

        // Create new user
        val user = User(
            email = request.email,
            password = passwordEncoder.encode(request.password)
        )

        userRepository.save(user)
        
        val userDetails = userDetailsService.loadUserByUsername(user.email)
        val token = jwtService.generateToken(userDetails)
        
        return AuthResponse(token = token, message = "Registration successful")
    }

    fun login(request: LoginRequest): AuthResponse {
        try {
            authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(request.email, request.password)
            )
            
            val userDetails = userDetailsService.loadUserByUsername(request.email)
            val token = jwtService.generateToken(userDetails)
            
            return AuthResponse(token = token, message = "Login successful")
        } catch (e: Exception) {
            return AuthResponse(error = "Invalid credentials")
        }
    }

    fun forgotPassword(request: ForgotPasswordRequest): AuthResponse {
        val userOptional = userRepository.findByEmail(request.email)
        
        if (userOptional.isEmpty) {
            // For security reasons, don't reveal if the email exists
            return AuthResponse(message = "If your email is registered, you will receive a password reset link")
        }

        val user = userOptional.get()
        val resetToken = UUID.randomUUID().toString()
        
        // Save token to user
        val updatedUser = user.copy(
            resetToken = resetToken,
            resetTokenExpiry = LocalDateTime.now().plusHours(1)
        )
        userRepository.save(updatedUser)
        
        // Send reset email
        val resetUrl = "http://yourapp.com/reset-password?token=$resetToken"
        emailService.sendPasswordResetEmail(user.email, resetUrl)
        
        return AuthResponse(message = "If your email is registered, you will receive a password reset link")
    }

    fun resetPassword(request: ResetPasswordRequest): AuthResponse {
        val userOptional = userRepository.findByResetToken(request.token)
        
        if (userOptional.isEmpty) {
            return AuthResponse(error = "Invalid or expired token")
        }

        val user = userOptional.get()
        
        // Check if token is expired
        if (user.resetTokenExpiry?.isBefore(LocalDateTime.now()) == true) {
            return AuthResponse(error = "Token has expired")
        }

        // Update password and clear token
        val updatedUser = user.copy(
            password = passwordEncoder.encode(request.password),
            resetToken = null,
            resetTokenExpiry = null
        )
        userRepository.save(updatedUser)
        
        return AuthResponse(message = "Password reset successful")
    }
} 