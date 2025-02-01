package com.jeevan.backend.services

import com.jeevan.backend.models.Role
import com.jeevan.backend.models.User
import com.jeevan.backend.repositories.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.util.*

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    fun registerUser(email: String, password: String, role: Role): String {
        if (userRepository.existsByEmail(email)) {
            return "User already exists!"
        }
        val hashedPassword = passwordEncoder.encode(password)
        val user = User(email = email, password = hashedPassword, role = role)
        userRepository.save(user)
        return "User registered successfully with role: $role"
    }


    fun loginUser(email: String, password: String): String {
        val user: Optional<User> = userRepository.findByEmail(email)

        if (user.isEmpty || !passwordEncoder.matches(password, user.get().password)) {
            return "Invalid email or password!"
        }

        return "Login successful! Welcome, ${user.get().email}. Role: ${user.get().role}"
    }
}
