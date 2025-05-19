package com.jeevan.ui.onboarding

import android.app.DatePickerDialog
import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
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
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.jeevan.models.Gender
import com.jeevan.models.UserProfile
import com.jeevan.viewmodel.UserProfileViewModel
import java.util.Calendar

@Composable
fun PersonalInfoStep(
    viewModel: UserProfileViewModel,
    onNext: () -> Unit,
    onBack: () -> Unit
) {
    val userProfile by viewModel.userProfile.observeAsState(UserProfile())
    val scrollState = rememberScrollState()
    
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .animateContentSize(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(
            modifier = Modifier
                .padding(16.dp)
                .verticalScroll(scrollState),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Personal Information",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF08BAED)
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // First name
            FloatingLabelTextField(
                label = "First Name",
                value = userProfile.firstName,
                onValueChange = { viewModel.updateProfileField("firstName", it) },
                keyboardType = KeyboardType.Text
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Last name
            FloatingLabelTextField(
                label = "Last Name",
                value = userProfile.lastName,
                onValueChange = { viewModel.updateProfileField("lastName", it) },
                keyboardType = KeyboardType.Text
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Date of birth
            DateOfBirthPicker(
                date = userProfile.dateOfBirth,
                onDateSelected = { viewModel.updateProfileField("dateOfBirth", it) }
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Gender selection
            GenderSelector(
                selectedGender = userProfile.gender,
                onGenderSelected = { viewModel.updateProfileField("gender", it) }
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Phone number
            FloatingLabelTextField(
                label = "Phone Number",
                value = userProfile.phone,
                onValueChange = { viewModel.updateProfileField("phone", it) },
                keyboardType = KeyboardType.Phone
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Address
            FloatingLabelTextField(
                label = "Address",
                value = userProfile.address,
                onValueChange = { viewModel.updateProfileField("address", it) },
                keyboardType = KeyboardType.Text,
                singleLine = false
            )
            
            Spacer(modifier = Modifier.height(32.dp))
            
            // Navigation buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                IconButton(onClick = onBack) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Back",
                        tint = Color(0xFF08BAED)
                    )
                }
                
                Button(
                    onClick = onNext,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF08BAED),
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(20.dp)
                ) {
                    Text("Continue")
                    Spacer(modifier = Modifier.width(8.dp))
                    Icon(
                        imageVector = Icons.Default.ArrowForward,
                        contentDescription = "Next"
                    )
                }
            }
        }
    }
}

@Composable
fun FloatingLabelTextField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    keyboardType: KeyboardType = KeyboardType.Text,
    singleLine: Boolean = true
) {
    var isFocused by remember { mutableStateOf(false) }
    
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = label,
            color = Color(0xFF484C4C),
            fontSize = if (isFocused || value.isNotEmpty()) 12.sp else 16.sp,
            modifier = Modifier
                .padding(start = 2.dp)
                .offset(y = if (isFocused || value.isNotEmpty()) 0.dp else 8.dp)
                .animateContentSize()
        )
        
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.dp)
        ) {
            BasicTextField(
                value = value,
                onValueChange = onValueChange,
                modifier = Modifier
                    .fillMaxWidth()
                    .onFocusChanged {
                        isFocused = it.isFocused
                    }
                    .background(Color.Transparent),
                singleLine = singleLine,
                keyboardOptions = KeyboardOptions.Default.copy(
                    keyboardType = keyboardType
                ),
                textStyle = TextStyle(
                    color = Color.Black,
                    fontSize = 16.sp
                )
            )
            
            Box(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .background(Color.Gray)
                    .height(1.dp)
                    .fillMaxWidth()
            )
        }
    }
}

@Composable
fun DateOfBirthPicker(
    date: String,
    onDateSelected: (String) -> Unit
) {
    val context = LocalContext.current
    var isFocused by remember { mutableStateOf(false) }
    
    // Calendar for date picker
    val calendar = Calendar.getInstance()
    val year = calendar.get(Calendar.YEAR)
    val month = calendar.get(Calendar.MONTH)
    val day = calendar.get(Calendar.DAY_OF_MONTH)
    
    // Date picker dialog
    val datePickerDialog = DatePickerDialog(
        context,
        { _, selectedYear, selectedMonth, selectedDay ->
            val formattedDate = "${selectedDay}/${selectedMonth + 1}/${selectedYear}"
            onDateSelected(formattedDate)
        }, year, month, day
    )
    
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "Date of Birth",
            color = Color(0xFF484C4C),
            fontSize = if (isFocused || date.isNotEmpty()) 12.sp else 16.sp,
            modifier = Modifier
                .padding(start = 2.dp)
                .offset(y = if (isFocused || date.isNotEmpty()) 0.dp else 8.dp)
                .animateContentSize()
        )
        
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.dp)
                .clickable {
                    isFocused = true
                    datePickerDialog.show()
                }
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (date.isEmpty()) "Select date" else date,
                    color = if (date.isEmpty()) Color.Gray else Color.Black,
                    fontSize = 16.sp,
                    modifier = Modifier.weight(1f)
                )
                
                Icon(
                    imageVector = Icons.Default.CalendarMonth,
                    contentDescription = "Select date",
                    tint = Color(0xFF08BAED)
                )
            }
            
            Box(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .background(Color.Gray)
                    .height(1.dp)
                    .fillMaxWidth()
            )
        }
    }
}

@Composable
fun GenderSelector(
    selectedGender: String,
    onGenderSelected: (String) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    var isFocused by remember { mutableStateOf(false) }
    
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "Gender",
            color = Color(0xFF484C4C),
            fontSize = if (isFocused || selectedGender.isNotEmpty()) 12.sp else 16.sp,
            modifier = Modifier
                .padding(start = 2.dp)
                .offset(y = if (isFocused || selectedGender.isNotEmpty()) 0.dp else 8.dp)
                .animateContentSize()
        )
        
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable {
                        expanded = true
                        isFocused = true
                    },
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (selectedGender.isEmpty()) "Select gender" else selectedGender,
                    color = if (selectedGender.isEmpty()) Color.Gray else Color.Black,
                    fontSize = 16.sp,
                    modifier = Modifier.weight(1f)
                )
                
                Icon(
                    imageVector = Icons.Default.ArrowDropDown,
                    contentDescription = "Select gender",
                    tint = Color(0xFF08BAED)
                )
            }
            
            Box(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .background(Color.Gray)
                    .height(1.dp)
                    .fillMaxWidth()
            )
            
            DropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false },
                modifier = Modifier
                    .shadow(elevation = 4.dp, shape = RoundedCornerShape(8.dp))
                    .background(Color.White)
            ) {
                Gender.values().forEach { gender ->
                    DropdownMenuItem(
                        text = { Text(gender.value) },
                        onClick = {
                            onGenderSelected(gender.value)
                            expanded = false
                        }
                    )
                }
            }
        }
    }
} 