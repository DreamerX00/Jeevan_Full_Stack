package com.jeevan.ui.nearby

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Cancel
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.DirectionsCar
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.MapView
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import com.jeevan.models.Hospital
import com.jeevan.models.UserLocation
import com.jeevan.ui.theme.JeevanAndroidTheme
import com.jeevan.viewmodel.HospitalViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HospitalScreen(
    navController: NavController,
    hospitalViewModel: HospitalViewModel = viewModel()
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    
    // State
    val hospitals by hospitalViewModel.hospitals.collectAsState()
    val isLoading by hospitalViewModel.isLoading.collectAsState()
    val userLocation by hospitalViewModel.userLocation.collectAsState()
    val searchQuery by hospitalViewModel.searchQuery.collectAsState()
    val mapZoom by hospitalViewModel.mapZoom.collectAsState()
    
    // UI state
    var showList by remember { mutableStateOf(false) }
    
    // Map related state
    var googleMap by remember { mutableStateOf<GoogleMap?>(null) }
    val mapView = remember { MapView(context) }
    var hasLocationPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        )
    }
    
    // Location permission launcher
    val locationPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        hasLocationPermission = isGranted
        if (isGranted) {
            // Get user location
            hospitalViewModel.getCurrentLocation()
        } else {
            Toast.makeText(
                context,
                "Location permission is required to show nearby hospitals",
                Toast.LENGTH_LONG
            ).show()
        }
    }
    
    // Request location permission on first launch
    LaunchedEffect(key1 = Unit) {
        if (!hasLocationPermission) {
            locationPermissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
        } else {
            hospitalViewModel.getCurrentLocation()
        }
    }
    
    // Update map when user location or hospitals change
    LaunchedEffect(userLocation, hospitals) {
        googleMap?.let { map ->
            if (userLocation != null) {
                // Clear previous markers
                map.clear()
                
                // Add user location marker
                val userMarker = map.addMarker(
                    MarkerOptions()
                        .position(LatLng(userLocation!!.latitude, userLocation!!.longitude))
                        .title("Your Location")
                        .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE))
                )
                
                println("DEBUG: Added user marker at (${userLocation!!.latitude}, ${userLocation!!.longitude})")
                
                // Add hospital markers
                hospitals.forEachIndexed { index, hospital ->
                    println("DEBUG: Adding hospital marker ${index + 1}: ${hospital.name} at (${hospital.latitude}, ${hospital.longitude})")
                    
                    val hospitalMarker = map.addMarker(
                        MarkerOptions()
                            .position(LatLng(hospital.latitude, hospital.longitude))
                            .title(hospital.name)
                            .snippet(hospital.address)
                            .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN))  // Green for hospitals
                            .visible(true)
                            .zIndex(1.0f)
                    )
                    
                    // Add tag to marker for identification
                    hospitalMarker?.tag = hospital.id
                }
                
                // Move camera to user location
                map.animateCamera(
                    CameraUpdateFactory.newLatLngZoom(
                        LatLng(userLocation!!.latitude, userLocation!!.longitude),
                        mapZoom
                    )
                )
                
                // Ensure map is updated
                map.setOnMapLoadedCallback {
                    println("DEBUG: Map loaded with ${hospitals.size} hospital markers")
                }
            }
        }
    }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Nearby Hospitals") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF08BAED),
                    titleContentColor = Color.White
                ),
                navigationIcon = {
                    IconButton(onClick = { navController.navigateUp() }) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Back",
                            tint = Color.White
                        )
                    }
                },
                actions = {
                    IconButton(onClick = { showList = !showList }) {
                        Icon(
                            imageVector = if (showList) Icons.Default.Map else Icons.Default.List,
                            contentDescription = if (showList) "Show Map" else "Show List",
                            tint = Color.White
                        )
                    }
                    IconButton(onClick = { hospitalViewModel.refreshHospitals() }) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Refresh",
                            tint = Color.White
                        )
                    }
                }
            )
        },
        floatingActionButton = {
            if (!showList) {
                FloatingActionButton(
                    onClick = {
                        if (hasLocationPermission) {
                            hospitalViewModel.getCurrentLocation()
                        } else {
                            locationPermissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
                        }
                    },
                    containerColor = Color(0xFF08BAED),
                    contentColor = Color.White
                ) {
                    Icon(
                        imageVector = Icons.Default.MyLocation,
                        contentDescription = "My Location"
                    )
                }
            }
        }
    ) { paddingValues ->
        if (!showList) {
            // MAP VIEW
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .background(Color(0xFFFCE4EC)) // Light pink background to match your theme
            ) {
                // Map container
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(bottom = 80.dp) // Space for the search bar
                ) {
                    // Google Map View
                    AndroidView(
                        factory = { mapView },
                        modifier = Modifier.fillMaxSize(),
                        update = { view ->
                            view.onCreate(null)
                            view.onResume()
                            
                            view.getMapAsync { map ->
                                googleMap = map
                                
                                // Enable location layer if permission granted
                                try {
                                    if (hasLocationPermission) {
                                        map.isMyLocationEnabled = true
                                        map.uiSettings.isMyLocationButtonEnabled = false
                                    }
                                } catch (e: Exception) {
                                    println("DEBUG: Error enabling location: ${e.message}")
                                }
                                
                                // Map UI settings
                                map.uiSettings.apply {
                                    isZoomControlsEnabled = true
                                    isCompassEnabled = true
                                    isMapToolbarEnabled = true
                                }
                                
                                // Initial setup if we already have a location
                                userLocation?.let { location ->
                                    map.moveCamera(
                                        CameraUpdateFactory.newLatLngZoom(
                                            LatLng(location.latitude, location.longitude),
                                            mapZoom
                                        )
                                    )
                                    
                                    // Force refresh of markers
                                    coroutineScope.launch {
                                        delay(500) // Short delay to ensure map is ready
                                        refreshMapMarkers(map, location, hospitals)
                                    }
                                }
                                
                                // Map click listener
                                map.setOnMapClickListener { latLng ->
                                    // You could use this for setting a custom location
                                    coroutineScope.launch {
                                        hospitalViewModel.searchHospitalsNear(latLng.latitude, latLng.longitude)
                                    }
                                }
                                
                                // Marker click listener
                                map.setOnMarkerClickListener { marker ->
                                    marker.showInfoWindow()
                                    false // Return false to show default behavior
                                }
                            }
                        }
                    )
                    
                    // Loading indicator
                    if (isLoading) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(Color.Black.copy(alpha = 0.3f)),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator(color = Color.White)
                        }
                    }
                    
                    // Map controls - zoom in/out
                    Column(
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(16.dp)
                    ) {
                        Button(
                            onClick = { hospitalViewModel.zoomIn() },
                            modifier = Modifier.size(40.dp),
                            contentPadding = PaddingValues(0.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color.White,
                                contentColor = Color.Black
                            ),
                            shape = CircleShape
                        ) {
                            Icon(
                                imageVector = Icons.Default.Add,
                                contentDescription = "Zoom In"
                            )
                        }
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        Button(
                            onClick = { hospitalViewModel.zoomOut() },
                            modifier = Modifier.size(40.dp),
                            contentPadding = PaddingValues(0.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color.White,
                                contentColor = Color.Black
                            ),
                            shape = CircleShape
                        ) {
                            Icon(
                                imageVector = Icons.Default.Remove,
                                contentDescription = "Zoom Out"
                            )
                        }
                    }
                }
                
                // Search bar
                Card(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .fillMaxWidth()
                        .padding(16.dp)
                        .shadow(8.dp, RoundedCornerShape(24.dp)),
                    colors = CardDefaults.cardColors(
                        containerColor = Color.White
                    ),
                    shape = RoundedCornerShape(24.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .padding(16.dp)
                    ) {
                        // Search field
                        OutlinedTextField(
                            value = searchQuery,
                            onValueChange = { hospitalViewModel.updateSearchQuery(it) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 8.dp),
                            placeholder = { Text("Search location") },
                            leadingIcon = {
                                Icon(
                                    imageVector = Icons.Default.Search,
                                    contentDescription = "Search"
                                )
                            },
                            trailingIcon = {
                                if (searchQuery.isNotEmpty()) {
                                    IconButton(onClick = { hospitalViewModel.updateSearchQuery("") }) {
                                        Icon(
                                            imageVector = Icons.Default.Clear,
                                            contentDescription = "Clear"
                                        )
                                    }
                                }
                            },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Color(0xFF08BAED),
                                unfocusedBorderColor = Color.Gray,
                                cursorColor = Color(0xFF08BAED)
                            ),
                            shape = RoundedCornerShape(16.dp)
                        )
                        
                        // Search button
                        Button(
                            onClick = { 
                                coroutineScope.launch {
                                    hospitalViewModel.searchByQuery()
                                }
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(50.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color(0xFF08BAED),
                                contentColor = Color.White
                            ),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Search,
                                contentDescription = "Search"
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Search Hospitals")
                        }
                        
                        // Results count
                        if (hospitals.isNotEmpty()) {
                            Text(
                                text = "Found ${hospitals.size} hospitals nearby",
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(top = 8.dp),
                                textAlign = TextAlign.Center,
                                fontSize = 14.sp,
                                color = Color(0xFF08BAED),
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }
            }
        } else {
            // LIST VIEW
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .background(Color(0xFFFCE4EC))
            ) {
                // Search bar for list view
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedTextField(
                            value = searchQuery,
                            onValueChange = { hospitalViewModel.updateSearchQuery(it) },
                            modifier = Modifier
                                .weight(1f)
                                .padding(end = 8.dp),
                            placeholder = { Text("Search location") },
                            leadingIcon = { Icon(Icons.Default.Search, "Search") },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Color(0xFF08BAED),
                                unfocusedBorderColor = Color.Gray,
                                cursorColor = Color(0xFF08BAED)
                            ),
                            shape = RoundedCornerShape(8.dp)
                        )
                        
                        Button(
                            onClick = { hospitalViewModel.searchByQuery() },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color(0xFF08BAED)
                            )
                        ) {
                            Text("Search")
                        }
                    }
                }
                
                // Results count
                if (hospitals.isNotEmpty()) {
                    Text(
                        text = "Found ${hospitals.size} hospitals nearby",
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp),
                        textAlign = TextAlign.Center,
                        fontSize = 16.sp,
                        color = Color(0xFF08BAED),
                        fontWeight = FontWeight.Bold
                    )
                }
                
                // List of hospitals
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp)
                ) {
                    items(hospitals) { hospital ->
                        HospitalListItem(
                            hospital = hospital,
                            onItemClick = { 
                                // When clicked, show on map
                                showList = false
                                // Center map on this hospital
                                googleMap?.animateCamera(
                                    CameraUpdateFactory.newLatLngZoom(
                                        LatLng(hospital.latitude, hospital.longitude),
                                        18f
                                    )
                                )
                            },
                            onNavigateClick = {
                                // Open Google Maps for navigation
                                val gmmIntentUri = Uri.parse(
                                    "google.navigation:q=${hospital.latitude},${hospital.longitude}&mode=d"
                                )
                                val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri)
                                mapIntent.setPackage("com.google.android.apps.maps")
                                
                                if (mapIntent.resolveActivity(context.packageManager) != null) {
                                    context.startActivity(mapIntent)
                                } else {
                                    // If Google Maps app is not installed, open in browser
                                    val browserIntent = Intent(
                                        Intent.ACTION_VIEW,
                                        Uri.parse("https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}")
                                    )
                                    context.startActivity(browserIntent)
                                }
                            },
                            onCallClick = {
                                // Call the hospital
                                val callIntent = Intent(Intent.ACTION_DIAL)
                                callIntent.data = Uri.parse("tel:${hospital.phone}")
                                context.startActivity(callIntent)
                            }
                        )
                    }
                }
                
                // Loading indicator
                if (isLoading) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Color.Black.copy(alpha = 0.3f)),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(color = Color.White)
                    }
                }
            }
        }
    }
    
    // Lifecycle handling
    DisposableEffect(Unit) {
        onDispose {
            mapView.onDestroy()
        }
    }
}

// Helper function to refresh map markers
private fun refreshMapMarkers(
    map: GoogleMap,
    userLocation: UserLocation,
    hospitals: List<Hospital>
) {
    // Clear previous markers
    map.clear()
    
    // Add user location marker
    val userMarker = map.addMarker(
        MarkerOptions()
            .position(LatLng(userLocation.latitude, userLocation.longitude))
            .title("Your Location")
            .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE))
    )
    
    println("DEBUG: Manually refreshed user marker at (${userLocation.latitude}, ${userLocation.longitude})")
    
    // Add hospital markers with a small delay between each to prevent marker conflicts
    hospitals.forEachIndexed { index, hospital ->
        println("DEBUG: Manually adding hospital marker ${index + 1}: ${hospital.name} at (${hospital.latitude}, ${hospital.longitude})")
        
        val hospitalMarker = map.addMarker(
            MarkerOptions()
                .position(LatLng(hospital.latitude, hospital.longitude))
                .title(hospital.name)
                .snippet(hospital.address)
                .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN))  // Green for hospitals
                .visible(true)
                .zIndex(1.0f)
        )
        
        // Add tag to marker for identification
        hospitalMarker?.tag = hospital.id
    }
    
    // Update camera position to ensure everything is visible
    map.animateCamera(
        CameraUpdateFactory.newLatLngZoom(
            LatLng(userLocation.latitude, userLocation.longitude),
            14f // Slightly zoomed out to show more markers
        )
    )
}

@Composable
fun HospitalListItem(
    hospital: Hospital,
    onItemClick: () -> Unit,
    onNavigateClick: () -> Unit,
    onCallClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
            .clickable { onItemClick() },
        colors = CardDefaults.cardColors(
            containerColor = Color.White
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Name and status
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = hospital.name,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = Color.Black
                    )
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(
                            imageVector = if (hospital.isOpen) Icons.Default.CheckCircle else Icons.Default.Cancel,
                            contentDescription = if (hospital.isOpen) "Open" else "Closed",
                            tint = if (hospital.isOpen) Color.Green else Color.Red,
                            modifier = Modifier.size(14.dp)
                        )
                        Text(
                            text = if (hospital.isOpen) "Open" else "Closed",
                            fontSize = 12.sp,
                            color = if (hospital.isOpen) Color.Green else Color.Red
                        )
                        
                        if (hospital.emergencyServices) {
                            Spacer(modifier = Modifier.width(8.dp))
                            Icon(
                                imageVector = Icons.Default.LocalHospital,
                                contentDescription = "Emergency Services",
                                tint = Color.Red,
                                modifier = Modifier.size(14.dp)
                            )
                            Text(
                                text = "Emergency",
                                fontSize = 12.sp,
                                color = Color.Red
                            )
                        }
                    }
                }
                
                // Distance
                Text(
                    text = String.format("%.1f km", hospital.distance),
                    fontSize = 14.sp,
                    color = Color.Gray
                )
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Address
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.LocationOn,
                    contentDescription = "Address",
                    tint = Color(0xFF08BAED),
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = hospital.address,
                    fontSize = 14.sp,
                    color = Color.DarkGray,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
            
            Spacer(modifier = Modifier.height(4.dp))
            
            // Phone
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Phone,
                    contentDescription = "Phone",
                    tint = Color(0xFF08BAED),
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = hospital.phone,
                    fontSize = 14.sp,
                    color = Color.DarkGray
                )
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Specialties
            if (hospital.specialties.isNotEmpty()) {
                Row(verticalAlignment = Alignment.Top) {
                    Icon(
                        imageVector = Icons.Default.Star,
                        contentDescription = "Specialties",
                        tint = Color(0xFF08BAED),
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Specialties: ${hospital.specialties.joinToString(", ")}",
                        fontSize = 14.sp,
                        color = Color.DarkGray,
                        lineHeight = 18.sp
                    )
                }
                
                Spacer(modifier = Modifier.height(8.dp))
            }
            
            // Rating
            Row(verticalAlignment = Alignment.CenterVertically) {
                repeat(5) { index ->
                    Icon(
                        imageVector = Icons.Default.Star,
                        contentDescription = "Rating Star",
                        tint = if (index < hospital.rating) Color(0xFFFFD700) else Color.LightGray,
                        modifier = Modifier.size(16.dp)
                    )
                }
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = String.format("%.1f", hospital.rating),
                    fontSize = 14.sp,
                    color = Color.DarkGray
                )
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Action buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                OutlinedButton(
                    onClick = onCallClick,
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = Color(0xFF08BAED)
                    ),
                    border = ButtonDefaults.outlinedButtonBorder.copy(
                        brush = SolidColor(Color(0xFF08BAED))
                    )
                ) {
                    Icon(
                        imageVector = Icons.Default.Call,
                        contentDescription = "Call"
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Call")
                }
                
                Button(
                    onClick = onNavigateClick,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF08BAED)
                    )
                ) {
                    Icon(
                        imageVector = Icons.Default.DirectionsCar,
                        contentDescription = "Navigate"
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Navigate")
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun HospitalScreenPreview() {
    JeevanAndroidTheme {
        HospitalScreen(
            navController = rememberNavController(),
            hospitalViewModel = viewModel())
    }
}