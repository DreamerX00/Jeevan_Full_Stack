package com.example.jeevanandroid.network

import com.example.jeevanandroid.models.UserProfile
import retrofit2.http.*

interface UserProfileApi {
    @POST("api/user/profile")
    suspend fun createOrUpdateProfile(@Body profile: UserProfile): ProfileResponse

    @GET("api/user/profile")
    suspend fun getUserProfile(): ProfileResponse
}

data class ProfileResponse(
    val profile: UserProfile?,
    val message: String?,
    val error: String? = null
) 