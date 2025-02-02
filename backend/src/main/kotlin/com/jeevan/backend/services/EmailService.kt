package com.jeevan.backend.services

import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service

@Service
class EmailService(private val mailSender: JavaMailSender) {

    fun sendResetEmail(email: String, resetToken: String) {
        val message = mailSender.createMimeMessage()
        val helper = MimeMessageHelper(message)

        helper.setTo(email)
        helper.setSubject("Password Reset Request")
        helper.setText("Click the link below to reset your password:\n\n" +
                "http://localhost:8080/reset-password?token=$resetToken")

        mailSender.send(message)
    }
}
