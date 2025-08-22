package com.jeevan.backend.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig : WebMvcConfigurer {

    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**")
            .allowedOrigins(
                "http://localhost:3000",  // React development
                "https://jeevan.com",     // Production website
                "http://localhost:8080",  // Android emulator
                "http://localhost:5173",  // Vite default dev server
                "http://localhost:4173",  // Vite preview server
                "http://127.0.0.1:5173",  // Vite alternative URL
                "http://127.0.0.1:4173",  // Vite preview alternative URL
                "http://192.168.1.9:8080" // Local WiFi network access
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
            .allowedHeaders(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
            )
            .allowCredentials(true)
            .maxAge(3600)
    }
}