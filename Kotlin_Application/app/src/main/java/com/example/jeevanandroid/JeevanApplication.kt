package com.example.jeevanandroid

import android.app.Application
import com.example.jeevanandroid.network.RetrofitClient
import com.example.jeevanandroid.utils.PrefsManager

class JeevanApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Initialize PrefsManager
        val prefsManager = PrefsManager(this)
        
        // Initialize RetrofitClient with PrefsManager
        RetrofitClient.initialize(prefsManager)
    }
} 