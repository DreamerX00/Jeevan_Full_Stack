package com.jeevan.ui.onboarding

import android.widget.Toast
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.jeevan.android.R
import com.jeevan.ui.components.HeartbeatLoadingIndicator
import com.jeevan.ui.theme.JeevanAndroidTheme
import com.jeevan.utils.PrefsManager
import com.jeevan.viewmodel.UserProfileViewModel
import com.jeevan.viewmodel.UserProfileViewModelFactory

@Composable
fun WelcomeScreen(
    navController: NavController,
    userProfileViewModel: UserProfileViewModel = viewModel()
) {
    val currentStep by userProfileViewModel.currentStep.observeAsState(0)
    val isLoading by userProfileViewModel.isLoading.observeAsState(false)
    val error by userProfileViewModel.error.observeAsState()
    val saveSuccess by userProfileViewModel.saveSuccess.observeAsState()
    val context = LocalContext.current
    
    // Load existing profile data if editing
    LaunchedEffect(Unit) {
        if (navController.previousBackStackEntry?.destination?.route == "home") {
            // User is coming from home screen (edit profile)
            userProfileViewModel.loadUserProfile()
        }
    }

    // Define steps
    val steps = listOf(
        "Welcome",
        "Personal Info",
        "Medical Details",
        "Emergency Contacts",
        "Complete"
    )

    // Show error messages
    LaunchedEffect(error) {
        error?.let {
            Toast.makeText(context, it, Toast.LENGTH_LONG).show()
        }
    }

    // Navigate to home when profile is saved
    LaunchedEffect(saveSuccess) {
        if (saveSuccess == true) {
            navController.navigate("home") {
                popUpTo("welcome") { inclusive = true }
            }
        }
    }
    
    // Change the welcome title based on if editing
    val isEditing = navController.previousBackStackEntry?.destination?.route == "home"
    val welcomeTitle = if (isEditing) "Edit Your Profile" else "Welcome to Jeevan"
    val welcomeSubtitle = if (isEditing) "Update your health information" else "Let's set up your health profile"

    Box(modifier = Modifier.fillMaxSize()) {
        // Background Image based on current step
        Image(
            painter = painterResource(
                id = when(currentStep) {
                    0 -> R.drawable.login_back
                    4 -> R.drawable.login_back
                    else -> R.drawable.registration_back
                }
            ),
            contentDescription = "Background",
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )

        // Main content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Step indicators
            StepIndicator(
                steps = steps,
                currentStep = currentStep,
                onStepClicked = { step ->
                    // Only allow going back to previous steps
                    if (step <= currentStep) {
                        userProfileViewModel.goToStep(step)
                    }
                }
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Step content with animation
            Box(modifier = Modifier.weight(1f)) {
                androidx.compose.animation.AnimatedVisibility(
                    visible = currentStep == 0,
                    enter = slideInHorizontally(initialOffsetX = { 1000 }) + fadeIn(),
                    exit = slideOutHorizontally(targetOffsetX = { -1000 }) + fadeOut()
                ) {
                    WelcomeStepContent(
                        onNext = { userProfileViewModel.nextStep() },
                        isEditing = isEditing,
                        welcomeTitle = welcomeTitle,
                        welcomeSubtitle = welcomeSubtitle
                    )
                }

                androidx.compose.animation.AnimatedVisibility(
                    visible = currentStep == 1,
                    enter = slideInHorizontally(initialOffsetX = { 1000 }) + fadeIn(),
                    exit = slideOutHorizontally(targetOffsetX = { -1000 }) + fadeOut()
                ) {
                    PersonalInfoStep(
                        viewModel = userProfileViewModel,
                        onNext = { userProfileViewModel.nextStep() },
                        onBack = { userProfileViewModel.previousStep() }
                    )
                }

                androidx.compose.animation.AnimatedVisibility(
                    visible = currentStep == 2,
                    enter = slideInHorizontally(initialOffsetX = { 1000 }) + fadeIn(),
                    exit = slideOutHorizontally(targetOffsetX = { -1000 }) + fadeOut()
                ) {
                    MedicalDetailsStep(
                        viewModel = userProfileViewModel,
                        onNext = { userProfileViewModel.nextStep() },
                        onBack = { userProfileViewModel.previousStep() }
                    )
                }

                androidx.compose.animation.AnimatedVisibility(
                    visible = currentStep == 3,
                    enter = slideInHorizontally(initialOffsetX = { 1000 }) + fadeIn(),
                    exit = slideOutHorizontally(targetOffsetX = { -1000 }) + fadeOut()
                ) {
                    EmergencyContactsStep(
                        viewModel = userProfileViewModel,
                        onNext = { userProfileViewModel.nextStep() },
                        onBack = { userProfileViewModel.previousStep() }
                    )
                }

                androidx.compose.animation.AnimatedVisibility(
                    visible = currentStep == 4,
                    enter = slideInHorizontally(initialOffsetX = { 1000 }) + fadeIn(),
                    exit = slideOutHorizontally(targetOffsetX = { -1000 }) + fadeOut()
                ) {
                    CompleteStepContent(
                        viewModel = userProfileViewModel,
                        onFinish = { 
                            userProfileViewModel.saveUserProfile()
                        },
                        onBack = { userProfileViewModel.previousStep() }
                    )
                }
            }
        }

        // Loading overlay
        if (isLoading) {
            Surface(
                modifier = Modifier
                    .fillMaxSize()
                    .alpha(0.8f)
                    .zIndex(10f),
                color = Color.Black.copy(alpha = 0.5f)
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier.fillMaxSize()
                ) {
                    HeartbeatLoadingIndicator(
                        modifier = Modifier.size(150.dp),
                        color = Color(0xFF08BAED),
                        message = "Saving your profile..."
                    )
                }
            }
        }
    }
}

@Composable
fun StepIndicator(
    steps: List<String>,
    currentStep: Int,
    onStepClicked: (Int) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        steps.forEachIndexed { index, step ->
            val isActive = index == currentStep
            val isCompleted = index < currentStep

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .weight(1f)
                    .clickable { onStepClicked(index) }
            ) {
                // Step circle indicator
                Box(
                    modifier = Modifier
                        .size(30.dp)
                        .clip(CircleShape)
                        .background(
                            when {
                                isActive -> Color(0xFF08BAED)
                                isCompleted -> Color(0xFF4CAF50)
                                else -> Color.LightGray
                            }
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    if (isCompleted) {
                        Icon(
                            imageVector = Icons.Default.Check,
                            contentDescription = "Completed",
                            tint = Color.White
                        )
                    } else {
                        Text(
                            text = (index + 1).toString(),
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))

                // Step name
                Text(
                    text = step,
                    fontSize = 12.sp,
                    fontWeight = if (isActive) FontWeight.Bold else FontWeight.Normal,
                    color = if (isActive || isCompleted) Color(0xFF08BAED) else Color.Gray,
                )
            }
        }
    }
}

@Composable
fun WelcomeStepContent(
    onNext: () -> Unit,
    isEditing: Boolean,
    welcomeTitle: String,
    welcomeSubtitle: String
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Logo
        Image(
            painter = painterResource(id = R.drawable.heart_logo),
            contentDescription = "App Logo",
            modifier = Modifier.size(180.dp)
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Welcome text
        Text(
            text = welcomeTitle,
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF08BAED)
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = welcomeSubtitle,
            fontSize = 18.sp,
            color = Color.Gray
        )

        Spacer(modifier = Modifier.height(32.dp))

        // Next button - different text based on whether editing or not
        Button(
            onClick = onNext,
            modifier = Modifier
                .width(200.dp)
                .height(50.dp)
                .shadow(4.dp, shape = RoundedCornerShape(25.dp)),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color.White,
                contentColor = Color(0xFF08BAED)
            )
        ) {
            Text(if (isEditing) "Continue Editing" else "Get Started", fontSize = 18.sp)
            Spacer(modifier = Modifier.width(8.dp))
            Icon(
                imageVector = Icons.Default.ArrowForward,
                contentDescription = "Next"
            )
        }
    }
}

@Composable
fun CompleteStepContent(
    viewModel: UserProfileViewModel,
    onFinish: () -> Unit,
    onBack: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Logo
        Image(
            painter = painterResource(id = R.drawable.heart_logo),
            contentDescription = "App Logo",
            modifier = Modifier.size(150.dp)
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Completion text
        Text(
            text = "All Set!",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF08BAED)
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Your health profile is ready to be saved",
            fontSize = 18.sp,
            color = Color.Gray
        )

        Spacer(modifier = Modifier.height(32.dp))

        // Buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            Button(
                onClick = onBack,
                modifier = Modifier
                    .width(150.dp)
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.LightGray,
                    contentColor = Color.Black
                ),
                shape = RoundedCornerShape(25.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Back"
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Back", fontSize = 16.sp)
            }

            Button(
                onClick = onFinish,
                modifier = Modifier
                    .width(150.dp)
                    .height(50.dp)
                    .shadow(4.dp, shape = RoundedCornerShape(25.dp)),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF08BAED),
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(25.dp)
            ) {
                Text("Save & Finish", fontSize = 16.sp)
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun WelcomeScreenPreview() {
    JeevanAndroidTheme {
        WelcomeScreen(
            navController = rememberNavController(),
            userProfileViewModel = viewModel(factory = UserProfileViewModelFactory(PrefsManager(LocalContext.current))))
    }
}