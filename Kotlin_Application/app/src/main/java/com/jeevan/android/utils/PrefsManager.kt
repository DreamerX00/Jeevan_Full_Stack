package com.example.jeevanandroid.utils

import android.content.Context
import android.content.SharedPreferences
import java.util.Date

class PrefsManager(context: Context) {
    private val sharedPreferences: SharedPreferences = context.getSharedPreferences("jeevan_prefs", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_TOKEN = "jwt_token"
        private const val KEY_TOKEN_TIMESTAMP = "jwt_token_timestamp"
        private const val KEY_ONBOARDING_COMPLETED = "onboarding_completed"
        private const val TOKEN_VALIDITY_DURATION = 23 * 60 * 60 * 1000 // 23 hours in milliseconds
    }

    fun saveToken(token: String) {
        sharedPreferences.edit().apply {
            putString(KEY_TOKEN, token)
            putLong(KEY_TOKEN_TIMESTAMP, Date().time)
            apply()
        }
    }

    fun getToken(): String? {
        val token = sharedPreferences.getString(KEY_TOKEN, null)
        val timestamp = sharedPreferences.getLong(KEY_TOKEN_TIMESTAMP, 0)
        
        // Check if token exists and is still valid
        return if (token != null && isTokenValid(timestamp)) {
            token
        } else {
            // Clear invalid token
            clearToken()
            null
        }
    }

    fun clearToken() {
        sharedPreferences.edit().apply {
            remove(KEY_TOKEN)
            remove(KEY_TOKEN_TIMESTAMP)
            apply()
        }
    }

    private fun isTokenValid(timestamp: Long): Boolean {
        val currentTime = Date().time
        return (currentTime - timestamp) < TOKEN_VALIDITY_DURATION
    }

    fun hasValidToken(): Boolean {
        return getToken() != null
    }
    
    fun markOnboardingCompleted() {
        sharedPreferences.edit().apply {
            putBoolean(KEY_ONBOARDING_COMPLETED, true)
            apply()
        }
    }
    
    fun hasCompletedOnboarding(): Boolean {
        return sharedPreferences.getBoolean(KEY_ONBOARDING_COMPLETED, false)
    }
    
    fun clearOnboardingStatus() {
        sharedPreferences.edit().apply {
            remove(KEY_ONBOARDING_COMPLETED)
            apply()
        }
    }

    fun getAuthToken(): String {
        val token = getToken()
        val result = if (token != null) {
            println("PrefsManager: Found valid token: ${token.take(10)}...")
            token
        } else {
            println("PrefsManager: No valid token found")
            ""
        }
        return result
    }
}
