package com.example.jeevanandroid

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
import com.example.jeevanandroid.ui.auth.ForgotPasswordScreen
import com.example.jeevanandroid.ui.auth.LoginScreen
import com.example.jeevanandroid.ui.auth.RegisterScreen
import com.example.jeevanandroid.ui.home.HomeScreen
import com.example.jeevanandroid.ui.theme.JeevanAndroidTheme
import com.example.jeevanandroid.utils.PrefsManager
import com.example.jeevanandroid.viewmodel.AuthViewModel
import com.example.jeevanandroid.viewmodel.AuthViewModelFactory

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            JeevanAndroidTheme {
                val navController = rememberNavController()

                // Initialize PrefsManager
                val prefsManager = PrefsManager(this)

                // Initialize AuthViewModel using the factory
                val authViewModel: AuthViewModel = viewModel(factory = AuthViewModelFactory(prefsManager))

                // Scaffold for consistent layout
                Scaffold { paddingValues ->
                    // Navigation Setup
                    NavHost(
                        navController = navController,
                        startDestination = if (prefsManager.hasValidToken()) "home" else "login",
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
                        composable("home") {
                            HomeScreen(
                                navController = navController
                            )
                        }
                    }
                }
            }
        }
    }
}
