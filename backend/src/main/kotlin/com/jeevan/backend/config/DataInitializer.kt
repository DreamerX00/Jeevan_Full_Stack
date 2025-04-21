package com.jeevan.backend.config

import com.jeevan.backend.models.User
import com.jeevan.backend.repositories.UserRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class DataInitializer {

    @Bean
    fun initDatabase(userRepository: UserRepository, passwordEncoder: PasswordEncoder): CommandLineRunner {
        return CommandLineRunner {
            // Only populate if the database is empty
            if (userRepository.count() == 0L) {
                println("Initializing database with sample data...")
                
                // Create test users with @ symbol in password
                val testUser1 = User(
                    email = "test@example.com",
                    password = passwordEncoder.encode("Test@123!"),
                )
                
                val testUser2 = User(
                    email = "john.doe@example.com",
                    password = passwordEncoder.encode("John@123!"),
                )
                
                val testUser3 = User(
                    email = "jane.doe@example.com",
                    password = passwordEncoder.encode("Jane@123!"),
                )
                
                userRepository.saveAll(listOf(testUser1, testUser2, testUser3))
                
                println("Sample data initialization complete!")
            } else {
                // Update existing test user's password
                val testUser = userRepository.findByEmail("test@example.com")
                testUser.ifPresent { user ->
                    val updatedUser = user.copy(
                        password = passwordEncoder.encode("Test@123!")
                    )
                    userRepository.save(updatedUser)
                    println("Updated test user password!")
                }
            }
        }
    }
} 