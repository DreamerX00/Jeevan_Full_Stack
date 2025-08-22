package com.jeevan.ui.auth

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
import androidx.compose.foundation.clickable
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
import androidx.compose.runtime.rememberCoroutineScope
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
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
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
import com.jeevan.ui.components.HeartbeatLoadingIndicator
import com.jeevan.ui.theme.JeevanAndroidTheme
import com.jeevan.utils.PrefsManager
import com.jeevan.viewmodel.AuthViewModel
import com.jeevan.viewmodel.AuthViewModelFactory
import kotlinx.coroutines.launch

// --- Constants for strings and colors ---
private const val EMAIL_LABEL = "EMAIL"
private const val PASSWORD_LABEL = "PASSWORD"
private const val LOGIN_TITLE = "Already A User Log In"
private const val INVALID_EMAIL = "Invalid email address"
private const val INVALID_PASSWORD = "Password must be at least 8 characters with numbers and symbols"
private const val FIX_ERRORS = "Please fix the errors"
private const val LOGGING_IN = "Logging in..."
private const val FORGOT_PASSWORD = "Forgot Password?"
private const val DONT_HAVE_ACCOUNT = "Don't have an account?"
private const val REGISTER = "Register"
private const val LOGIN = "Log in"
private val PRIMARY_COLOR = Color(0xFF08BAED)
private val ERROR_COLOR = Color.Red
private val LABEL_COLOR = Color(0xFF484C4C)
private val BUTTON_TEXT_COLOR = Color(0xFF08BAED)
private val BUTTON_BG_COLOR = Color.White
private val BUTTON_SHADOW_COLOR = Color(0xFF08BAED)

// --- Utility functions ---
private fun isValidEmail(email: String): Boolean {
    return android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()
}

// --- Reusable composable for text fields ---
@Composable
private fun FloatingLabelTextField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    isError: Boolean,
    isPassword: Boolean = false,
    passwordVisible: Boolean = false,
    onPasswordToggle: (() -> Unit)? = null,
    onFocusChanged: (Boolean) -> Unit = {},
    contentDescription: String = label
) {
    val labelYPosition by animateDpAsState(if (value.isNotEmpty()) 0.dp else 16.dp)
    val labelFontSize by animateFloatAsState(if (value.isNotEmpty()) 12f else 16f)
    Box(modifier = Modifier.fillMaxWidth().padding(top = 8.dp)) {
        Column {
            Text(
                text = label,
                color = LABEL_COLOR,
                fontSize = labelFontSize.sp,
                modifier = Modifier.padding(start = 2.dp).offset(y = labelYPosition).animateContentSize()
            )
            Row(verticalAlignment = Alignment.CenterVertically) {
                BasicTextField(
                    value = value,
                    onValueChange = onValueChange,
                    modifier = Modifier
                        .weight(1f)
                        .onFocusChanged { onFocusChanged(it.isFocused) }
                        .background(Color.Transparent),
                    singleLine = true,
                    visualTransformation = if (isPassword && !passwordVisible) PasswordVisualTransformation() else VisualTransformation.None,
                    keyboardOptions = KeyboardOptions.Default.copy(
                        keyboardType = if (isPassword) KeyboardType.Password else KeyboardType.Email
                    ),
                    textStyle = TextStyle(
                        color = if (isError) ERROR_COLOR else Color.Black,
                        fontSize = 16.sp
                    ),
                    decorationBox = { innerTextField ->
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            innerTextField()
                            if (isPassword && onPasswordToggle != null) {
                                IconButton(onClick = onPasswordToggle, modifier = Modifier.semantics { this.contentDescription = "Toggle Password Visibility" }) {
                                    Icon(
                                        imageVector = if (passwordVisible) Icons.Filled.Visibility else Icons.Filled.VisibilityOff,
                                        contentDescription = if (passwordVisible) "Hide password" else "Show password",
                                        tint = BUTTON_SHADOW_COLOR
                                    )
                                }
                            }
                        }
                    }
                )
            }
            Box(
                modifier = Modifier
                    .align(Alignment.Start)
                    .background(if (isError) ERROR_COLOR else Color.Gray)
                    .height(1.dp)
                    .fillMaxWidth()
            )
        }
    }
}

@Composable
fun LoginScreen(navController: NavController, authViewModel: AuthViewModel) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var visible by remember { mutableStateOf(true) }
    val isLoading by authViewModel.isLoading.observeAsState(initial = false)
    val context = LocalContext.current
    val snackbarHostState = remember { androidx.compose.material3.SnackbarHostState() }
    val coroutineScope = rememberCoroutineScope()
    // Validation states
    var emailError by remember { mutableStateOf(false) }
    var passwordError by remember { mutableStateOf(false) }

    Box(modifier = Modifier.fillMaxSize()) {
        // Background Image
        Image(
            painter = painterResource(id = R.drawable.login_back),
            contentDescription = "Login background",
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
                        // Dismiss keyboard/focus
                    })
                }
                .alpha(if (isLoading) 0.6f else 1f)
        ) {
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
                            text = LOGIN_TITLE,
                            color = PRIMARY_COLOR,
                            fontSize = 16.sp
                        )
                        Spacer(Modifier.height(20.dp))
                        // Email Field
                        FloatingLabelTextField(
                            label = EMAIL_LABEL,
                            value = email,
                            onValueChange = {
                                email = it
                                emailError = !isValidEmail(it)
                            },
                            isError = emailError,
                            isPassword = false,
                            contentDescription = "Email input field"
                        )
                        if (emailError) {
                            Text(
                                text = INVALID_EMAIL,
                                color = ERROR_COLOR,
                                fontSize = 12.sp,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                        // Password Field
                        FloatingLabelTextField(
                            label = PASSWORD_LABEL,
                            value = password,
                            onValueChange = {
                                password = it
                                passwordError = it.length < 8 || !it.any { char -> char.isDigit() } || !it.any { char -> !char.isLetterOrDigit() }
                            },
                            isError = passwordError,
                            isPassword = true,
                            passwordVisible = passwordVisible,
                            onPasswordToggle = { passwordVisible = !passwordVisible },
                            contentDescription = "Password input field"
                        )
                        if (passwordError) {
                            Text(
                                text = INVALID_PASSWORD,
                                color = ERROR_COLOR,
                                fontSize = 12.sp,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(24.dp))
                        // Login Button
                        Button(
                            onClick = {
                                if (!emailError && !passwordError) {
                                    authViewModel.login(email, password)
                                } else {
                                    coroutineScope.launch {
                                        snackbarHostState.showSnackbar(FIX_ERRORS)
                                    }
                                }
                            },
                            modifier = Modifier
                                .width(180.dp)
                                .height(40.dp)
                                .shadow(4.dp, shape = RoundedCornerShape(18.dp)),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = BUTTON_BG_COLOR,
                                contentColor = BUTTON_TEXT_COLOR
                            ),
                            enabled = !isLoading
                        ) {
                            Text(LOGIN, fontSize = 20.sp, color = BUTTON_TEXT_COLOR)
                        }
                        // Observe auth response
                        LaunchedEffect(authViewModel.authResponse.value) {
                            authViewModel.authResponse.value?.let { response ->
                                if (response.error != null) {
                                    snackbarHostState.showSnackbar(response.error ?: "Unknown error")
                                } else if (response.token != null) {
                                    visible = !visible
                                    navController.navigate("home") {
                                        popUpTo("login") { inclusive = true }
                                    }
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                        // Forgot Password Text
                        Text(
                            text = FORGOT_PASSWORD,
                            color = PRIMARY_COLOR,
                            modifier = Modifier
                                .clickable { navController.navigate("forgot-password") }
                                .semantics { this.contentDescription = "Forgot Password link" }
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                        // Navigate to Register
                        Text(DONT_HAVE_ACCOUNT, color = PRIMARY_COLOR)
                        Button(
                            onClick = {
                                visible = !visible
                                navController.navigate("register")
                            },
                            modifier = Modifier.shadow(4.dp, shape = RoundedCornerShape(18.dp)),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = BUTTON_BG_COLOR,
                                contentColor = BUTTON_TEXT_COLOR
                            )
                        ) {
                            Text(REGISTER, color = BUTTON_TEXT_COLOR)
                        }
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
                    HeartbeatLoadingIndicator(
                        modifier = Modifier.size(150.dp),
                        color = PRIMARY_COLOR,
                        message = LOGGING_IN
                    )
                }
            }
        }
        // Snackbar Host
        androidx.compose.material3.SnackbarHost(
            hostState = snackbarHostState,
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }
}
@Preview(showBackground = true)
@Composable
private fun LoginScreenPreview() {
    JeevanAndroidTheme {
        LoginScreen(
            navController = rememberNavController(),
            authViewModel = viewModel(factory = AuthViewModelFactory(PrefsManager(LocalContext.current))))
    }
}

