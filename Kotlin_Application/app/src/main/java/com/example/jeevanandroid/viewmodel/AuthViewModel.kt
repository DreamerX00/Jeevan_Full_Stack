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

    private val _isLoading = MutableLiveData<Boolean>().apply { value = false }
    val isLoading: LiveData<Boolean> = _isLoading

    private val _isLoggedIn = MutableLiveData<Boolean>().apply { value = false }
    val isLoggedIn: LiveData<Boolean> = _isLoggedIn

    private val authApi = RetrofitClient.createService(AuthApi::class.java)

    init {
        // Check for valid cached token on initialization
        checkLoginStatus()
    }

    private fun checkLoginStatus() {
        _isLoggedIn.value = prefsManager.hasValidToken()
    }

    fun login(email: String, password: String) {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                val response = authApi.login(AuthRequest(email, password))
                
                if (response.token != null) {
                    prefsManager.saveToken(response.token)
                    _isLoggedIn.value = true
                }
                
                _authResponse.postValue(response)
            } catch (e: Exception) {
                _authResponse.postValue(AuthResponse(
                    token = null,
                    message = null,
                    error = e.message
                ))
                _isLoggedIn.value = false
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
                
                if (response.token != null) {
                    prefsManager.saveToken(response.token)
                    _isLoggedIn.value = true
                }
                
                _authResponse.postValue(response)
            } catch (e: Exception) {
                _authResponse.postValue(AuthResponse(
                    token = null,
                    message = null,
                    error = e.message
                ))
                _isLoggedIn.value = false
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
                _authResponse.postValue(response)
            } catch (e: Exception) {
                _authResponse.postValue(AuthResponse(
                    token = null,
                    message = null,
                    error = e.message
                ))
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun logout() {
        prefsManager.clearToken()
        _isLoggedIn.value = false
        _authResponse.value = null
    }

    fun getStoredToken(): String? {
        return prefsManager.getToken()
    }

    fun clearAuthResponse() {
        _authResponse.value = null
    }
}
