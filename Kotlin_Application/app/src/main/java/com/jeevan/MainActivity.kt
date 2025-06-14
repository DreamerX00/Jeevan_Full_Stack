package com.jeevan

import android.app.Application
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BugReport
import androidx.compose.material3.Button
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.jeevan.ui.auth.ForgotPasswordScreen
import com.jeevan.ui.auth.LoginScreen
import com.jeevan.ui.auth.RegisterScreen
import com.jeevan.ui.home.HomeScreen
import com.jeevan.ui.home.ProfileScreen
import com.jeevan.ui.medical.SymptomCheckerScreen
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
import com.jeevan.viewmodel.SymptomCheckerViewModel
import com.jeevan.viewmodel.SymptomCheckerViewModelFactory
import com.jeevan.viewmodel.UserProfileViewModel
import com.jeevan.viewmodel.UserProfileViewModelFactory

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Robust debug check that works without BuildConfig import
        val isDebug = applicationContext.applicationInfo != null &&
                (applicationContext.applicationInfo.flags and android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0

        enableEdgeToEdge()
        setContent {
            JeevanAndroidTheme {
                val navController = rememberNavController()
                val prefsManager = PrefsManager(LocalContext.current)

                // Initialize ViewModels
                val authViewModel: AuthViewModel =
                    viewModel(factory = AuthViewModelFactory(prefsManager))
                val userProfileViewModel: UserProfileViewModel =
                    viewModel(factory = UserProfileViewModelFactory(prefsManager))
                val nearbyViewModel: NearbyViewModel =
                    viewModel(factory = NearbyViewModelFactory(application))
                val hospitalViewModel: HospitalViewModel = viewModel()
                val symptomCheckerViewModel: SymptomCheckerViewModel =
                    viewModel(factory = SymptomCheckerViewModelFactory())

                Scaffold(
                    floatingActionButton = {
                        if (isDebug) {
                            FloatingActionButton(
                                onClick = { navController.navigate("development") }
                            ) {
                                Icon(Icons.Default.BugReport, contentDescription = "Development")
                            }
                        }
                    }
                ) { paddingValues ->
                    NavHost(
                        navController = navController,
                        startDestination = if (prefsManager.hasValidToken()) {
                            if (prefsManager.hasCompletedOnboarding()) "home" else "welcome"
                        } else "login",
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(paddingValues)
                    ) {
                        composable("login") { LoginScreen(navController, authViewModel) }
                        composable("register") { RegisterScreen(navController, authViewModel) }
                        composable("forgot-password") { ForgotPasswordScreen(navController, authViewModel) }
                        composable("welcome") { WelcomeScreen(navController, userProfileViewModel) }
                        composable("home") { HomeScreen(navController, userProfileViewModel) }
                        composable("profile") { ProfileScreen(navController, userProfileViewModel) }
                        composable("pharmacy") { PharmacyScreen(navController, nearbyViewModel) }
                        composable("hospitals") { HospitalScreen(navController, hospitalViewModel) }
                        composable("symptom-checker") { SymptomCheckerScreen(navController, symptomCheckerViewModel) }

                        if (isDebug) {
                            composable("development") {
                                DevelopmentScreen(
                                    navController = navController,
                                    symptomCheckerViewModel = symptomCheckerViewModel,
                                    nearbyViewModel = nearbyViewModel,
                                    hospitalViewModel = hospitalViewModel
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun DevelopmentScreen(
    navController: NavController,
    symptomCheckerViewModel: SymptomCheckerViewModel,
    nearbyViewModel: NearbyViewModel,
    hospitalViewModel: HospitalViewModel
) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text("Development Testing", style = MaterialTheme.typography.headlineMedium)

        Spacer(modifier = Modifier.height(16.dp))

        Button(onClick = { navController.navigate("symptom-checker") }) {
            Text("Symptom Checker")
        }

        Spacer(modifier = Modifier.height(8.dp))

        Button(onClick = { navController.navigate("pharmacy") }) {
            Text("Pharmacy Screen")
        }

        Spacer(modifier = Modifier.height(8.dp))

        Button(onClick = { navController.navigate("hospitals") }) {
            Text("Hospitals Screen")
        }

        Spacer(modifier = Modifier.height(8.dp))

        Button(onClick = { navController.navigate("home") }) {
            Text("Home Screen")
        }

        Spacer(modifier = Modifier.height(8.dp))

        Button(onClick = { navController.navigate("profile") }) {
            Text("Profile Screen")
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun DevelopmentScreenPreview() {
    JeevanAndroidTheme {
        DevelopmentScreen(
            navController = rememberNavController(),
            symptomCheckerViewModel = viewModel(factory = SymptomCheckerViewModelFactory()),
            nearbyViewModel = viewModel(factory = NearbyViewModelFactory(LocalContext.current.applicationContext as Application)),
            hospitalViewModel = viewModel()
        )
    }
}