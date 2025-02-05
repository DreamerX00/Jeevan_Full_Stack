package com.example.jeevanandroid.ui.auth

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.shrinkOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
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
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.example.jeevanandroid.R
import com.example.jeevanandroid.ui.theme.JeevanAndroidTheme
import com.example.jeevanandroid.utils.PrefsManager
import com.example.jeevanandroid.viewmodel.AuthViewModel
import com.example.jeevanandroid.viewmodel.AuthViewModelFactory

@Composable
fun RegisterScreen(navController: NavController, authViewModel: AuthViewModel = viewModel()) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var reEnterPassword by remember { mutableStateOf("") }
    val context = LocalContext.current
    var visible by remember { mutableStateOf(true) }
    var passwordVisible by remember { mutableStateOf(false) }
    var reEnterPasswordVisible by remember { mutableStateOf(false) }
    val prefsManager = PrefsManager(context)
    val authViewModel: AuthViewModel = viewModel(factory = AuthViewModelFactory(prefsManager))
    val authResponse by authViewModel.authResponse.observeAsState()

    // Validation states
    var emailError by remember { mutableStateOf(false) }
    var passwordError by remember { mutableStateOf(false) }
    var reEnterPasswordError by remember { mutableStateOf(false) }

    Box(
        modifier = Modifier
            .fillMaxSize()
    ) {
        // Background Image
        Image(
            painter = painterResource(id = R.drawable.registration_back),
            contentDescription = "Background",
            modifier = Modifier.fillMaxSize(),
            alignment = Alignment.Center,
            contentScale = ContentScale.Crop
        )

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

                    // Email Field with Underline and Validation
                    Box(
                        modifier = Modifier
                            .height(40.dp)
                            .width(220.dp)
                    ) {
                        BasicTextField(
                            value = email,
                            onValueChange = {
                                email = it
                                emailError = !it.contains("@")
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color.Transparent)
                                .padding(bottom = 4.dp),
                            singleLine = true,
                            keyboardOptions = KeyboardOptions.Default.copy(
                                keyboardType = KeyboardType.Email
                            )
                        ) {
                            if (email.isEmpty()) {
                                Text(text = "EMAIL", color = Color(0xFF484C4C), fontSize = 12.sp)
                            }
                            Text(text = email, color = if (emailError) Color.Red else Color.Black)
                        }
                        Box(
                            modifier = Modifier
                                .align(Alignment.BottomStart)
                                .background(if (emailError) Color.Red else Color.Gray)
                                .height(1.dp)
                                .fillMaxWidth()
                        )
                    }
                    if (emailError) {
                        Text(text = "Invalid email address", color = Color.Red, fontSize = 12.sp)
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Password Field with Eye Icon and Validation
                    Box(
                        modifier = Modifier
                            .height(40.dp)
                            .width(220.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            BasicTextField(
                                value = password,
                                onValueChange = {
                                    password = it
                                    passwordError =
                                        it.length < 8 || !it.any { char -> char.isDigit() } || !it.any { char -> !char.isLetterOrDigit() }
                                },
                                modifier = Modifier
                                    .weight(1f)
                                    .background(Color.Transparent)
                                    .padding(bottom = 4.dp),
                                singleLine = true,
                                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                                keyboardOptions = KeyboardOptions.Default.copy(
                                    keyboardType = KeyboardType.Password
                                )
                            ) { innerTextField ->
                                if (password.isEmpty()) {
                                    Text(
                                        text = "PASSWORD",
                                        color = Color(0xFF484C4C),
                                        fontSize = 12.sp
                                    )
                                }
                                innerTextField()
                            }
                            IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                Icon(
                                    imageVector = if (passwordVisible) Icons.Filled.Visibility else Icons.Filled.VisibilityOff,
                                    contentDescription = "Toggle Password Visibility"
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
                            text = "Contain Character And Symbols (maximum 8 character)",
                            color = Color.Red,
                            fontSize = 10.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Re-enter Password Field with Eye Icon and Validation
                    Box(
                        modifier = Modifier
                            .height(40.dp)
                            .width(220.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            BasicTextField(
                                value = reEnterPassword,
                                onValueChange = {
                                    reEnterPassword = it
                                    reEnterPasswordError = it != password
                                },
                                modifier = Modifier
                                    .weight(1f)
                                    .background(Color.Transparent)
                                    .padding(bottom = 4.dp),
                                singleLine = true,
                                visualTransformation = if (reEnterPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                                keyboardOptions = KeyboardOptions.Default.copy(
                                    keyboardType = KeyboardType.Password
                                )
                            ) { innerTextField ->
                                if (reEnterPassword.isEmpty()) {
                                    Text(
                                        text = "RE-ENTER PASSWORD",
                                        color = Color(0xFF484C4C),
                                        fontSize = 12.sp
                                    )
                                }
                                innerTextField()
                            }
                            IconButton(onClick = {
                                reEnterPasswordVisible = !reEnterPasswordVisible
                            }) {
                                Icon(
                                    imageVector = if (reEnterPasswordVisible) Icons.Filled.Visibility else Icons.Filled.VisibilityOff,
                                    contentDescription = "Toggle Re-enter Password Visibility"
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
                        Text(text = "Passwords do not match", color = Color.Red, fontSize = 12.sp)
                    }

                    Spacer(modifier = Modifier.height(25.dp))

                    // Register Button
                    Button(
                        onClick = {
                            authViewModel.register(email, password)
                            // Handle registration logic here
                            if (!emailError && !passwordError && !reEnterPasswordError) {
                                Toast.makeText(context, "Registered", Toast.LENGTH_SHORT).show()
                            } else {
                                Toast.makeText(context, "Please fix the errors", Toast.LENGTH_SHORT)
                                    .show()
                            }
                        },
                        modifier = Modifier
                            .width(180.dp)
                            .height(40.dp)
                            .shadow(4.dp, shape = RoundedCornerShape(18.dp)),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color.White,
                            contentColor = Color(0xFF08BAED)
                        )
                    ) {
                        Text("Register", fontSize = 20.sp)
                    }

                    Spacer(modifier = Modifier.height(70.dp))
                    authResponse?.message?.let { message ->
                        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()

                        Text(
                            text = message,
                            color = if (message.contains("sent")) Color.Green else Color.Red,
                            fontSize = 14.sp
                        )
                    }

                    // Navigate to the Login screen
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
                        Text("Log in")
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun RegisterScreenPreview() {
    JeevanAndroidTheme {
        RegisterScreen(navController = rememberNavController())
    }
}