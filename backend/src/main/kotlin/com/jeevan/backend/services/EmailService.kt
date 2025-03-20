package com.jeevan.backend.services

import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import org.slf4j.LoggerFactory

@Service
class EmailService(private val mailSender: JavaMailSender) {

    private val logger = LoggerFactory.getLogger(EmailService::class.java)

    fun sendResetEmail(email: String, resetToken: String) {
        try {
            val message = mailSender.createMimeMessage()
            val helper = MimeMessageHelper(message, true)

            helper.setTo(email)
            helper.setSubject("Password Reset Request")
            helper.setText("<p>Click the link below to reset your password:</p>" +
                    "<p><a href=\"http://localhost:8080/reset-password?token=$resetToken\">Reset Password</a></p>", true)

            mailSender.send(message)
            logger.info("Password reset email sent to $email")
        } catch (ex: Exception) {
            logger.error("Failed to send email to $email", ex)
        }
    }
}
