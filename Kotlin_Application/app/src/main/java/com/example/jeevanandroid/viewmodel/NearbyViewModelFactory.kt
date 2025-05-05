package com.example.jeevanandroid.viewmodel

import android.app.Application
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider

class NearbyViewModelFactory(private val application: Application) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(NearbyViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return NearbyViewModel(application) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
} 