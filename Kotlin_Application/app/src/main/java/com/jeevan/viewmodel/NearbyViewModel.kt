package com.jeevan.viewmodel

import android.annotation.SuppressLint
import android.app.Application
import android.location.Geocoder
import android.location.Location
import android.os.Looper
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.jeevan.models.Pharmacy
import com.jeevan.models.UserLocation
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.Locale
import kotlin.math.max
import kotlin.math.min

class NearbyViewModel(application: Application) : AndroidViewModel(application) {
    
    private val _userLocation = MutableStateFlow<UserLocation?>(null)
    val userLocation: StateFlow<UserLocation?> = _userLocation.asStateFlow()
    
    private val _pharmacies = MutableStateFlow<List<Pharmacy>>(emptyList())
    val pharmacies: StateFlow<List<Pharmacy>> = _pharmacies.asStateFlow()
    
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
        // Load dummy pharmacies on initialization for testing
        // This helps ensure we always have data to display
        viewModelScope.launch {
            // Default location (Mumbai central coordinates)
            searchPharmaciesNear(19.0760, 72.8777)
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
                
                // Search for pharmacies near this location
                searchPharmaciesNear(location.latitude, location.longitude)
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
                    
                    // Search pharmacies near the searched location
                    searchPharmaciesNear(latitude, longitude)
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
    suspend fun searchPharmaciesNear(latitude: Double, longitude: Double) {
        _isLoading.value = true
        
        try {
            // Simulate a network delay for testing
            delay(1000)
            
            println("DEBUG: Searching pharmacies near lat: $latitude, lng: $longitude")
            
            // For demonstration purposes, generate dummy pharmacies around the given location
            val dummyPharmacies = generateDummyPharmacies(latitude, longitude)
            println("DEBUG: Generated ${dummyPharmacies.size} pharmacies")
            dummyPharmacies.forEachIndexed { index, pharmacy ->
                println("DEBUG: Pharmacy $index: ${pharmacy.name} at (${pharmacy.latitude}, ${pharmacy.longitude}), distance: ${pharmacy.distance} km")
            }
            
            _pharmacies.value = dummyPharmacies
        } catch (e: Exception) {
            println("Pharmacy search error: ${e.message}")
            e.printStackTrace()
        } finally {
            _isLoading.value = false
        }
    }
    
    fun refreshPharmacies() {
        userLocation.value?.let {
            viewModelScope.launch {
                searchPharmaciesNear(it.latitude, it.longitude)
            }
        }
    }
    
    // For demonstration purposes only
    private fun generateDummyPharmacies(centerLat: Double, centerLng: Double): List<Pharmacy> {
        val pharmacyNames = listOf(
            "MedPlus Pharmacy",
            "Apollo Pharmacy",
            "HealthMart Drugs",
            "Wellness Pharmacy",
            "City Drug Store",
            "Family Pharmacy",
            "Care Pharmacy",
            "Quick Meds",
            "Healing Pharmacy",
            "Metro Medicines",
            "LifeCare Pharmacy",
            "MediLife Stores",
            "Cure Pharmacy",
            "Health First Pharmacy",
            "TrustCare Medicines"
        )
        
        val streetNames = listOf(
            "Main Street", "Park Road", "Gandhi Road", "Station Road", 
            "MG Road", "Market Street", "Hospital Road", "College Road",
            "Temple Street", "Lake Road", "Hill View Road", "Nehru Road"
        )
        
        // Create predefined offsets to ensure distinct pharmacy locations
        val predefinedOffsets = listOf(
            Pair(0.015, 0.012),  // Northeast
            Pair(-0.014, 0.013),  // Northwest
            Pair(-0.012, -0.016),  // Southwest
            Pair(0.017, -0.011),  // Southeast
            Pair(0.008, 0.024),  // Further Northeast
            Pair(-0.022, 0.007),  // Further Northwest
            Pair(-0.018, -0.009),  // Further Southwest
            Pair(0.021, -0.015),  // Further Southeast
            Pair(0.001, 0.009),  // Near North
            Pair(0.005, -0.007)   // Near South
        )
        
        println("DEBUG: Generating pharmacies around ($centerLat, $centerLng)")
        
        return List(10) { index ->
            // Use predefined offsets for more distinct locations
            val offset = predefinedOffsets[index % predefinedOffsets.size]
            
            val pharmacyLat = centerLat + offset.first
            val pharmacyLng = centerLng + offset.second
            
            // Calculate distance from center point
            val distance = calculateDistance(centerLat, centerLng, pharmacyLat, pharmacyLng)
            
            // Generate realistic address
            val streetNumber = (1..999).random()
            val streetName = streetNames.random()
            val pincode = (100000..999999).random()
            val address = "$streetNumber $streetName, $pincode"
            
            // Generate realistic phone number (India format)
            val phonePrefix = listOf("9", "8", "7").random()
            val phoneNumber = "+91 $phonePrefix${(1000000000..9999999999).random().toString().substring(1)}"
            
            // Determine if pharmacy is open (80% chance)
            val isOpen = Math.random() > 0.2
            
            // Generate random rating between 3.0 and 5.0
            val rating = (3.0 + Math.random() * 2.0).toFloat()
            
            val pharmacy = Pharmacy(
                id = "pharmacy_$index",
                name = pharmacyNames[index % pharmacyNames.size],
                address = address,
                latitude = pharmacyLat,
                longitude = pharmacyLng,
                distance = distance,
                phone = phoneNumber,
                isOpen = isOpen,
                rating = rating
            )
            
            println("DEBUG: Generated pharmacy ${index + 1}: ${pharmacy.name} at (${pharmacy.latitude}, ${pharmacy.longitude}), distance: ${pharmacy.distance} km")
            
            pharmacy
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