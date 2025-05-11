package com.example.jeevanandroid.ui.onboarding

import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
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
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.jeevanandroid.models.BloodGroup
import com.example.jeevanandroid.models.UserProfile
import com.example.jeevanandroid.viewmodel.UserProfileViewModel

@OptIn(ExperimentalLayoutApi::class, ExperimentalMaterial3Api::class)
@Composable
fun MedicalDetailsStep(
    viewModel: UserProfileViewModel,
    onNext: () -> Unit,
    onBack: () -> Unit
) {
    val userProfile by viewModel.userProfile.observeAsState(UserProfile())
    val scrollState = rememberScrollState()
    
    // Local state for adding new items to lists
    var newAllergy by remember { mutableStateOf("") }
    var newCondition by remember { mutableStateOf("") }
    var newMedication by remember { mutableStateOf("") }
    
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
                text = "Medical Details",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF08BAED)
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Height input
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Height field
                FloatingLabelTextField(
                    label = "Height (cm)",
                    value = if (userProfile.height == 0f) "" else userProfile.height.toString(),
                    onValueChange = { 
                        if (it.isEmpty()) {
                            viewModel.updateProfileField("height", 0f)
                        } else {
                            it.toFloatOrNull()?.let { value ->
                                viewModel.updateProfileField("height", value)
                            }
                        }
                    },
                    keyboardType = KeyboardType.Number,
                    modifier = Modifier.weight(1f)
                )
                
                // Weight field
                FloatingLabelTextField(
                    label = "Weight (kg)",
                    value = if (userProfile.weight == 0f) "" else userProfile.weight.toString(),
                    onValueChange = { 
                        if (it.isEmpty()) {
                            viewModel.updateProfileField("weight", 0f)
                        } else {
                            it.toFloatOrNull()?.let { value ->
                                viewModel.updateProfileField("weight", value)
                            }
                        }
                    },
                    keyboardType = KeyboardType.Number,
                    modifier = Modifier.weight(1f)
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Blood group selector
            BloodGroupSelector(
                selectedBloodGroup = userProfile.bloodGroup,
                onBloodGroupSelected = { viewModel.updateProfileField("bloodGroup", it) }
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Allergies section
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Allergies",
                    color = Color(0xFF484C4C),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                // Display existing allergies as chips
                if (userProfile.allergies.isNotEmpty()) {
                    FlowRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        userProfile.allergies.forEachIndexed { index, allergy ->
                            CustomChip(
                                text = allergy,
                                onRemove = {
                                    val updatedList = userProfile.allergies.toMutableList()
                                    updatedList.removeAt(index)
                                    viewModel.updateProfileField("allergies", updatedList)
                                }
                            )
                        }
                    }
                    
                    Spacer(modifier = Modifier.height(8.dp))
                }
                
                // Add allergy input
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = newAllergy,
                        onValueChange = { newAllergy = it },
                        modifier = Modifier.weight(1f),
                        placeholder = { Text("Enter allergy") },
                        singleLine = true,
                        colors = TextFieldDefaults.outlinedTextFieldColors(
                            focusedBorderColor = Color(0xFF08BAED),
                            cursorColor = Color(0xFF08BAED)
                        )
                    )
                    
                    IconButton(
                        onClick = {
                            if (newAllergy.isNotBlank()) {
                                val updatedList = userProfile.allergies.toMutableList()
                                updatedList.add(newAllergy)
                                viewModel.updateProfileField("allergies", updatedList)
                                newAllergy = ""
                            }
                        }
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Add",
                            tint = Color(0xFF08BAED)
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Medical conditions section
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Medical Conditions",
                    color = Color(0xFF484C4C),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                // Display existing medical conditions as chips
                if (userProfile.medicalConditions.isNotEmpty()) {
                    FlowRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        userProfile.medicalConditions.forEachIndexed { index, condition ->
                            CustomChip(
                                text = condition,
                                onRemove = {
                                    val updatedList = userProfile.medicalConditions.toMutableList()
                                    updatedList.removeAt(index)
                                    viewModel.updateProfileField("medicalConditions", updatedList)
                                }
                            )
                        }
                    }
                    
                    Spacer(modifier = Modifier.height(8.dp))
                }
                
                // Add medical condition input
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = newCondition,
                        onValueChange = { newCondition = it },
                        modifier = Modifier.weight(1f),
                        placeholder = { Text("Enter medical condition") },
                        singleLine = true,
                        colors = TextFieldDefaults.outlinedTextFieldColors(
                            focusedBorderColor = Color(0xFF08BAED),
                            cursorColor = Color(0xFF08BAED)
                        )
                    )
                    
                    IconButton(
                        onClick = {
                            if (newCondition.isNotBlank()) {
                                val updatedList = userProfile.medicalConditions.toMutableList()
                                updatedList.add(newCondition)
                                viewModel.updateProfileField("medicalConditions", updatedList)
                                newCondition = ""
                            }
                        }
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Add",
                            tint = Color(0xFF08BAED)
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Medications section
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Current Medications",
                    color = Color(0xFF484C4C),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                // Display existing medications as chips
                if (userProfile.medications.isNotEmpty()) {
                    FlowRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        userProfile.medications.forEachIndexed { index, medication ->
                            CustomChip(
                                text = medication,
                                onRemove = {
                                    val updatedList = userProfile.medications.toMutableList()
                                    updatedList.removeAt(index)
                                    viewModel.updateProfileField("medications", updatedList)
                                }
                            )
                        }
                    }
                    
                    Spacer(modifier = Modifier.height(8.dp))
                }
                
                // Add medication input
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = newMedication,
                        onValueChange = { newMedication = it },
                        modifier = Modifier.weight(1f),
                        placeholder = { Text("Enter medication") },
                        singleLine = true,
                        colors = TextFieldDefaults.outlinedTextFieldColors(
                            focusedBorderColor = Color(0xFF08BAED),
                            cursorColor = Color(0xFF08BAED)
                        )
                    )
                    
                    IconButton(
                        onClick = {
                            if (newMedication.isNotBlank()) {
                                val updatedList = userProfile.medications.toMutableList()
                                updatedList.add(newMedication)
                                viewModel.updateProfileField("medications", updatedList)
                                newMedication = ""
                            }
                        }
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Add",
                            tint = Color(0xFF08BAED)
                        )
                    }
                }
            }
            
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
    modifier: Modifier = Modifier,
    singleLine: Boolean = true
) {
    var isFocused by remember { mutableStateOf(false) }
    
    Column(modifier = modifier.fillMaxWidth()) {
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
fun BloodGroupSelector(
    selectedBloodGroup: String,
    onBloodGroupSelected: (String) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    var isFocused by remember { mutableStateOf(false) }
    
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "Blood Group",
            color = Color(0xFF484C4C),
            fontSize = if (isFocused || selectedBloodGroup.isNotEmpty()) 12.sp else 16.sp,
            modifier = Modifier
                .padding(start = 2.dp)
                .offset(y = if (isFocused || selectedBloodGroup.isNotEmpty()) 0.dp else 8.dp)
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
                    text = if (selectedBloodGroup.isEmpty()) "Select blood group" else selectedBloodGroup,
                    color = if (selectedBloodGroup.isEmpty()) Color.Gray else Color.Black,
                    fontSize = 16.sp,
                    modifier = Modifier.weight(1f)
                )
                
                Icon(
                    imageVector = Icons.Default.ArrowDropDown,
                    contentDescription = "Select blood group",
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
                BloodGroup.values().forEach { bloodGroup ->
                    DropdownMenuItem(
                        text = { Text(bloodGroup.value) },
                        onClick = {
                            onBloodGroupSelected(bloodGroup.value)
                            expanded = false
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun CustomChip(
    text: String,
    onRemove: () -> Unit
) {
    Card(
        modifier = Modifier
            .padding(4.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFFE3F2FD)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Row(
            modifier = Modifier
                .padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = text,
                color = Color(0xFF08BAED),
                fontSize = 14.sp,
                modifier = Modifier.padding(end = 4.dp)
            )
            
            IconButton(
                onClick = onRemove,
                modifier = Modifier.size(16.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Remove",
                    tint = Color(0xFF08BAED),
                    modifier = Modifier.size(12.dp)
                )
            }
        }
    }
} 