package com.example.jeevanandroid.network

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST

// Define API endpoints for authentication
interface AuthApi {
    @POST("api/auth/register")
    suspend fun register(@Body request: AuthRequest): AuthResponse

    @POST("api/auth/login")
    suspend fun login(@Body request: AuthRequest): AuthResponse

    @POST("api/auth/forgot-password")
    suspend fun forgotPassword(@Body request: ForgotPasswordRequest): AuthResponse

    companion object {
        private var retrofitService: AuthApi? = null

        fun getInstance(): AuthApi {
            if (retrofitService == null) {
                val retrofit = Retrofit.Builder()
                    .baseUrl("http://10.0.2.2:8080/") // Updated base URL for Android emulator
                    .addConverterFactory(GsonConverterFactory.create())
                    .build()
                retrofitService = retrofit.create(AuthApi::class.java)
            }
            return retrofitService!!
        }
    }
}

// Data class for authentication request
data class AuthRequest(
    val email: String,
    val password: String
)

// Data class for authentication response
data class AuthResponse(
    val token: String?,
    val message: String?,
    val error: String? = null
)

data class ForgotPasswordRequest(
    val email: String
)
