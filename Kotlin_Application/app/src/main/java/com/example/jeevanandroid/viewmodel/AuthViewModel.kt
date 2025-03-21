package com.example.jeevanandroid.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.jeevanandroid.network.AuthApi
import com.example.jeevanandroid.network.AuthRequest
import com.example.jeevanandroid.network.AuthResponse
import com.example.jeevanandroid.network.ForgotPasswordRequest
import com.example.jeevanandroid.network.RetrofitClient
import com.example.jeevanandroid.utils.PrefsManager
import kotlinx.coroutines.launch

class AuthViewModel(private val prefsManager: PrefsManager) : ViewModel() {
    private val _authResponse = MutableLiveData<AuthResponse>()
    val authResponse: LiveData<AuthResponse> = _authResponse

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val authApi = RetrofitClient.createService(AuthApi::class.java)

    fun login(email: String, password: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                val response = authApi.login(AuthRequest(email, password))
                _authResponse.value = response

                response.token?.let { token ->
                    prefsManager.saveToken(token)
                }
            } catch (e: Exception) {
                _authResponse.value = AuthResponse(
                    token = null,
                    message = null,
                    error = e.message ?: "An unknown error occurred"
                )
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun register(email: String, password: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                val response = authApi.register(AuthRequest(email, password))
                _authResponse.value = response

                response.token?.let { token ->
                    prefsManager.saveToken(token)
                }
            } catch (e: Exception) {
                _authResponse.value = AuthResponse(
                    token = null,
                    message = null,
                    error = e.message ?: "An unknown error occurred"
                )
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun forgotPassword(email: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                val response = authApi.forgotPassword(ForgotPasswordRequest(email))
                _authResponse.value = response
            } catch (e: Exception) {
                _authResponse.value = AuthResponse(
                    token = null,
                    message = null,
                    error = e.message ?: "An unknown error occurred"
                )
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun getStoredToken(): String? {
        return prefsManager.getToken()
    }

    fun clearAuthResponse() {
        _authResponse.value = null
    }
}
