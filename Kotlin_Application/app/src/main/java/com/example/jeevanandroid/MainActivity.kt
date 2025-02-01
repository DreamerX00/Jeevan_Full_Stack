package com.example.jeevanandroid

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.jeevanandroid.ui.auth.LoginScreen
import com.example.jeevanandroid.ui.auth.RegisterScreen
import com.example.jeevanandroid.ui.theme.JeevanAndroidTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            JeevanAndroidTheme {
                val navController = rememberNavController()
                // Scaffold for consistent layout
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    // Navigation Setup
                    NavHost(navController = navController, startDestination = "login", modifier = Modifier.padding(innerPadding)) {
                        // Define the login screen route
                        composable("login") {
                            LoginScreen(navController = navController)  // Passing navController
                        }
                        // Define the registration screen route
                        composable("register") {
                            RegisterScreen(navController = navController)  // Passing navController
                        }
                    }
                }
            }
        }
    }
}
