package com.example.jeevanandroid.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.jeevanandroid.network.DashboardApi
import com.example.jeevanandroid.network.DashboardResponse
import com.example.jeevanandroid.utils.PrefsManager
import kotlinx.coroutines.launch

class DashboardViewModel(private val prefsManager: PrefsManager) : ViewModel() {
    
    private val _dashboardData = MutableLiveData<DashboardUiState>()
    val dashboardData: LiveData<DashboardUiState> = _dashboardData
    
    init {
        fetchDashboardData()
    }
    
    fun fetchDashboardData() {
        _dashboardData.value = DashboardUiState.Loading
        
        viewModelScope.launch {
            try {
                val response = DashboardApi.getInstance(prefsManager).getDashboardInfo()
                _dashboardData.value = DashboardUiState.Success(response)
            } catch (e: Exception) {
                _dashboardData.value = DashboardUiState.Error(e.message ?: "Unknown error occurred")
            }
        }
    }
    
    // Factory for creating this ViewModel
    class Factory(private val prefsManager: PrefsManager) : androidx.lifecycle.ViewModelProvider.Factory {
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            if (modelClass.isAssignableFrom(DashboardViewModel::class.java)) {
                @Suppress("UNCHECKED_CAST")
                return DashboardViewModel(prefsManager) as T
            }
            throw IllegalArgumentException("Unknown ViewModel class")
        }
    }
}

// Sealed class to represent different UI states
sealed class DashboardUiState {
    object Loading : DashboardUiState()
    data class Success(val data: DashboardResponse) : DashboardUiState()
    data class Error(val message: String) : DashboardUiState()
} 