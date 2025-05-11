package com.jeevan.backend.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.EnableWebMvc

/**
 * Configuration for Web-specific APIs
 * 
 * API Endpoint Naming Convention:
 * --------------------------------
 * - Mobile App APIs: /api/...
 *   These are used by the Kotlin Android application
 *   
 * - Web App APIs: /api/web/...
 *   These are specifically for the React web application
 *
 * Package Structure:
 * -----------------
 * - Common components: com.jeevan.backend.*
 *   Shared across both mobile and web platforms
 *   
 * - Web-specific components: com.jeevan.backend.web.*
 *   Used only by the web application
 *
 * Components are identified by:
 * 1. Package name: com.jeevan.backend.web.*
 * 2. Class naming: *WebController, *WebService, *WebDto
 * 3. API endpoint prefix: /api/web/
 */
@Configuration
@EnableWebMvc
class WebApiConfig {
    // Additional web-specific configurations can be added here
} 