package com.example.jeevanandroid.viewmodel

import android.annotation.SuppressLint
import android.app.Application
import android.location.Geocoder
import android.location.Location
import android.os.Looper
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.jeevanandroid.models.Hospital
import com.example.jeevanandroid.models.UserLocation
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.Locale
import kotlin.math.max
import kotlin.math.min

class HospitalViewModel(application: Application) : AndroidViewModel(application) {
    
    private val _userLocation = MutableStateFlow<UserLocation?>(null)
    val userLocation: StateFlow<UserLocation?> = _userLocation.asStateFlow()
    
    private val _hospitals = MutableStateFlow<List<Hospital>>(emptyList())
    val hospitals: StateFlow<List<Hospital>> = _hospitals.asStateFlow()
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()
    
    private val _mapZoom = MutableStateFlow(15f)  // Default zoom level
    val mapZoom: StateFlow<Float> = _mapZoom.asStateFlow()
    
    private val fusedLocationClient: FusedLocationProviderClient by lazy {
        LocationServices.getFusedLocationProviderClient(application)
    }
    
    private val geocoder: Geocoder by lazy {
        Geocoder(application, Locale.getDefault())
    }
    
    init {
        // Load dummy hospitals on initialization for testing
        // This helps ensure we always have data to display
        viewModelScope.launch {
            // Default location (Mumbai central coordinates)
            searchHospitalsNear(19.0760, 72.8777)
        }
    }
    
    fun updateSearchQuery(query: String) {
        _searchQuery.value = query
    }
    
    fun zoomIn() {
        _mapZoom.value = min(_mapZoom.value + 1f, 20f)
    }
    
    fun zoomOut() {
        _mapZoom.value = max(_mapZoom.value - 1f, 5f)
    }
    
    @SuppressLint("MissingPermission")
    fun getCurrentLocation() {
        _isLoading.value = true
        
        try {
            // One-time location request
            fusedLocationClient.lastLocation
                .addOnSuccessListener { location: Location? ->
                    if (location != null) {
                        processLocation(location)
                    } else {
                        // Last location might be null, request fresh location
                        requestFreshLocation()
                    }
                }
                .addOnFailureListener { e ->
                    _isLoading.value = false
                    println("Location Error: ${e.message}")
                }
        } catch (e: Exception) {
            _isLoading.value = false
            println("Location Exception: ${e.message}")
        }
    }
    
    @SuppressLint("MissingPermission")
    private fun requestFreshLocation() {
        val locationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 10000)
            .setWaitForAccurateLocation(true)
            .setMinUpdateIntervalMillis(5000)
            .build()
        
        val locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                locationResult.lastLocation?.let { location ->
                    processLocation(location)
                    // Remove updates after getting location
                    fusedLocationClient.removeLocationUpdates(this)
                }
            }
        }
        
        fusedLocationClient.requestLocationUpdates(
            locationRequest,
            locationCallback,
            Looper.getMainLooper()
        )
    }
    
    private fun processLocation(location: Location) {
        viewModelScope.launch {
            try {
                val addressText = getAddressFromLocation(location.latitude, location.longitude)
                
                _userLocation.value = UserLocation(
                    latitude = location.latitude,
                    longitude = location.longitude,
                    address = addressText
                )
                
                // Search for hospitals near this location
                searchHospitalsNear(location.latitude, location.longitude)
            } catch (e: Exception) {
                println("Address Error: ${e.message}")
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    private fun getAddressFromLocation(latitude: Double, longitude: Double): String {
        return try {
            @Suppress("DEPRECATION") // Handle appropriately based on API level
            val addresses = geocoder.getFromLocation(latitude, longitude, 1)
            if (!addresses.isNullOrEmpty()) {
                val address = addresses[0]
                val street = address.thoroughfare ?: ""
                val city = address.locality ?: ""
                val country = address.countryName ?: ""
                
                if (street.isNotEmpty() && city.isNotEmpty()) {
                    "$street, $city, $country"
                } else {
                    "Location: $latitude, $longitude"
                }
            } else {
                "Location: $latitude, $longitude"
            }
        } catch (e: Exception) {
            "Location: $latitude, $longitude"
        }
    }
    
    fun searchByQuery() {
        if (_searchQuery.value.isBlank()) return
        
        println("DEBUG: Searching for location: ${_searchQuery.value}")
        _isLoading.value = true
        viewModelScope.launch {
            try {
                // In a real app, use Geocoder to convert the search query to coordinates
                @Suppress("DEPRECATION") // Handle appropriately based on API level
                val addresses = geocoder.getFromLocationName(_searchQuery.value, 1)
                
                println("DEBUG: Geocoder returned ${addresses?.size ?: 0} addresses")
                
                if (!addresses.isNullOrEmpty()) {
                    val address = addresses[0]
                    val latitude = address.latitude
                    val longitude = address.longitude
                    
                    println("DEBUG: Found coordinates: ($latitude, $longitude) for query: ${_searchQuery.value}")
                    
                    // Update user location without affecting actual device location
                    _userLocation.value = UserLocation(
                        latitude = latitude,
                        longitude = longitude,
                        address = _searchQuery.value
                    )
                    
                    // Search hospitals near the searched location
                    searchHospitalsNear(latitude, longitude)
                } else {
                    println("DEBUG: No location found for query: ${_searchQuery.value}")
                }
            } catch (e: Exception) {
                println("DEBUG: Geocoding error: ${e.message}")
                e.printStackTrace()
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    // This would use Places API or a real backend in production
    suspend fun searchHospitalsNear(latitude: Double, longitude: Double) {
        _isLoading.value = true
        
        try {
            // Simulate a network delay for testing
            kotlinx.coroutines.delay(1000)
            
            println("DEBUG: Searching hospitals near lat: $latitude, lng: $longitude")
            
            // For demonstration purposes, generate dummy hospitals around the given location
            val dummyHospitals = generateDummyHospitals(latitude, longitude)
            println("DEBUG: Generated ${dummyHospitals.size} hospitals")
            dummyHospitals.forEachIndexed { index, hospital ->
                println("DEBUG: Hospital $index: ${hospital.name} at (${hospital.latitude}, ${hospital.longitude}), distance: ${hospital.distance} km")
            }
            
            _hospitals.value = dummyHospitals
        } catch (e: Exception) {
            println("Hospital search error: ${e.message}")
            e.printStackTrace()
        } finally {
            _isLoading.value = false
        }
    }
    
    fun refreshHospitals() {
        userLocation.value?.let {
            viewModelScope.launch {
                searchHospitalsNear(it.latitude, it.longitude)
            }
        }
    }
    
    // For demonstration purposes only
    private fun generateDummyHospitals(centerLat: Double, centerLng: Double): List<Hospital> {
        val hospitalNames = listOf(
            "City General Hospital",
            "Apollo Hospital",
            "Fortis Healthcare",
            "Lilavati Hospital",
            "Max Super Specialty Hospital",
            "Columbia Asia Hospital",
            "Manipal Hospital",
            "Jaslok Hospital",
            "AIIMS Hospital",
            "Kokilaben Hospital",
            "Hinduja Hospital",
            "Tata Memorial Hospital",
            "Seven Hills Hospital",
            "Medanta Hospital",
            "BLK Super Specialty Hospital"
        )
        
        val streetNames = listOf(
            "Main Street", "Park Road", "Gandhi Road", "Station Road", 
            "MG Road", "Hospital Road", "Medical Center Rd", "Healthcare Ave",
            "Temple Street", "Lake Road", "Hill View Road", "Nehru Road"
        )
        
        val specialtiesList = listOf(
            listOf("Cardiology", "Neurology", "Orthopedics"),
            listOf("Oncology", "Pediatrics", "Gynecology"),
            listOf("General Surgery", "Orthopedics", "Emergency Medicine"),
            listOf("Neurology", "Cardiology", "Nephrology"),
            listOf("Pediatrics", "Dermatology", "ENT"),
            listOf("Ophthalmology", "Dentistry", "Psychiatry"),
            listOf("Cardiology", "Orthopedics", "Urology"),
            listOf("General Medicine", "Surgery", "Obstetrics"),
            listOf("Oncology", "Neurosurgery", "Trauma Care"),
            listOf("Geriatrics", "Physiotherapy", "Radiology")
        )
        
        // Create predefined offsets to ensure distinct hospital locations
        val predefinedOffsets = listOf(
            Pair(0.017, 0.014),  // Northeast
            Pair(-0.016, 0.015),  // Northwest
            Pair(-0.014, -0.018),  // Southwest
            Pair(0.019, -0.013),  // Southeast
            Pair(0.011, 0.026),  // Further Northeast
            Pair(-0.024, 0.009),  // Further Northwest
            Pair(-0.020, -0.011),  // Further Southwest
            Pair(0.023, -0.017),  // Further Southeast
            Pair(0.002, 0.011),  // Near North
            Pair(0.007, -0.009)   // Near South
        )
        
        println("DEBUG: Generating hospitals around ($centerLat, $centerLng)")
        
        return List(10) { index ->
            // Use predefined offsets for more distinct locations
            val offset = predefinedOffsets[index % predefinedOffsets.size]
            
            val hospitalLat = centerLat + offset.first
            val hospitalLng = centerLng + offset.second
            
            // Calculate distance from center point
            val distance = calculateDistance(centerLat, centerLng, hospitalLat, hospitalLng)
            
            // Generate realistic address
            val streetNumber = (1..999).random()
            val streetName = streetNames.random()
            val pincode = (100000..999999).random()
            val address = "$streetNumber $streetName, $pincode"
            
            // Generate realistic phone number (India format)
            val phonePrefix = listOf("9", "8", "7").random()
            val phoneNumber = "+91 $phonePrefix${(1000000000..9999999999).random().toString().substring(1)}"
            
            // Determine if hospital is open (90% chance)
            val isOpen = Math.random() > 0.1
            
            // Determine if hospital has emergency services (80% chance)
            val hasEmergency = Math.random() > 0.2
            
            // Generate random rating between 3.5 and 5.0 (hospitals tend to have higher ratings)
            val rating = (3.5 + Math.random() * 1.5).toFloat()
            
            // Assign specialties
            val specialties = specialtiesList[index % specialtiesList.size]
            
            val hospital = Hospital(
                id = "hospital_$index",
                name = hospitalNames[index % hospitalNames.size],
                address = address,
                latitude = hospitalLat,
                longitude = hospitalLng,
                distance = distance,
                phone = phoneNumber,
                isOpen = isOpen,
                rating = rating,
                emergencyServices = hasEmergency,
                specialties = specialties
            )
            
            println("DEBUG: Generated hospital ${index + 1}: ${hospital.name} at (${hospital.latitude}, ${hospital.longitude}), distance: ${hospital.distance} km")
            
            hospital
        }.sortedBy { it.distance }  // Sort by distance
    }
    
    // Rough distance calculation (not accurate, just for demonstration)
    private fun calculateDistance(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
        val R = 6371 // Earth radius in kilometers
        
        val dLat = Math.toRadians(lat2 - lat1)
        val dLon = Math.toRadians(lon2 - lon1)
        
        val a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
        
        val c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        
        return R * c // Distance in kilometers
    }
} 