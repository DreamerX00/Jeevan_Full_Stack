package com.example.jeevanandroid.ui.home

import android.widget.Toast
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.Text
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.jeevanandroid.R
import com.example.jeevanandroid.ui.components.MedicalThemeColorChangingButton
import kotlinx.coroutines.launch

@Composable
fun HomeScreen(navController: NavController) {
    val context = LocalContext.current
    var searchQuery by remember { mutableStateOf("") }
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()

    // Navigation Drawer Content
    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            // Constrain the drawer width to 280.dp
            Box(
                modifier = Modifier
                    .width(280.dp)
                    .fillMaxHeight()
                    .background(Color(0xFFF5F5F5)) // Light gray background for the drawer
                    .shadow(4.dp) // Add shadow to the drawer
            ) {
                DrawerContent(navController) {
                    scope.launch {
                        drawerState.close() // Close the drawer when an option is clicked
                    }
                }
            }
        }
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(6.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Top
            ) {
                // Top Bar with Nav Bar, Profile, and Notification
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(2.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    // Nav Bar (Left)
                    IconButton(onClick = {
                        scope.launch {
                            drawerState.open() // Open the drawer when the nav icon is clicked
                        }
                    }) {
                        Icon(
                            painter = painterResource(id = R.drawable.profile_placeholder), // Replace with your nav icon
                            contentDescription = "Nav Bar",
                            modifier = Modifier.size(24.dp),
                            tint = Color(0xFF08BAED) // Medical-themed blue color
                        )
                    }

                    // Search Bar
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        BasicTextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            modifier = Modifier
                                .weight(1f)
                                .background(Color.LightGray, RoundedCornerShape(20.dp))
                                .padding(horizontal = 16.dp, vertical = 12.dp),
                            singleLine = true,
                            textStyle = TextStyle(fontSize = 16.sp),
                            keyboardOptions = KeyboardOptions.Default.copy(
                                keyboardType = KeyboardType.Text
                            ),
                            decorationBox = { innerTextField ->
                                Row(
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Search,
                                        contentDescription = "Search",
                                        modifier = Modifier.size(24.dp),
                                        tint = Color(0xFF08BAED) // Medical-themed blue color
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    innerTextField()
                                }
                            }
                        )

                        // Profile and Notification (Right)
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            IconButton(onClick = {
                                Toast.makeText(context, "Notifications", Toast.LENGTH_SHORT).show()
                            }) {
                                Icon(
                                    imageVector = Icons.Default.Notifications,
                                    contentDescription = "Notifications",
                                    modifier = Modifier.size(24.dp),
                                    tint = Color(0xFF08BAED) // Medical-themed blue color
                                )
                            }
                        }
                    }
                }

                // Scrollable Content
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState()) // Make this column scrollable
                        .weight(1f) // Take up remaining space
                        .padding(horizontal = 8.dp)
                ) {
                    Spacer(modifier = Modifier.height(16.dp))

                    // Sliding Carousel
                    Text(
                        text = "Offers",
                        fontSize = 20.sp,
                        color = Color.Black,
                        modifier = Modifier.padding(8.dp)
                    )
                    AutoSlidingCarousel(navController = navController)



                    Spacer(modifier = Modifier.height(8.dp))

                    // Specialities Section
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(8.dp)
                            .shadow(4.dp, RoundedCornerShape(8.dp)) // Add shadow to the box
                            .background(Color(0xFFE3F2FD), RoundedCornerShape(8.dp)) // Light blue background
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(6.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Top
                        ) {
                            Text(
                                text = "Specialities",
                                fontSize = 20.sp,
                                color = Color(0xFF08BAED), // Medical-themed blue color
                                modifier = Modifier.padding(8.dp)
                            )

                            Spacer(modifier = Modifier.height(10.dp))

                            // 6 Speciality Buttons in 2 Rows
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(8.dp),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                SpecialityButton(R.drawable.symptoms, "Symptoms")
                                SpecialityButton(R.drawable.appointment, "Appointment")
                                SpecialityButton(R.drawable.diagnose, "Diagnose")
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(8.dp),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                SpecialityButton(R.drawable.cart, "Shop")
                                SpecialityButton(R.drawable.medical_kit, "Kit")
                                SpecialityButton(R.drawable.vaccination, "Vaccination")
                            }

                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(8.dp),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                MedicalThemeColorChangingButton(text = "See All") {
                                    // Handle "See All" button click
                                }
                            }
                        }
                    }

                    RecommendationSection(navController)
                }
            }
        }
    }
}

@Composable
fun DrawerContent(navController: NavController, onItemClick: () -> Unit) {
    val context = LocalContext.current
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F5F5)) // Light gray background
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Profile Picture
        Image(
            painter = painterResource(id = R.drawable.profile_placeholder),
            contentDescription = "Profile Picture",
            modifier = Modifier
                .size(100.dp)
                .padding(8.dp)
        )

        // Name
        Text(
            text = "User Name",
            fontSize = 18.sp,
            color = Color(0xFF08BAED), // Medical-themed blue color
            modifier = Modifier.padding(8.dp)
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Navigation Options
        val options = listOf(
            "My Profile",
            "Appointments",
            "My Calendar",
            "Shop",
            "Emergency Contacts",
            "Settings"
        )

        options.forEach { option ->
            Text(
                text = option,
                fontSize = 16.sp,
                color = Color.Black,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 12.dp)
                    .clickable {
                        Toast.makeText(context, option, Toast.LENGTH_SHORT).show()
                        onItemClick()
                    }
            )
        }

        Spacer(modifier = Modifier.weight(1f))

        // Logout Button
        Button(
            onClick = {
                navController.navigate("login")
                Toast.makeText(context, "Logout", Toast.LENGTH_SHORT).show()
                onItemClick()
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFF08BAED), // Medical-themed blue color
                contentColor = Color.White
            )
        ) {
            Text(text = "Logout", fontSize = 18.sp)
        }
    }
}

@Composable
fun SpecialityButton(imageResId: Int, text: String) {
    val context = LocalContext.current
    Column(
        modifier = Modifier
            .size(100.dp) // Increased size for better usability
            .padding(4.dp)
            .clickable {
                Toast.makeText(context, text, Toast.LENGTH_SHORT).show()
            },
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Image(
            painter = painterResource(id = imageResId),
            contentDescription = text,
            modifier = Modifier.size(50.dp) // Increased image size
        )
        Text(text = text, fontSize = 14.sp, color = Color.Black) // Increased text size
    }
}

@Composable
fun AutoSlidingCarousel(navController: NavController) {
    val images = listOf(
        R.drawable.imagenotfound,
        R.drawable.imagenotfound,
        R.drawable.imagenotfound,
        R.drawable.imagenotfound,
        R.drawable.imagenotfound,
        R.drawable.imagenotfound,
    )

    val infiniteTransition = rememberInfiniteTransition()
    val offsetX by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = -images.size * 320f, // Adjust based on image width and spacing
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 40000 , easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        )
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(200.dp) // Increased height
            .shadow(8.dp, RoundedCornerShape(16.dp)) // Added shadow
            .background(Color.White, RoundedCornerShape(16.dp)) // White background with rounded corners
            .padding(8.dp)
            .horizontalScroll(rememberScrollState())
    ) {
        Row(
            modifier = Modifier
                .offset(x = offsetX.dp)
                .width((images.size * 320).dp) // Adjust width based on image count and size
                .padding(horizontal = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            images.forEach { imageResId ->
                Image(
                    painter = painterResource(id = imageResId),
                    contentDescription = "Carousel Image",
                    modifier = Modifier
                        .size(300.dp) // Adjust image size
                        .clickable {
                            // Navigate to another screen or link
                            navController.navigate("offer_detail_screen")
                        }
                )
            }
        }
    }
}


@Composable
fun RecommendationSection(navController: NavController) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
            .shadow(4.dp, RoundedCornerShape(8.dp)) // Added shadow
            .background(Color(0xFFE3F2FD), RoundedCornerShape(8.dp)) // Light blue background
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                text = "Nearby",
                fontSize = 20.sp,
                color = Color(0xFF08BAED), // Medical-themed blue color
                modifier = Modifier.padding(bottom = 16.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .aspectRatio(1f)
                        .clickable { /* Navigate or perform an action */ },
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.pharamcy_icon),
                        contentDescription = "Pharmacy Icon",
                        modifier = Modifier.size(64.dp)
                    )
                    Text("Pharmacy", color = Color.Black)
                }

                Column(
                    modifier = Modifier
                        .weight(1f)
                        .aspectRatio(1f)
                        .clickable { /* Navigate or perform an action */ },
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.hospital_icon),
                        contentDescription = "Hospital Icon",
                        modifier = Modifier.size(64.dp)
                    )
                    Text("Hospitals", color = Color.Black)
                }
            }
        }
    }
}
