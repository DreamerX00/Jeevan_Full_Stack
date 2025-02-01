package com.jeevan.backend.configs

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() } // Disable CSRF for simplicity (you may need it later)
            .authorizeHttpRequests {
                it.requestMatchers("/api/auth/**").permitAll() // Allow unauthenticated access to auth endpoints
                it.requestMatchers("/api/admin/**").hasAuthority("ADMIN") //Allow Admin Access
                it.requestMatchers("/api/user/**").hasAuthority("USER")//Only Users Can Access
                it.anyRequest().authenticated() // Secure all other endpoints
            }
            .formLogin { it.disable() } // Disable default form login
            .httpBasic { it.disable() } // Disable basic authentication
            .sessionManagement { it.disable() } // Make API stateless

        return http.build()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder() // Use BCrypt for password hashing
    }
}
