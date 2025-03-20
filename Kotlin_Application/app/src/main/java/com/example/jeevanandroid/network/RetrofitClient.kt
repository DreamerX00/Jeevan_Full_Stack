package com.example.jeevanandroid.network

import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import com.example.jeevanandroid.utils.PrefsManager

object RetrofitClient {
    private const val BASE_URL = "http://10.0.2.2:8080/" // Points to localhost via Android emulator
    
    // Create authenticated client with token
    fun createAuthenticatedClient(prefsManager: PrefsManager): Retrofit {
        val okHttpClient = OkHttpClient.Builder()
            .addInterceptor(AuthInterceptor(prefsManager))
            .build()
                
        return Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    
    // Create regular client for non-authenticated requests
    fun createClient(): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    
    // Interceptor to add Authorization header with JWT token
    class AuthInterceptor(private val prefsManager: PrefsManager) : Interceptor {
        override fun intercept(chain: Interceptor.Chain): Response {
            val originalRequest = chain.request()
            val token = prefsManager.getToken()
            
            return if (token != null) {
                val newRequest = originalRequest.newBuilder()
                    .header("Authorization", "Bearer $token")
                    .build()
                chain.proceed(newRequest)
            } else {
                chain.proceed(originalRequest)
            }
        }
    }
}