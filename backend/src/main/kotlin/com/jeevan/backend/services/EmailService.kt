package com.jeevan.backend.services

import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired

@Service
class EmailService(
    @Autowired(required = false)
    private val mailSender: JavaMailSender?
) {
    private val logger = LoggerFactory.getLogger(EmailService::class.java)
    
    @Value("\${spring.mail.username:noreply@jeevan.com}")
    private lateinit var fromEmail: String

    fun sendPasswordResetEmail(toEmail: String, resetUrl: String) {
        try {
            if (mailSender == null) {
                logger.warn("JavaMailSender is not configured. Would have sent email to $toEmail with reset URL: $resetUrl")
                return
            }
            
            val message = SimpleMailMessage()
            message.setFrom(fromEmail)
            message.setTo(toEmail)
            message.setSubject("Password Reset Request")
            message.setText("""
                Hello,
                
                You have requested to reset your password. Please click on the link below to reset your password:
                
                $resetUrl
                
                If you did not request a password reset, please ignore this email.
                
                Regards,
                The Jeevan Team
            """.trimIndent())
            
            mailSender.send(message)
            logger.info("Password reset email sent to $toEmail")
        } catch (e: Exception) {
            logger.error("Failed to send password reset email to $toEmail: ${e.message}")
        }
    }
} 