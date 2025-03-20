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
                
                // Create test users
                val testUser1 = User(
                    email = "test@example.com",
                    password = passwordEncoder.encode("password123"),
                )
                
                val testUser2 = User(
                    email = "john.doe@example.com",
                    password = passwordEncoder.encode("password123"),
                )
                
                val testUser3 = User(
                    email = "jane.doe@example.com",
                    password = passwordEncoder.encode("password123"),
                )
                
                userRepository.saveAll(listOf(testUser1, testUser2, testUser3))
                
                println("Sample data initialization complete!")
            } else {
                println("Database already contains data, skipping initialization.")
            }
        }
    }
} 