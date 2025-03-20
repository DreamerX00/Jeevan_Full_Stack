package com.example.jeevanandroid.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.jeevanandroid.network.AuthApi
import com.example.jeevanandroid.network.AuthRequest
import com.example.jeevanandroid.network.AuthResponse
import com.example.jeevanandroid.network.ForgotPasswordRequest
import com.example.jeevanandroid.utils.PrefsManager
import kotlinx.coroutines.launch

class AuthViewModel(private val prefsManager: PrefsManager) : ViewModel() {
    private val _authResponse = MutableLiveData<AuthResponse>()
    val authResponse: LiveData<AuthResponse> = _authResponse

    fun login(email: String, password: String) {
        viewModelScope.launch {
            try {
                val response = AuthApi.getInstance().login(AuthRequest(email, password))
                _authResponse.postValue(response)

                response.token?.let { token ->
                    prefsManager.saveToken(token) // Store JWT token
                }
            } catch (e: Exception) {
                // Handle exceptions (e.g., network errors)
                _authResponse.postValue(AuthResponse(
                    token = null,
                    message = null,
                    error = e.message
                ))
            }
        }
    }

    fun register(email: String, password: String) {
        viewModelScope.launch {
            try {
                val response = AuthApi.getInstance().register(AuthRequest(email, password))
                _authResponse.postValue(response)

                response.token?.let { token ->
                    prefsManager.saveToken(token) // Store JWT token
                }
            } catch (e: Exception) {
                // Handle exceptions (e.g., network errors)
                _authResponse.postValue(AuthResponse(
                    token = null,
                    message = null,
                    error = e.message
                ))
            }
        }
    }

    fun forgotPassword(email: String) {
        viewModelScope.launch {
            try {
                val response = AuthApi.getInstance().forgotPassword(ForgotPasswordRequest(email))
                _authResponse.postValue(response)
            } catch (e: Exception) {
                // Handle exceptions (e.g., network errors)
                _authResponse.postValue(AuthResponse(
                    token = null,
                    message = null,
                    error = e.message
                ))
            }
        }
    }
}
