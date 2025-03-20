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
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListScope
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
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
import androidx.compose.runtime.mutableStateListOf
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.jeevanandroid.R
import com.example.jeevanandroid.ui.components.MedicalThemeColorChangingButton
import com.example.jeevanandroid.utils.PrefsManager
import kotlinx.coroutines.launch

@Composable
fun HomeScreen(navController: NavController) {
    val context = LocalContext.current
    val prefsManager = remember { PrefsManager(context) }
    var searchQuery by remember { mutableStateOf("") }
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    var showNotifications by remember { mutableStateOf(false) }

    val notifications = remember {
        mutableStateListOf(
            Notification("Your appointment is confirmed for tomorrow.", false),
            Notification("New medicine is available in the shop.", false),
            Notification("Your recent test results are ready.", true) // Example of a read notification
        )
    }

    // Function to mark a notification as read
    fun markNotificationAsRead(index: Int) {
        notifications[index] = notifications[index].copy(read = true)
    }

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
                                showNotifications = true
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
                        .verticalScroll(rememberScrollState())
                ) {
                    // Add the Dashboard component
                    DashboardScreen(prefsManager)
                    
                    // Additional sections can be added here
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    // Example of additional content after the dashboard
                    SpecialtiesSection(navController)
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    RecommendationSection(navController)
                }
            }
            
            // Show notifications panel if showNotifications is true
            if (showNotifications) {
                NotificationsPanel(
                    notifications = notifications,
                    onDismiss = { showNotifications = false },
                    onDelete = { index ->
                        notifications.removeAt(index)
                    },
                    onMarkAsRead = { index ->
                        markNotificationAsRead(index)
                    }
                )
            }
        }
    }
}

data class Notification(
    val message: String,
    val read: Boolean
)

@Composable
fun NotificationsPanel(
    notifications: List<Notification>,
    onDismiss: () -> Unit,
    onDelete: (Int) -> Unit,
    onMarkAsRead: (Int) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.5f)) // Semi-transparent background
            .clickable { onDismiss() }, // Close pop-up when clicking outside
        contentAlignment = Alignment.TopCenter
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth(0.8f) // 80% of screen width
                .padding(16.dp)
                .background(Color.White, RoundedCornerShape(16.dp)) // White background with rounded corners
                .padding(16.dp)
                .clickable(enabled = false) {}, // Prevent click propagation to Box
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Notifications",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF08BAED),
                modifier = Modifier.padding(bottom = 16.dp)
            )
            
            if (notifications.isEmpty()) {
                // Show message if no notifications
                Icon(
                    imageVector = Icons.Default.Delete, // Fallback icon
                    contentDescription = "No Notifications",
                    modifier = Modifier.size(48.dp),
                    tint = Color.Gray
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "No Notifications",
                    fontSize = 18.sp,
                    color = Color.Gray
                )
            } else {
                // Scrollable notification list
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 400.dp) // Maximum height for the scrollable area
                        .padding(8.dp)
                ) {
                    items(notifications.size) { index ->
                        val notification = notifications[index]
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(
                                    if (notification.read) Color(0xFFE0E0E0) else Color(0xFF08BAED).copy(alpha = 0.8f), 
                                    RoundedCornerShape(8.dp)
                                )
                                .clickable {
                                    onMarkAsRead(index) // Mark the notification as read when clicked
                                }
                                .padding(12.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = notification.message,
                                    fontSize = 16.sp,
                                    color = if (notification.read) Color.Black else Color.White,
                                    modifier = Modifier.weight(1f)
                                )
                                
                                IconButton(
                                    onClick = { onDelete(index) }
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Delete,
                                        contentDescription = "Delete",
                                        tint = if (notification.read) Color.Black else Color.White
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Close Button
            Button(
                onClick = onDismiss,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF08BAED), // Medical-themed blue color
                    contentColor = Color.White
                )
            ) {
                Text(text = "Close", fontSize = 16.sp)
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
fun SpecialtiesSection(navController: NavController) {
    // Specialties Section
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
            .shadow(4.dp, RoundedCornerShape(8.dp)) // Add shadow to the box
            .background(Color(0xFFE3F2FD), RoundedCornerShape(8.dp)) // Light blue background
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.Start
        ) {
            Text(
                text = "Specialties",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF08BAED), // Medical-themed blue color
                modifier = Modifier.padding(bottom = 16.dp)
            )
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                SpecialtyItem("Cardiology", R.drawable.profile_placeholder)
                SpecialtyItem("Neurology", R.drawable.profile_placeholder)
                SpecialtyItem("Orthopedics", R.drawable.profile_placeholder)
            }
        }
    }
}

@Composable
fun SpecialtyItem(name: String, iconResId: Int) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .padding(8.dp)
            .clickable { /* Handle click */ }
    ) {
        Image(
            painter = painterResource(id = iconResId),
            contentDescription = name,
            modifier = Modifier
                .size(60.dp)
                .padding(8.dp)
        )
        Text(
            text = name,
            fontSize = 14.sp,
            color = Color.Black
        )
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
                fontWeight = FontWeight.Bold,
                color = Color(0xFF08BAED), // Medical-themed blue color
                modifier = Modifier.padding(bottom = 8.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .aspectRatio(1f)
                        .background(Color.White, RoundedCornerShape(8.dp))
                        .padding(16.dp)
                        .clickable { /* Navigate or perform an action */ },
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.profile_placeholder),
                        contentDescription = "Pharmacy Icon",
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Pharmacy",
                        color = Color.Black,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium
                    )
                }

                Column(
                    modifier = Modifier
                        .weight(1f)
                        .aspectRatio(1f)
                        .background(Color.White, RoundedCornerShape(8.dp))
                        .padding(16.dp)
                        .clickable { /* Navigate or perform an action */ },
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.profile_placeholder),
                        contentDescription = "Hospital Icon",
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Hospitals",
                        color = Color.Black,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }
    }
}
