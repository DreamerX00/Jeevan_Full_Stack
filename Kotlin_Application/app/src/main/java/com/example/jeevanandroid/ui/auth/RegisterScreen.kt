package com.example.jeevanandroid.ui.auth

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandIn
import androidx.compose.animation.fadeIn
import androidx.compose.animation.shrinkOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.example.jeevanandroid.R
import com.example.jeevanandroid.ui.theme.JeevanAndroidTheme

@Composable
fun RegisterScreen(navController: NavController) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val context = LocalContext.current
    var visible by remember { mutableStateOf(true) }

    Box(
        modifier = Modifier
            .fillMaxSize()
    ) {
        // Background Image
        Image(
            painter = painterResource(id = R.drawable.registration_back), // Use your image from drawable
            contentDescription = "Background",
            modifier = Modifier.fillMaxSize(),
            alignment = Alignment.Center,
            contentScale = ContentScale.Crop
        )

        // Registration Content
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
                    val logo = painterResource(id = R.drawable.heart_logo) // Assuming your logo is placed in res/drawable/heart_logo.png
                    Image(painter = logo, contentDescription = "App Logo", modifier = Modifier.size(150.dp))

                    Spacer(modifier = Modifier.height(5.dp))

                    // Title Text
                    Text(
                        text = "Register",
                        color = Color(0xFF08BAED),
                        fontSize = 16.sp
                    )

                    Spacer(Modifier.height(30.dp))

                    // Email Field with Underline
                    Box(
                        modifier = Modifier
                            .height(40.dp)
                            .width(220.dp)
                    ) {
                        BasicTextField(
                            value = email,
                            onValueChange = { email = it },
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color.Transparent)
                                .padding(bottom = 4.dp),
                            singleLine = true
                        ) {
                            if(email.isEmpty()) {
                                Text(text = "EMAIL", color = Color(0xFF484C4C), fontSize = 16.sp)
                            }
                            Text(text = email, color = Color.Black)
                        }
                        Box(
                            modifier = Modifier
                                .align(Alignment.BottomStart)
                                .background(Color.Gray)
                                .height(1.dp)
                                .fillMaxWidth()
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Password Field with Underline
                    Box(
                        modifier = Modifier
                            .height(40.dp)
                            .width(220.dp)
                    ) {
                        BasicTextField(
                            value = password,
                            onValueChange = { password = it },
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color.Transparent)
                                .padding(bottom = 4.dp),
                            singleLine = true
                        ) {
                            if (password.isEmpty()) {
                                Text(text = "PASSWORD", color = Color(0xFF484C4C), fontSize = 16.sp)
                            }
                            Text(text = password, color = Color.Black)
                        }
                        Box(
                            modifier = Modifier
                                .align(Alignment.BottomStart)
                                .background(Color.Gray)
                                .height(1.dp)
                                .fillMaxWidth()
                        )
                    }

                    Spacer(modifier = Modifier.height(25.dp))

                    // Register Button
                    Button(
                        onClick = {
                            // Handle registration logic here
                            Toast.makeText(context, "Registered", Toast.LENGTH_SHORT).show()
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