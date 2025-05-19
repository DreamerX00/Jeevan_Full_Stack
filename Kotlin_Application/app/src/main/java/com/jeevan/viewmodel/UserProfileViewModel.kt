package com.jeevan.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.jeevan.models.UserProfile
import com.jeevan.network.RetrofitClient
import com.jeevan.network.UserProfileApi
import com.jeevan.utils.PrefsManager
import kotlinx.coroutines.launch

class UserProfileViewModel(private val prefsManager: PrefsManager) : ViewModel() {
    private val _userProfile = MutableLiveData<UserProfile>()
    val userProfile: LiveData<UserProfile> = _userProfile

    private val _isLoading = MutableLiveData<Boolean>().apply { value = false }
    val isLoading: LiveData<Boolean> = _isLoading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    private val _currentStep = MutableLiveData<Int>().apply { value = 0 }
    val currentStep: LiveData<Int> = _currentStep

    private val _saveSuccess = MutableLiveData<Boolean>()
    val saveSuccess: LiveData<Boolean> = _saveSuccess

    private val userProfileApi = RetrofitClient.createService(UserProfileApi::class.java)

    init {
        _userProfile.value = UserProfile()
    }

    fun updateProfile(updatedProfile: UserProfile) {
        _userProfile.value = updatedProfile
    }

    fun updateProfileField(field: String, value: Any) {
        val currentProfile = _userProfile.value ?: UserProfile()
        val updatedProfile = when (field) {
            "firstName" -> currentProfile.copy(firstName = value as String)
            "lastName" -> currentProfile.copy(lastName = value as String)
            "dateOfBirth" -> currentProfile.copy(dateOfBirth = value as String)
            "gender" -> currentProfile.copy(gender = value as String)
            "bloodGroup" -> currentProfile.copy(bloodGroup = value as String)
            "height" -> currentProfile.copy(height = value as Float)
            "weight" -> currentProfile.copy(weight = value as Float)
            "phone" -> currentProfile.copy(phone = value as String)
            "address" -> currentProfile.copy(address = value as String)
            "emergencyContact" -> currentProfile.copy(emergencyContact = value as String)
            "allergies" -> currentProfile.copy(allergies = value as List<String>)
            "medicalConditions" -> currentProfile.copy(medicalConditions = value as List<String>)
            "medications" -> currentProfile.copy(medications = value as List<String>)
            else -> currentProfile
        }
        _userProfile.value = updatedProfile
    }

    fun loadUserProfile() {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                println("ProfileDebug: Loading user profile...")
                val response = userProfileApi.getUserProfile()
                
                if (response.profile != null) {
                    println("ProfileDebug: Successfully loaded profile: ${response.profile}")
                    _userProfile.value = response.profile
                } else {
                    println("ProfileDebug: Error loading profile: ${response.error}")
                    _error.value = response.error ?: "Failed to load profile data"
                }
            } catch (e: Exception) {
                println("ProfileDebug: Exception loading profile: ${e.message}")
                e.printStackTrace()
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun saveUserProfile() {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                println("ProfileDebug: Saving user profile: ${_userProfile.value}")
                val response = userProfileApi.createOrUpdateProfile(_userProfile.value!!)
                println("ProfileDebug: Save response: ${response.message}")
                
                // Mark onboarding as completed when profile is saved
                prefsManager.markOnboardingCompleted()
                
                _saveSuccess.value = true
            } catch (e: Exception) {
                println("ProfileDebug: Exception saving profile: ${e.message}")
                e.printStackTrace()
                _error.value = e.message
                _saveSuccess.value = false
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun nextStep() {
        _currentStep.value = (_currentStep.value ?: 0) + 1
    }

    fun previousStep() {
        val current = _currentStep.value ?: 0
        if (current > 0) {
            _currentStep.value = current - 1
        }
    }

    fun goToStep(step: Int) {
        _currentStep.value = step
    }
} 