package com.jeevan.backend.security

import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.filter.OncePerRequestFilter
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority

class JwtFilter(private val jwtUtil: JwtUtil) : OncePerRequestFilter() {
    @Throws(ServletException::class, java.io.IOException::class)
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            val token = authHeader.substring(7)
            if (jwtUtil.validateToken(token)) {
                val email = jwtUtil.extractEmail(token)
                SecurityContextHolder.getContext().authentication = JwtAuthentication(email)
            }
        }
        filterChain.doFilter(request, response)
    }
}

class JwtAuthentication(private val email: String) : Authentication {

    private var authenticated: Boolean = true

    override fun getAuthorities(): Collection<GrantedAuthority>? = null

    override fun getCredentials(): Any? = null

    override fun getDetails(): Any? = null

    override fun getPrincipal(): Any = email

    override fun isAuthenticated(): Boolean = authenticated

    override fun setAuthenticated(isAuthenticated: Boolean) {
        this.authenticated = isAuthenticated
    }

    override fun getName(): String = email
}
