package com.example.jeevanandroid.ui.auth

import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
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
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.example.jeevanandroid.R
import com.example.jeevanandroid.ui.theme.JeevanAndroidTheme

@Composable
fun ForgotPasswordScreen(navController: NavController) {
    var email by remember { mutableStateOf("") }
    val context = LocalContext.current
    var emailError by remember { mutableStateOf(false) }

    Box(modifier = Modifier.fillMaxSize()) {
        Image(
            painter = painterResource(id = R.drawable.forgot_password_bg),
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.FillBounds
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Forgot Password",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFE05E99)
            )

            Spacer(modifier = Modifier.height(20.dp))

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
                        .padding(bottom = 2.dp),
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

            Spacer(modifier = Modifier.height(20.dp))

            // Reset Password Button
            Button(
                onClick = {
                    if (!emailError) {
                        Toast.makeText(context, "Password reset link sent", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(context, "Please fix the errors", Toast.LENGTH_SHORT).show()
                    }
                },
                modifier = Modifier
                    .width(200.dp)
                    .height(40.dp)
                    .shadow(4.dp, shape = RoundedCornerShape(18.dp)),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.White,
                    contentColor = Color(0xFF08BAED)
                )
            ) {
                Text("Reset Password", fontSize = 20.sp)
            }

            Spacer(modifier = Modifier.height(50.dp))

            // Navigate to the Login screen
            Text(
                text = "Remembered your password?",
                color = Color(0xFF08BAED),
                modifier = Modifier.clickable { navController.popBackStack() }
            )
            Spacer(modifier = Modifier.height(10.dp))
            Button(
                onClick = {
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

@Preview(showBackground = true)
@Composable
fun ForgotPasswordScreenPreview() {
    JeevanAndroidTheme {
        ForgotPasswordScreen(navController = rememberNavController())
    }
}
