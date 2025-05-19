package com.jeevan

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.jeevan.ui.auth.ForgotPasswordScreen
import com.jeevan.ui.auth.LoginScreen
import com.jeevan.ui.auth.RegisterScreen
import com.jeevan.ui.home.HomeScreen
import com.jeevan.ui.home.ProfileScreen
import com.jeevan.ui.nearby.HospitalScreen
import com.jeevan.ui.nearby.PharmacyScreen
import com.jeevan.ui.onboarding.WelcomeScreen
import com.jeevan.ui.theme.JeevanAndroidTheme
import com.jeevan.utils.PrefsManager
import com.jeevan.viewmodel.AuthViewModel
import com.jeevan.viewmodel.AuthViewModelFactory
import com.jeevan.viewmodel.HospitalViewModel
import com.jeevan.viewmodel.NearbyViewModel
import com.jeevan.viewmodel.NearbyViewModelFactory
import com.jeevan.viewmodel.UserProfileViewModel
import com.jeevan.viewmodel.UserProfileViewModelFactory

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            JeevanAndroidTheme {
                val navController = rememberNavController()

                // Initialize PrefsManager
                val prefsManager = PrefsManager(this)

                // Initialize ViewModels using factories
                val authViewModel: AuthViewModel =
                    viewModel(factory = AuthViewModelFactory(prefsManager))
                val userProfileViewModel: UserProfileViewModel =
                    viewModel(factory = UserProfileViewModelFactory(prefsManager))
                val nearbyViewModel: NearbyViewModel =
                    viewModel(factory = NearbyViewModelFactory(application))
                val hospitalViewModel: HospitalViewModel = viewModel()

                // Scaffold for consistent layout
                Scaffold { paddingValues ->
                    // Navigation Setup
                    NavHost(
                        navController = navController,
                        startDestination = if (prefsManager.hasValidToken()) {
                            if (prefsManager.hasCompletedOnboarding()) "home" else "welcome"
                        } else "login",
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(paddingValues)
                    ) {
                        // Define the login screen route
                        composable("login") {
                            LoginScreen(
                                navController = navController,
                                authViewModel = authViewModel
                            )
                        }
                        // Define the registration screen route
                        composable("register") {
                            RegisterScreen(
                                navController = navController,
                                authViewModel = authViewModel
                            )
                        }
                        // Define the forgot password screen route
                        composable("forgot-password") {
                            ForgotPasswordScreen(
                                navController = navController,
                                authViewModel = authViewModel
                            )
                        }
                        // Define the welcome/onboarding screen route
                        composable("welcome") {
                            WelcomeScreen(
                                navController = navController,
                                userProfileViewModel = userProfileViewModel
                            )
                        }
                        // Define the home screen route
                        composable("home") {
                            HomeScreen(
                                navController = navController,
                                userProfileViewModel = userProfileViewModel
                            )
                        }
                        // Define the profile screen route
                        composable("profile") {
                            ProfileScreen(
                                navController = navController,
                                userProfileViewModel = userProfileViewModel
                            )
                        }
                        // Define the pharmacy screen route
                        composable("pharmacy") {
                            PharmacyScreen(
                                navController = navController,
                                nearbyViewModel = nearbyViewModel
                            )
                        }
                        // Define the hospitals screen route
                        composable("hospitals") {
                            HospitalScreen(
                                navController = navController,
                                hospitalViewModel = hospitalViewModel
                            )
                        }
                    }
                }
            }
        }
    }
}
