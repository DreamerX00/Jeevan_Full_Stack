package com.jeevan

import android.app.Application
import com.jeevan.network.RetrofitClient
import com.jeevan.utils.PrefsManager

class JeevanApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Initialize PrefsManager
        val prefsManager = PrefsManager(this)
        
        // Initialize RetrofitClient with PrefsManager
        RetrofitClient.initialize(prefsManager)
        
        // Initialize any application-wide resources here
    }
} 