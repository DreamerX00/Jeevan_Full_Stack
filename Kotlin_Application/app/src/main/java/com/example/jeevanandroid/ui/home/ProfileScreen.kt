package com.example.jeevanandroid.ui.home

import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.jeevanandroid.models.UserProfile
import com.example.jeevanandroid.ui.onboarding.BloodGroupSelector
import com.example.jeevanandroid.ui.onboarding.DateOfBirthPicker
import com.example.jeevanandroid.ui.onboarding.FloatingLabelTextField
import com.example.jeevanandroid.ui.onboarding.GenderSelector
import com.example.jeevanandroid.viewmodel.UserProfileViewModel
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.jeevanandroid.viewmodel.UserProfileViewModelFactory
import com.example.jeevanandroid.utils.PrefsManager
import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.ui.text.input.KeyboardType

@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
@Composable
fun ProfileScreen(
    navController: NavController,
    userProfileViewModel: UserProfileViewModel = viewModel()
) {
    val userProfile by userProfileViewModel.userProfile.observeAsState(UserProfile())
    val isLoading by userProfileViewModel.isLoading.observeAsState(false)
    val error by userProfileViewModel.error.observeAsState()
    val saveSuccess by userProfileViewModel.saveSuccess.observeAsState()
    val context = LocalContext.current
    val scrollState = rememberScrollState()
    
    var isEditing by remember { mutableStateOf(false) }
    
    // Load profile data when screen is first displayed
    LaunchedEffect(Unit) {
        println("ProfileScreen: Initial load of user profile")
        userProfileViewModel.loadUserProfile()
    }
    
    // Ensure profile is reloaded when screen is revisited
    DisposableEffect(Unit) {
        println("ProfileScreen: DisposableEffect triggered - loading profile")
        userProfileViewModel.loadUserProfile()
        
        onDispose {
            println("ProfileScreen: DisposableEffect disposed")
        }
    }
    
    // Show error messages
    LaunchedEffect(error) {
        error?.let {
            Toast.makeText(context, it, Toast.LENGTH_LONG).show()
        }
    }
    
    // Show success message
    LaunchedEffect(saveSuccess) {
        if (saveSuccess == true) {
            Toast.makeText(context, "Profile updated successfully", Toast.LENGTH_SHORT).show()
            isEditing = false
        }
    }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("My Profile") },
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
                    if (isEditing) {
                        IconButton(onClick = {
                            userProfileViewModel.saveUserProfile()
                        }) {
                            Icon(
                                imageVector = Icons.Default.Save,
                                contentDescription = "Save",
                                tint = Color.White
                            )
                        }
                    } else {
                        IconButton(onClick = { isEditing = true }) {
                            Icon(
                                imageVector = Icons.Default.Edit,
                                contentDescription = "Edit",
                                tint = Color.White
                            )
                        }
                    }
                }
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFFCE4EC)) // Light pink background
                .padding(paddingValues)
        ) {
            // Main content
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(scrollState)
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Profile header with initials avatar
                ProfileHeader(userProfile, isEditing)
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Profile sections
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .animateContentSize(
                            animationSpec = spring(
                                dampingRatio = Spring.DampingRatioLowBouncy,
                                stiffness = Spring.StiffnessLow
                            )
                        ),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = Color(0xFFFFF5F8) // Very light pink background
                    )
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        // Personal Information Section
                        ProfileSection(
                            title = "Personal Information",
                            icon = Icons.Default.Person,
                            isEditing = isEditing
                        ) {
                            PersonalInfoContent(userProfile, userProfileViewModel, isEditing)
                        }
                        
                        Divider(modifier = Modifier.padding(vertical = 16.dp))
                        
                        // Medical Details Section
                        ProfileSection(
                            title = "Medical Details",
                            icon = Icons.Default.Favorite,
                            isEditing = isEditing
                        ) {
                            MedicalDetailsContent(userProfile, userProfileViewModel, isEditing)
                        }
                        
                        Divider(modifier = Modifier.padding(vertical = 16.dp))
                        
                        // Emergency Contact Section
                        ProfileSection(
                            title = "Emergency Contact",
                            icon = Icons.Default.Call,
                            isEditing = isEditing
                        ) {
                            EmergencyContactContent(userProfile, userProfileViewModel, isEditing)
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(24.dp))
                
                if (isEditing) {
                    Button(
                        onClick = {
                            userProfileViewModel.saveUserProfile()
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFF08BAED),
                            contentColor = Color.White
                        ),
                        shape = RoundedCornerShape(25.dp)
                    ) {
                        Text("Save Changes", fontSize = 16.sp)
                    }
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    OutlinedButton(
                        onClick = { isEditing = false },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp),
                        shape = RoundedCornerShape(25.dp)
                    ) {
                        Text("Cancel", fontSize = 16.sp)
                    }
                }
            }
            
            // Loading indicator
            if (isLoading) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.White.copy(alpha = 0.9f)),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = Color(0xFF08BAED))
                }
            }
        }
    }
}

@Composable
fun ProfileHeader(userProfile: UserProfile, isEditing: Boolean) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp)
            .then(
                if (isEditing) {
                    Modifier.background(
                        color = Color.White,
                        shape = RoundedCornerShape(16.dp)
                    ).padding(vertical = 8.dp)
                } else Modifier
            )
    ) {
        // Avatar with initials
        Box(
            modifier = Modifier
                .size(100.dp)
                .clip(CircleShape)
                .background(Color(0xFF08BAED)),
            contentAlignment = Alignment.Center
        ) {
            val initials = buildString {
                if (userProfile.firstName.isNotEmpty()) append(userProfile.firstName.first().uppercase())
                if (userProfile.lastName.isNotEmpty()) append(userProfile.lastName.first().uppercase())
            }
            
            Text(
                text = initials.ifEmpty { "?" },
                fontSize = 36.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Name
        Text(
            text = if (userProfile.firstName.isNotEmpty() || userProfile.lastName.isNotEmpty()) 
                   "${userProfile.firstName} ${userProfile.lastName}"
                   else "Complete Your Profile",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF08BAED),
            textAlign = TextAlign.Center
        )
        
        // Edit status
        if (isEditing) {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Editing Profile",
                fontSize = 14.sp,
                color = Color(0xFF08BAED),
                fontWeight = FontWeight.Medium
            )
        }
    }
}

@Composable
fun ProfileSection(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    isEditing: Boolean,
    content: @Composable () -> Unit
) {
    var expanded by remember { mutableStateOf(true) }
    
    Column {
        // Section header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { expanded = !expanded }
                .padding(vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = Color(0xFF08BAED),
                modifier = Modifier.size(24.dp)
            )
            
            Spacer(modifier = Modifier.width(12.dp))
            
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF484C4C),
                modifier = Modifier.weight(1f)
            )
            
            IconButton(onClick = { expanded = !expanded }) {
                Icon(
                    imageVector = if (expanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                    contentDescription = if (expanded) "Collapse" else "Expand",
                    tint = Color(0xFF08BAED)
                )
            }
        }
        
        // Section content with animation
        AnimatedVisibility(visible = expanded) {
            Column(modifier = Modifier.padding(start = 36.dp, top = 8.dp, end = 8.dp)) {
                content()
            }
        }
    }
}

@Composable
fun PersonalInfoContent(
    userProfile: UserProfile,
    viewModel: UserProfileViewModel,
    isEditing: Boolean
) {
    if (isEditing) {
        // Editable fields
        FloatingLabelTextField(
            label = "First Name",
            value = userProfile.firstName,
            onValueChange = { viewModel.updateProfileField("firstName", it) },
            keyboardType = KeyboardType.Text
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        FloatingLabelTextField(
            label = "Last Name",
            value = userProfile.lastName,
            onValueChange = { viewModel.updateProfileField("lastName", it) },
            keyboardType = KeyboardType.Text
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        DateOfBirthPicker(
            date = userProfile.dateOfBirth,
            onDateSelected = { viewModel.updateProfileField("dateOfBirth", it) }
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        GenderSelector(
            selectedGender = userProfile.gender,
            onGenderSelected = { viewModel.updateProfileField("gender", it) }
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        FloatingLabelTextField(
            label = "Phone Number",
            value = userProfile.phone,
            onValueChange = { viewModel.updateProfileField("phone", it) },
            keyboardType = KeyboardType.Phone
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        FloatingLabelTextField(
            label = "Address",
            value = userProfile.address,
            onValueChange = { viewModel.updateProfileField("address", it) },
            keyboardType = KeyboardType.Text,
            singleLine = false
        )
    } else {
        // Display fields
        ProfileInfoRow(label = "Name", value = "${userProfile.firstName} ${userProfile.lastName}")
        ProfileInfoRow(label = "Date of Birth", value = userProfile.dateOfBirth)
        ProfileInfoRow(label = "Gender", value = userProfile.gender)
        ProfileInfoRow(label = "Phone", value = userProfile.phone)
        ProfileInfoRow(label = "Address", value = userProfile.address)
    }
}

@Composable
fun MedicalDetailsContent(
    userProfile: UserProfile,
    viewModel: UserProfileViewModel,
    isEditing: Boolean
) {
    if (isEditing) {
        // Editable fields
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Height field
            FloatingLabelTextField(
                label = "Height (cm)",
                value = if (userProfile.height == 0f) "" else userProfile.height.toString(),
                onValueChange = { 
                    if (it.isEmpty()) {
                        viewModel.updateProfileField("height", 0f)
                    } else {
                        it.toFloatOrNull()?.let { value ->
                            viewModel.updateProfileField("height", value)
                        }
                    }
                },
                keyboardType = KeyboardType.Number,
                modifier = Modifier.weight(1f)
            )
            
            // Weight field
            FloatingLabelTextField(
                label = "Weight (kg)",
                value = if (userProfile.weight == 0f) "" else userProfile.weight.toString(),
                onValueChange = { 
                    if (it.isEmpty()) {
                        viewModel.updateProfileField("weight", 0f)
                    } else {
                        it.toFloatOrNull()?.let { value ->
                            viewModel.updateProfileField("weight", value)
                        }
                    }
                },
                keyboardType = KeyboardType.Number,
                modifier = Modifier.weight(1f)
            )
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        BloodGroupSelector(
            selectedBloodGroup = userProfile.bloodGroup,
            onBloodGroupSelected = { viewModel.updateProfileField("bloodGroup", it) }
        )
        
        // Medical conditions, allergies, and medications would go here
        // They require more complex UI components like we saw in the onboarding screens
    } else {
        // Display fields
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            ProfileInfoRow(
                label = "Height", 
                value = if (userProfile.height > 0) "${userProfile.height} cm" else "Not specified",
                modifier = Modifier.weight(1f)
            )
            
            ProfileInfoRow(
                label = "Weight", 
                value = if (userProfile.weight > 0) "${userProfile.weight} kg" else "Not specified",
                modifier = Modifier.weight(1f)
            )
        }
        
        ProfileInfoRow(label = "Blood Group", value = userProfile.bloodGroup.ifEmpty { "Not specified" })
        
        // Display allergies
        Text(
            text = "Allergies:",
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF484C4C),
            modifier = Modifier.padding(top = 8.dp)
        )
        if (userProfile.allergies.isNotEmpty()) {
            Text(
                text = userProfile.allergies.joinToString(", "),
                fontSize = 16.sp,
                color = Color.Black
            )
        } else {
            Text(
                text = "None specified",
                fontSize = 16.sp,
                color = Color.Gray
            )
        }
        
        // Display medical conditions
        Text(
            text = "Medical Conditions:",
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF484C4C),
            modifier = Modifier.padding(top = 8.dp)
        )
        if (userProfile.medicalConditions.isNotEmpty()) {
            Text(
                text = userProfile.medicalConditions.joinToString(", "),
                fontSize = 16.sp,
                color = Color.Black
            )
        } else {
            Text(
                text = "None specified",
                fontSize = 16.sp,
                color = Color.Gray
            )
        }
        
        // Display medications
        Text(
            text = "Medications:",
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF484C4C),
            modifier = Modifier.padding(top = 8.dp)
        )
        if (userProfile.medications.isNotEmpty()) {
            Text(
                text = userProfile.medications.joinToString(", "),
                fontSize = 16.sp,
                color = Color.Black
            )
        } else {
            Text(
                text = "None specified",
                fontSize = 16.sp,
                color = Color.Gray
            )
        }
    }
}

@Composable
fun EmergencyContactContent(
    userProfile: UserProfile,
    viewModel: UserProfileViewModel,
    isEditing: Boolean
) {
    if (isEditing) {
        // Editable emergency contact
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "Emergency Contact Number",
                color = Color(0xFF484C4C),
                fontSize = 12.sp,
                modifier = Modifier.padding(start = 2.dp)
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.Call,
                    contentDescription = "Phone",
                    tint = Color(0xFF08BAED),
                    modifier = Modifier.padding(end = 8.dp)
                )
                
                FloatingLabelTextField(
                    label = "Emergency Contact Number",
                    value = userProfile.emergencyContact,
                    onValueChange = { viewModel.updateProfileField("emergencyContact", it) },
                    keyboardType = KeyboardType.Phone
                )
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = "This number will be contacted in case of emergency",
                color = Color.Gray,
                fontSize = 12.sp,
                modifier = Modifier.padding(start = 2.dp)
            )
        }
    } else {
        // Display emergency contact
        ProfileInfoRow(
            label = "Emergency Contact",
            value = userProfile.emergencyContact.ifEmpty { "Not specified" },
            icon = Icons.Default.Call
        )
    }
}

@Composable
fun ProfileInfoRow(
    label: String,
    value: String,
    modifier: Modifier = Modifier,
    icon: androidx.compose.ui.graphics.vector.ImageVector? = null
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (icon != null) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = Color(0xFF08BAED),
                modifier = Modifier
                    .size(20.dp)
                    .padding(end = 4.dp)
            )
        }
        
        Column {
            Text(
                text = label,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF484C4C)
            )
            
            Text(
                text = value,
                fontSize = 16.sp,
                color = Color.Black
            )
        }
    }
}