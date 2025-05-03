package com.example.jeevanandroid.network

import com.example.jeevanandroid.utils.NetworkUtils
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager
import java.security.cert.X509Certificate

object RetrofitClient {
    // For emulator use 10.0.2.2, for physical device use your computer's IP address
    private const val EMULATOR_URL = "http://10.0.2.2:8080/"
    private const val DEVICE_URL = "http://172.16.0.150:8080/" // Your computer's actual IP address
    
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

    private val okHttpClient = OkHttpClient.Builder().apply {
        // Trust all certificates for development
        val sslContext = SSLContext.getInstance("SSL")
        sslContext.init(null, trustAllCerts, java.security.SecureRandom())
        
        sslSocketFactory(sslContext.socketFactory, trustAllCerts[0] as X509TrustManager)
        hostnameVerifier { _, _ -> true }
        
        // Add logging
        addInterceptor(loggingInterceptor)
        
        // Add timeouts
        connectTimeout(60, TimeUnit.SECONDS)
        readTimeout(60, TimeUnit.SECONDS)
        writeTimeout(60, TimeUnit.SECONDS)
        
        // Add request interceptor for debugging
        addInterceptor { chain ->
            val request = chain.request()
            println("Making request to: ${request.url}")
            chain.proceed(request)
        }
    }.build()

    private val retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(getBaseUrl())
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    fun <T> createService(serviceClass: Class<T>): T {
        return retrofit.create(serviceClass)
    }
}