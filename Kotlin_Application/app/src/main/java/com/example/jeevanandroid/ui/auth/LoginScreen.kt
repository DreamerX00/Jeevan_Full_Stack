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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.jeevanandroid.R
import com.example.jeevanandroid.viewmodel.AuthViewModel

@Composable
fun LoginScreen(navController: NavController, authViewModel: AuthViewModel) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val context = LocalContext.current
    var visible by remember { mutableStateOf(true) }
    var passwordVisible by remember { mutableStateOf(false) }

    // Validation states
    var emailError by remember { mutableStateOf(false) }
    var passwordError by remember { mutableStateOf(false) }

    Box(
        modifier = Modifier
            .fillMaxSize()
    ) {
        // Background Image
        Image(
            painter = painterResource(id = R.drawable.login_back),
            contentDescription = "Background",
            modifier = Modifier.fillMaxSize(),
            alignment = Alignment.Center,
            contentScale = ContentScale.Crop
        )

        // Login Content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            AnimatedVisibility(
                visible = visible,
                enter = slideInVertically(initialOffsetY = { -40 }, animationSpec = tween(durationMillis = 500)) + fadeIn(animationSpec = tween(durationMillis = 500)),
                exit = slideOutVertically(targetOffsetY = { 40 }, animationSpec = tween(durationMillis = 500)) + shrinkOut(animationSpec = tween(durationMillis = 500))
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    // Logo Image
                    val logo = painterResource(id = R.drawable.heart_logo)
                    Image(painter = logo, contentDescription = "App Logo", modifier = Modifier.size(200.dp))

                    Spacer(modifier = Modifier.height(5.dp))

                    // Title Text
                    Text(
                        text = "Already A User Log In",
                        color = Color(0xFF08BAED),
                        fontSize = 16.sp
                    )

                    Spacer(Modifier.height(20.dp))

                    // Email Field with Underline and Validation
                    Box(
                        modifier = Modifier
                            .height(35.dp)
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
                                .padding(bottom = 2.dp), // Adjusted padding
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

                    Spacer(modifier = Modifier.height(10.dp))

                    // Password Field with Eye Icon and Validation
                    Box(
                        modifier = Modifier
                            .height(35.dp)
                            .width(220.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            BasicTextField(
                                value = password,
                                onValueChange = {
                                    password = it
                                    passwordError = it.length < 8 || !it.any { char -> char.isDigit() } || !it.any { char -> !char.isLetterOrDigit() }
                                },
                                modifier = Modifier
                                    .weight(1f)
                                    .background(Color.Transparent)
                                    .padding(bottom = 2.dp),
                                singleLine = true,
                                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                                keyboardOptions = KeyboardOptions.Default.copy(
                                    keyboardType = KeyboardType.Password
                                )
                            ) { innerTextField ->
                                if (password.isEmpty()) {
                                    Text(text = "PASSWORD", color = Color(0xFF484C4C), fontSize = 12.sp)
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
                        Text(text = "Password Must Contain Symbols And Characters", color = Color.Red, fontSize = 12.sp)
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    // Login Button
                    Button(
                        onClick = {
                            if (!emailError && !passwordError) {
                                authViewModel.login(email, password)  // Use the AuthViewModel to log in
                                Toast.makeText(context, "Logged In", Toast.LENGTH_SHORT).show()
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
                        )
                    ) {
                        Text("Log in", fontSize = 20.sp)
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Forgot Password Text
                    Text(
                        text = "Forgot Password?",
                        color = Color(0xFF08BAED),
                        modifier = Modifier.clickable { navController.navigate("forgot_password") }
                    )

                    Spacer(modifier = Modifier.height(50.dp))

                    // Navigate to the Register screen
                    Text("Don't have an account?", color = Color(0xFF08BAED))
                    Button(
                        onClick = {
                            visible = !visible
                            navController.navigate("register")
                        },
                        modifier = Modifier
                            .shadow(4.dp, shape = RoundedCornerShape(18.dp)),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color.White,
                            contentColor = Color(0xFF08BAED)
                        )
                    ) {
                        Text("Register")
                    }
                }
            }
        }
    }
}


