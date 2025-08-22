package com.jeevan.backend.repository

import com.jeevan.backend.models.UserIdentification
import com.jeevan.backend.models.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface UserIdentificationRepository : JpaRepository<UserIdentification, Long> {
    fun findByUser(user: User): Optional<UserIdentification>
    fun findByAadhaarNumber(aadhaarNumber: String): Optional<UserIdentification>
    fun findByPanNumber(panNumber: String): Optional<UserIdentification>
    fun findByAbhaNumber(abhaNumber: String): Optional<UserIdentification>
} 