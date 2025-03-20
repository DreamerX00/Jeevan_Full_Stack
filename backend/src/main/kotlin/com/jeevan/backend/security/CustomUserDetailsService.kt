package com.jeevan.backend.security

import com.jeevan.backend.repositories.UserRepository
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
    private val userRepository: UserRepository
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val userOptional = userRepository.findByEmail(username)
        
        if (userOptional.isEmpty) {
            throw UsernameNotFoundException("User not found with email: $username")
        }
        
        val user = userOptional.get()
        val authorities = listOf(SimpleGrantedAuthority("USER"))
        
        return User(
            user.email,
            user.password,
            authorities
        )
    }
} 