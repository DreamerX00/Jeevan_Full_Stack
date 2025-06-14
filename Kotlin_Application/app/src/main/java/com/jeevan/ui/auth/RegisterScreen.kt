package com.jeevan.ui.auth

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.shrinkOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.jeevan.android.R
import com.jeevan.ui.components.PulseLoadingIndicator
import com.jeevan.ui.theme.JeevanAndroidTheme
import com.jeevan.utils.PrefsManager
import com.jeevan.viewmodel.AuthViewModel
import com.jeevan.viewmodel.AuthViewModelFactory

@Composable
fun RegisterScreen(navController: NavController, authViewModel: AuthViewModel = viewModel()) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var reEnterPassword by remember { mutableStateOf("") }
    val context = LocalContext.current
    var visible by remember { mutableStateOf(true) }
    var passwordVisible by remember { mutableStateOf(false) }
    var reEnterPasswordVisible by remember { mutableStateOf(false) }
    val authResponse by authViewModel.authResponse.observeAsState()
    val isLoading by authViewModel.isLoading.observeAsState(initial = false)

    // Floating Label Effect for Email
    val isEmailFocused = remember { mutableStateOf(false) }
    val emailLabelYPosition by animateDpAsState(if (isEmailFocused.value || email.isNotEmpty()) 0.dp else 16.dp)
    val emailLabelFontSize by animateFloatAsState(if (isEmailFocused.value || email.isNotEmpty()) 12f else 16f) // Updated to use Float

    // Floating Label Effect for Password
    val isPasswordFocused = remember { mutableStateOf(false) }
    val passwordLabelYPosition by animateDpAsState(if (isPasswordFocused.value || password.isNotEmpty()) 0.dp else 16.dp)
    val passwordLabelFontSize by animateFloatAsState(if (isPasswordFocused.value || password.isNotEmpty()) 12f else 16f) // Updated to use Float

    // Floating Label Effect for Re-enter Password
    val isReEnterPasswordFocused = remember { mutableStateOf(false) }
    val reEnterPasswordLabelYPosition by animateDpAsState(if (isReEnterPasswordFocused.value || reEnterPassword.isNotEmpty()) 0.dp else 16.dp)
    val reEnterPasswordLabelFontSize by animateFloatAsState(if (isReEnterPasswordFocused.value || reEnterPassword.isNotEmpty()) 12f else 16f) // Updated to use Float

    // Validation states
    var emailError by remember { mutableStateOf(false) }
    var passwordError by remember { mutableStateOf(false) }
    var reEnterPasswordError by remember { mutableStateOf(false) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                detectTapGestures(onTap = {
                    isEmailFocused.value = false
                    isPasswordFocused.value = false
                    isReEnterPasswordFocused.value = false
                })
            }
    ) {
        // Background Image
        Image(
            painter = painterResource(id = R.drawable.registration_back),
            contentDescription = "Background",
            modifier = Modifier.fillMaxSize(),
            alignment = Alignment.Center,
            contentScale = ContentScale.Crop
        )

        // Main Content
        Box(
            modifier = Modifier
                .fillMaxSize()
                .pointerInput(Unit) {
                    detectTapGestures(onTap = {
                        isEmailFocused.value = false
                        isPasswordFocused.value = false
                        isReEnterPasswordFocused.value = false
                    })
                }
                .alpha(if (isLoading) 0.6f else 1f)
        ) {
            // Registration Content
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(10.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                AnimatedVisibility(
                    visible = visible,
                    enter = slideInVertically(
                        initialOffsetY = { -40 },
                        animationSpec = tween(durationMillis = 500)
                    ) + fadeIn(animationSpec = tween(durationMillis = 500)),
                    exit = slideOutVertically(
                        targetOffsetY = { 40 },
                        animationSpec = tween(durationMillis = 500)
                    ) + shrinkOut(animationSpec = tween(durationMillis = 500))
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        // Logo Image
                        val logo = painterResource(id = R.drawable.heart_logo)
                        Image(
                            painter = logo,
                            contentDescription = "App Logo",
                            modifier = Modifier.size(200.dp)
                        )

                        Spacer(modifier = Modifier.height(5.dp))

                        // Title Text
                        Text(
                            text = "Register",
                            color = Color(0xFF08BAED),
                            fontSize = 16.sp
                        )

                        Spacer(Modifier.height(12.dp))

                        // Email Field
                        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                            Text(
                                text = "EMAIL",
                                color = Color(0xFF484C4C),
                                fontSize = emailLabelFontSize.sp,
                                modifier = Modifier
                                    .padding(start = 2.dp)
                                    .offset(y = emailLabelYPosition)
                                    .animateContentSize()
                            )
                            
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(top = 8.dp)
                            ) {
                                BasicTextField(
                                    value = email,
                                    onValueChange = {
                                        email = it
                                        emailError = !it.contains("@")
                                    },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .onFocusChanged {
                                            isEmailFocused.value = it.isFocused
                                        }
                                        .background(Color.Transparent),
                                    singleLine = true,
                                    keyboardOptions = KeyboardOptions.Default.copy(
                                        keyboardType = KeyboardType.Email
                                    ),
                                    textStyle = TextStyle(
                                        color = if (emailError) Color.Red else Color.Black,
                                        fontSize = 16.sp
                                    )
                                )

                                Box(
                                    modifier = Modifier
                                        .align(Alignment.BottomStart)
                                        .background(if (emailError) Color.Red else Color.Gray)
                                        .height(1.dp)
                                        .fillMaxWidth()
                                )
                            }

                            if (emailError) {
                                Text(
                                    text = "Invalid email address",
                                    color = Color.Red,
                                    fontSize = 12.sp,
                                    modifier = Modifier.padding(top = 4.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Password Field
                        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                            Text(
                                text = "PASSWORD",
                                color = Color(0xFF484C4C),
                                fontSize = passwordLabelFontSize.sp,
                                modifier = Modifier
                                    .padding(start = 2.dp)
                                    .offset(y = passwordLabelYPosition)
                                    .animateContentSize()
                            )

                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(top = 8.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    BasicTextField(
                                        value = password,
                                        onValueChange = {
                                            password = it
                                            passwordError = it.length < 8 || !it.any { char -> char.isDigit() } || !it.any { char -> !char.isLetterOrDigit() }
                                        },
                                        modifier = Modifier
                                            .weight(1f)
                                            .onFocusChanged {
                                                isPasswordFocused.value = it.isFocused
                                            }
                                            .background(Color.Transparent),
                                        singleLine = true,
                                        visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                                        keyboardOptions = KeyboardOptions.Default.copy(
                                            keyboardType = KeyboardType.Password
                                        ),
                                        textStyle = TextStyle(
                                            color = if (passwordError) Color.Red else Color.Black,
                                            fontSize = 16.sp
                                        )
                                    )

                                    IconButton(
                                        onClick = { passwordVisible = !passwordVisible },
                                        modifier = Modifier.onFocusChanged {
                                            // This ensures the field doesn't lose focus when clicking the icon
                                            if (it.isFocused) {
                                                isPasswordFocused.value = true
                                            }
                                        }
                                    ) {
                                        Icon(
                                            imageVector = if (passwordVisible) Icons.Filled.Visibility else Icons.Filled.VisibilityOff,
                                            contentDescription = "Toggle Password Visibility",
                                            tint = Color(0xFF6235E0)
                                        )
                                    }
                                }

                                Box(
                                    modifier = Modifier
                                        .align(Alignment.BottomStart)
                                        .background(if (passwordError) Color.Red else Color.Gray)
                                        .height(1.dp)
                                        .fillMaxWidth()
                                )
                            }

                            if (passwordError) {
                                Text(
                                    text = "Password must be at least 8 characters with numbers and symbols",
                                    color = Color.Red,
                                    fontSize = 12.sp,
                                    modifier = Modifier.padding(top = 4.dp)
                                )
                            }
                        }

// Re-enter Password Field
                        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                            Text(
                                text = "RE-ENTER PASSWORD",
                                color = Color(0xFF484C4C),
                                fontSize = reEnterPasswordLabelFontSize.sp,
                                modifier = Modifier
                                    .padding(start = 2.dp)
                                    .offset(y = reEnterPasswordLabelYPosition)
                                    .animateContentSize()
                            )

                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(top = 8.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    BasicTextField(
                                        value = reEnterPassword,
                                        onValueChange = {
                                            reEnterPassword = it
                                            reEnterPasswordError = it != password
                                        },
                                        modifier = Modifier
                                            .weight(1f)
                                            .onFocusChanged {
                                                isReEnterPasswordFocused.value = it.isFocused
                                            }
                                            .background(Color.Transparent),
                                        singleLine = true,
                                        visualTransformation = if (reEnterPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                                        keyboardOptions = KeyboardOptions.Default.copy(
                                            keyboardType = KeyboardType.Password
                                        ),
                                        textStyle = TextStyle(
                                            color = if (reEnterPasswordError) Color.Red else Color.Black,
                                            fontSize = 16.sp
                                        )
                                    )

                                    IconButton(

                                        onClick = { reEnterPasswordVisible = !reEnterPasswordVisible },
                                        modifier = Modifier.onFocusChanged {
                                            // This ensures the field doesn't lose focus when clicking the icon
                                            if (it.isFocused) {
                                                isReEnterPasswordFocused.value = true
                                            }
                                        }
                                    ) {
                                        Icon(
                                            imageVector = if (reEnterPasswordVisible) Icons.Filled.Visibility else Icons.Filled.VisibilityOff,
                                            contentDescription = "Toggle Re-enter Password Visibility",
                                            tint = Color(0xFF6235E0)
                                        )
                                    }
                                }

                                Box(
                                    modifier = Modifier
                                        .align(Alignment.BottomStart)
                                        .background(if (reEnterPasswordError) Color.Red else Color.Gray)
                                        .height(1.dp)
                                        .fillMaxWidth()
                                )
                            }

                            if (reEnterPasswordError) {
                                Text(
                                    text = "Passwords do not match",
                                    color = Color.Red,
                                    fontSize = 12.sp,
                                    modifier = Modifier.padding(top = 4.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Register Button
                        Button(
                            onClick = {
                                if (!emailError && !passwordError && !reEnterPasswordError) {
                                    authViewModel.register(email, password)
                                } else {
                                    Toast.makeText(context, "Please fix the errors", Toast.LENGTH_SHORT).show()
                                }
                            },
                            modifier = Modifier
                                .width(180.dp)
                                .height(40.dp)
                                .shadow(4.dp, shape = RoundedCornerShape(18.dp)),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color.White,
                                contentColor = Color(0xFF08BAED)
                            ),
                            enabled = !isLoading
                        ) {
                            Text("Register", fontSize = 20.sp, color = Color(0xFF08BAED))
                        }

                        // Observe auth response
                        LaunchedEffect(authViewModel.authResponse.value, authViewModel.isRegistered.value) {
                            authViewModel.authResponse.value?.let { response ->
                                if (response.error != null) {
                                    Toast.makeText(context, response.error, Toast.LENGTH_SHORT).show()
                                } else if (response.token != null) {
                                    visible = !visible
                                    
                                    // If registered, go to welcome screen instead of home
                                    if (authViewModel.isRegistered.value == true) {
                                        navController.navigate("welcome") {
                                            popUpTo("register") { inclusive = true }
                                        }
                                    } else {
                                        navController.navigate("home") {
                                            popUpTo("register") { inclusive = true }
                                        }
                                    }
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        // Navigate to Login
                        Text("Already have an account?", color = Color(0xFF08BAED))
                        Button(
                            onClick = {
                                visible = !visible
                                navController.popBackStack()
                            },
                            modifier = Modifier
                                .shadow(4.dp, shape = RoundedCornerShape(18.dp)),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color.White,
                                contentColor = Color(0xFF08BAED)
                            )
                        ) {
                            Text("Log in",color = Color(0xFF08BAED), fontSize = 20.sp)
                        }
                    }
                }
            }

            // Loading Overlay
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
                        PulseLoadingIndicator(
                            modifier = Modifier.size(200.dp),
                            color = Color(0xFF08BAED),
                            message = "Creating your account..."
                        )
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun RegisterScreenPreview() {
    JeevanAndroidTheme {
        RegisterScreen(
            navController = rememberNavController(),
            authViewModel = viewModel(factory = AuthViewModelFactory(PrefsManager(LocalContext.current))))
    }
}