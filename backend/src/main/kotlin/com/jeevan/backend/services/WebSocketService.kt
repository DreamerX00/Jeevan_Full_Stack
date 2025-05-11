package com.jeevan.backend.services

import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service

@Service
class WebSocketService(
    private val messagingTemplate: SimpMessagingTemplate
) {
    fun sendMedicalRecordUpdate(userId: Long, update: Any) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/medical-records",
            update
        )
    }

    fun sendAppointmentUpdate(userId: Long, update: Any) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/appointments",
            update
        )
    }

    fun sendPrescriptionUpdate(userId: Long, update: Any) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/prescriptions",
            update
        )
    }

    fun sendOrderUpdate(userId: Long, update: Any) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/orders",
            update
        )
    }

    fun broadcastNotification(message: Any) {
        messagingTemplate.convertAndSend("/topic/notifications", message)
    }
} 