package com.jeevan.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider

class DiagnoseViewModelFactory : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(DiagnoseViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return DiagnoseViewModel() as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
} 