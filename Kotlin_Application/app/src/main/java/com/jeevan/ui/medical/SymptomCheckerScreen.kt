package com.jeevan.ui.medical

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.jeevan.models.Disease
import com.jeevan.models.Symptom
import com.jeevan.ui.theme.JeevanAndroidTheme
import com.jeevan.viewmodel.SymptomCheckerViewModel
import com.jeevan.viewmodel.SymptomCheckerViewModelFactory

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SymptomCheckerScreen(
    navController: NavController,
    symptomCheckerViewModel: SymptomCheckerViewModel = viewModel(factory = SymptomCheckerViewModelFactory())
) {
    val searchQuery by symptomCheckerViewModel.searchQuery.observeAsState("")
    val filteredSymptoms by symptomCheckerViewModel.filteredSymptoms.observeAsState(emptyList())
    val selectedSymptoms by symptomCheckerViewModel.selectedSymptoms.observeAsState(emptyList())
    val predictedDiseases by symptomCheckerViewModel.predictedDiseases.observeAsState(emptyList())
    val isLoading by symptomCheckerViewModel.isLoading.observeAsState(false)
    val error by symptomCheckerViewModel.error.observeAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Symptom Checker", color = Color.White) },
                navigationIcon = {
                    IconButton(onClick = { navController.navigateUp() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.Black)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF08BAED) // Medical-themed blue color
                )
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFFCE4EC))
                .padding(16.dp)
        ) {
            // Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { symptomCheckerViewModel.updateSearchQuery(it) },
                textStyle = TextStyle(color = Color.White),
                modifier = Modifier
                    .background(Color(0xFFFCE4EC))
                    .fillMaxWidth()
                    .padding(bottom = 16.dp),
                placeholder = { Text("Search symptoms...", color = Color.Gray) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search") },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { symptomCheckerViewModel.updateSearchQuery("") }) {
                            Icon(Icons.Default.Clear, contentDescription = "Clear")
                        }
                    }
                },
                singleLine = true,
                shape = RoundedCornerShape(8.dp),
                colors = TextFieldDefaults.colors(
                    focusedIndicatorColor = Color(0xFF08BAED),
                    unfocusedIndicatorColor = Color.Gray
                )
            )

            // Selected Symptoms Section (if any)
            AnimatedVisibility(
                visible = selectedSymptoms.isNotEmpty(),
                enter = fadeIn() + expandVertically(),
                exit = fadeOut() + shrinkVertically()
            ) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFE3F2FD))
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Selected Symptoms (${selectedSymptoms.size})",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                color = Color(0xFF08BAED)
                            )
                            Button(
                                onClick = { symptomCheckerViewModel.clearAllSymptoms() },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Color(0xFF08BAED)
                                ),
                                modifier = Modifier.padding(start = 8.dp)
                            ) {
                                Text("Clear All")
                            }
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        LazyColumn(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(if (selectedSymptoms.size > 2) 120.dp else 60.dp)
                        ) {
                            items(selectedSymptoms) { symptom ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = symptom.name,
                                        modifier = Modifier.weight(1f)
                                    )
                                    IconButton(
                                        onClick = { symptomCheckerViewModel.toggleSymptomSelection(symptom.id) },
                                        modifier = Modifier.size(24.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Clear,
                                            contentDescription = "Remove",
                                            tint = Color.Red,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Disease Predictions Section (if any)
            AnimatedVisibility(
                visible = predictedDiseases.isNotEmpty(),
                enter = fadeIn() + expandVertically(),
                exit = fadeOut() + shrinkVertically()
            ) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            text = "Possible Conditions",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = Color(0xFF08BAED),
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                        
                        LazyColumn(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(240.dp)
                        ) {
                            items(predictedDiseases) { disease ->
                                DiseasePredictionItem(disease = disease)
                                if (disease != predictedDiseases.last()) {
                                    Divider(modifier = Modifier.padding(vertical = 8.dp))
                                }
                            }
                        }
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        // Disclaimer
                        Text(
                            text = "⚠️ Please visit your nearest doctor for better diagnosis and treatment.",
                            fontSize = 14.sp,
                            color = Color.Red,
                            textAlign = TextAlign.Center,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 8.dp)
                                .background(Color(0xFFFFEBEE), RoundedCornerShape(4.dp))
                                .padding(8.dp)
                        )
                    }
                }
            }

            // Loading Indicator
            if (isLoading) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = Color(0xFF08BAED))
                }
            }

            // Error Message
            error?.let {
                Text(
                    text = it,
                    color = Color.Red,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(8.dp)
                )
            }

            // Symptoms List
            Text(
                text = "Common Symptoms",
                color = Color(0xFF000000),
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                modifier = Modifier.padding(vertical = 8.dp)
            )

            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
            ) {
                items(filteredSymptoms) { symptom ->
                    SymptomItem(
                        symptom = symptom,
                        onToggleSelection = { symptomCheckerViewModel.toggleSymptomSelection(symptom.id) }
                    )
                }
            }
        }
    }
}

@Composable
fun SymptomItem(
    symptom: Symptom,
    onToggleSelection: () -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    val rotationState by animateFloatAsState(
        targetValue = if (expanded) 180f else 0f
    )

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .animateContentSize(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (symptom.isSelected) Color(0xFFE3F2FD) else Color.White
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)

        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = symptom.name,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    modifier = Modifier.weight(1f)
                )
                
                // Add button
                IconButton(
                    onClick = { onToggleSelection() },
                    modifier = Modifier
                        .size(32.dp)
                        .background(
                            color = if (symptom.isSelected) Color.Red else Color(0xFF08BAED),
                            shape = CircleShape
                        )
                ) {
                    Icon(
                        imageVector = if (symptom.isSelected) Icons.Default.Clear else Icons.Default.Add,
                        contentDescription = if (symptom.isSelected) "Remove" else "Add",
                        tint = Color.White,
                        modifier = Modifier.size(16.dp)
                    )
                }
                
                // Expand/collapse button
                IconButton(
                    onClick = { expanded = !expanded },
                    modifier = Modifier.padding(start = 8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.KeyboardArrowDown,
                        contentDescription = if (expanded) "Collapse" else "Expand",
                        modifier = Modifier.rotate(rotationState)
                    )
                }
            }

            // Expanded content
            AnimatedVisibility(visible = expanded) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp)
                ) {
                    // Description
                    Text(
                        text = "Description",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = Color(0xFF08BAED),
                        modifier = Modifier.padding(top = 8.dp, bottom = 4.dp)
                    )
                    Text(
                        text = symptom.description,
                        fontSize = 14.sp
                    )

                    // Causes
                    Text(
                        text = "Likely Causes",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = Color(0xFF08BAED),
                        modifier = Modifier.padding(top = 8.dp, bottom = 4.dp)
                    )
                    symptom.causes.forEach { cause ->
                        Text(
                            text = "• $cause",
                            fontSize = 14.sp
                        )
                    }

                    // Cures
                    Text(
                        text = "Cures",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = Color(0xFF08BAED),
                        modifier = Modifier.padding(top = 8.dp, bottom = 4.dp)
                    )
                    symptom.cures.forEach { cure ->
                        Text(
                            text = "• $cure",
                            fontSize = 14.sp
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun DiseasePredictionItem(disease: Disease) {
    var expanded by remember { mutableStateOf(false) }
    val rotationState by animateFloatAsState(
        targetValue = if (expanded) 180f else 0f
    )

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .animateContentSize()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { expanded = !expanded }
                .padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = disease.name,
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                modifier = Modifier.weight(1f)
            )
            IconButton(onClick = { expanded = !expanded }) {
                Icon(
                    imageVector = Icons.Default.KeyboardArrowDown,
                    contentDescription = if (expanded) "Collapse" else "Expand",
                    modifier = Modifier.rotate(rotationState)
                )
            }
        }

        // Expanded content
        AnimatedVisibility(visible = expanded) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 8.dp, end = 8.dp, bottom = 8.dp)
            ) {
                // Description
                Text(
                    text = "Description",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = Color(0xFF08BAED),
                    modifier = Modifier.padding(top = 4.dp, bottom = 2.dp)
                )
                Text(
                    text = disease.description,
                    fontSize = 14.sp
                )

                // Cures
                Text(
                    text = "Cures",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = Color(0xFF08BAED),
                    modifier = Modifier.padding(top = 8.dp, bottom = 2.dp)
                )
                disease.cures.forEach { cure ->
                    Text(
                        text = "• $cure",
                        fontSize = 14.sp
                    )
                }

                // Related Symptoms
                Text(
                    text = "Related Symptoms",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = Color(0xFF08BAED),
                    modifier = Modifier.padding(top = 8.dp, bottom = 2.dp)
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Start
                ) {
                    disease.relatedSymptoms.forEach { symptom ->
                        Text(
                            text = symptom,
                            fontSize = 12.sp,
                            color = Color.White,
                            modifier = Modifier
                                .padding(end = 4.dp, bottom = 4.dp)
                                .background(Color(0xFF08BAED), RoundedCornerShape(4.dp))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun SymptomCheckerScreenPreview() {
    JeevanAndroidTheme {
        SymptomCheckerScreen(
            navController = rememberNavController(),
            symptomCheckerViewModel = viewModel(factory = SymptomCheckerViewModelFactory()))
    }
}