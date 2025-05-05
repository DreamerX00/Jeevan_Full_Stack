package com.example.jeevanandroid.network

import com.example.jeevanandroid.utils.NetworkUtils
import com.example.jeevanandroid.utils.PrefsManager
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager
import java.security.cert.X509Certificate

// Auth interceptor for adding JWT token to requests
class AuthInterceptor(private val prefsManager: PrefsManager) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()
        
        println("AuthInterceptor: Request URL: ${originalRequest.url}")
        
        // Skip authentication for login/register endpoints
        if (originalRequest.url.toString().contains("/api/auth/")) {
            println("AuthInterceptor: Skipping auth for auth endpoint")
            return chain.proceed(originalRequest)
        }
        
        // Get token from preferences
        val token = prefsManager.getAuthToken()
        println("AuthInterceptor: Token found: ${!token.isNullOrEmpty()}")
        
        // If token exists, add it to the header
        return if (!token.isNullOrEmpty()) {
            val newRequest = originalRequest.newBuilder()
                .header("Authorization", "Bearer $token")
                .build()
            println("AuthInterceptor: Added Authorization header: Bearer ${token.take(10)}...")
            chain.proceed(newRequest)
        } else {
            println("AuthInterceptor: No token found, proceeding without auth")
            chain.proceed(originalRequest)
        }
    }
}

object RetrofitClient {
    // For emulator use 10.0.2.2, for physical device use your computer's IP address
    private const val EMULATOR_URL = "http://10.0.2.2:8080/"
    //private const val DEVICE_URL = "http://172.16.0.150:8080/" // Your computer's actual IP address
    
    // Get the appropriate base URL
    private fun getBaseUrl(): String {
        return NetworkUtils.getBaseUrl(EMULATOR_URL, DEVICE_URL)
    }

    private val trustAllCerts = arrayOf<TrustManager>(object : X509TrustManager {
        override fun checkClientTrusted(chain: Array<X509Certificate>, authType: String) {}
        override fun checkServerTrusted(chain: Array<X509Certificate>, authType: String) {}
        override fun getAcceptedIssuers(): Array<X509Certificate> = arrayOf()
    })

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    // Create an instance of the OkHttpClient with the AuthInterceptor
    private fun createOkHttpClient(prefsManager: PrefsManager): OkHttpClient {
        return OkHttpClient.Builder().apply {
            // Trust all certificates for development
            val sslContext = SSLContext.getInstance("SSL")
            sslContext.init(null, trustAllCerts, java.security.SecureRandom())
            
            sslSocketFactory(sslContext.socketFactory, trustAllCerts[0] as X509TrustManager)
            hostnameVerifier { _, _ -> true }
            
            // Add authentication interceptor
            addInterceptor(AuthInterceptor(prefsManager))
            
            // Add logging
            addInterceptor(loggingInterceptor)
            
            // Add timeouts
            connectTimeout(60, TimeUnit.SECONDS)
            readTimeout(60, TimeUnit.SECONDS)
            writeTimeout(60, TimeUnit.SECONDS)
            
            // Add request interceptor for debugging
            addInterceptor { chain ->
                val request = chain.request()
                println("OkHttp Request: ${request.method} ${request.url}")
                println("OkHttp Headers: ${request.headers}")
                val response = chain.proceed(request)
                println("OkHttp Response: ${response.code} ${response.message}")
                response
            }
        }.build()
    }

    // A reference to the current prefsManager to use with the client
    private var prefsManager: PrefsManager? = null
    
    // Initialize with PrefsManager
    fun initialize(prefsManager: PrefsManager) {
        this.prefsManager = prefsManager
    }

    // Get retrofit instance with auth
    private fun getRetrofit(): Retrofit {
        require(prefsManager != null) { "RetrofitClient must be initialized with PrefsManager before use" }
        
        return Retrofit.Builder()
            .baseUrl(getBaseUrl())
            .client(createOkHttpClient(prefsManager!!))
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    fun <T> createService(serviceClass: Class<T>): T {
        return getRetrofit().create(serviceClass)
    }
}