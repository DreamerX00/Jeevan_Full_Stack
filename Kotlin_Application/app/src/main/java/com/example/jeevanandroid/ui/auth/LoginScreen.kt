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
import androidx.compose.material3.*
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
fun LoginScreen(navController: NavController) {
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
            painter = painterResource(id = R.drawable.login_back), // Use your image from drawable
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
                    val logo = painterResource(id = R.drawable.heart_logo) // Assuming your logo is placed in res/drawable/heart_logo.png
                    Image(painter = logo, contentDescription = "App Logo", modifier = Modifier.size(150.dp))

                    Spacer(modifier = Modifier.height(5.dp))

                    // Title Text
                    Text(
                        text = "Already A User Log In",
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
                            if (email.isEmpty()) {
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

                    // Login Button
                    Button(
                        onClick = {
                            // Handle login logic here
                            Toast.makeText(context, "Logged In", Toast.LENGTH_SHORT).show()
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

                    Spacer(modifier = Modifier.height(70.dp))

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

@Preview(showBackground = true)
@Composable
fun LoginScreenPreview() {
    JeevanAndroidTheme {
        LoginScreen(navController = rememberNavController())
    }
}
