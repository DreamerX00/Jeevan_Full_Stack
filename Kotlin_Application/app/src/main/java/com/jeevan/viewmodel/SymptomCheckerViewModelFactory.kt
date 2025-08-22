package com.jeevan.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider

class SymptomCheckerViewModelFactory : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(SymptomCheckerViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return SymptomCheckerViewModel() as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}