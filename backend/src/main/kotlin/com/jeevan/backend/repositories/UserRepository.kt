package com.jeevan.backend.repositories

import com.jeevan.backend.models.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional


@Repository
interface UserRepository : JpaRepository<User, Long> {

    fun findByEmail(email: String): Optional<User>  // Fetch user by email

    fun existsByEmail(email: String): Boolean  // Check if user exists by email
}
