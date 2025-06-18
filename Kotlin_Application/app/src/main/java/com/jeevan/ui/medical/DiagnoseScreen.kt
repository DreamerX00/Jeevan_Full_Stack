package com.jeevan.ui.medical

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.compose.runtime.livedata.observeAsState
import com.jeevan.models.DiagnosticTest
import com.jeevan.models.DiagnosticCenter
import com.jeevan.viewmodel.DiagnoseViewModel
import com.jeevan.viewmodel.DiagnoseViewModelFactory
import androidx.compose.foundation.layout.FlowRow

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DiagnoseScreen(
    onNavigateBack: () -> Unit,
    viewModel: DiagnoseViewModel = viewModel(factory = DiagnoseViewModelFactory())
) {
    var activeTab by remember { mutableStateOf("tests") }
    val selectedTest by viewModel.selectedTest.observeAsState()
    val diagnosticTests by viewModel.diagnosticTests.observeAsState(initial = emptyList())
    val diagnosticCenters by viewModel.diagnosticCenters.observeAsState(initial = emptyList())
    val selectedCenter by viewModel.selectedCenter.observeAsState()
    val isLoading by viewModel.isLoading.observeAsState(initial = false)
    val error by viewModel.error.observeAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Diagnose") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Tabs
            TabRow(
                selectedTabIndex = when (activeTab) {
                    "tests" -> 0
                    "centers" -> 1
                    "map" -> 2
                    else -> 0
                }
            ) {
                Tab(
                    selected = activeTab == "tests",
                    onClick = { activeTab = "tests" },
                    text = { Text("Tests") }
                )
                Tab(
                    selected = activeTab == "centers",
                    onClick = { activeTab = "centers" },
                    text = { Text("Centers") }
                )
                Tab(
                    selected = activeTab == "map",
                    onClick = { activeTab = "map" },
                    text = { Text("Map") }
                )
            }

            // Content based on active tab
            when (activeTab) {
                "tests" -> TestsTab(
                    tests = diagnosticTests,
                    selectedTest = selectedTest,
                    onTestSelected = { viewModel.selectTest(it) },
                    onFindCenters = { viewModel.findCentersForTest(it) }
                )
                "centers" -> CentersTab(
                    centers = diagnosticCenters,
                    selectedCenter = selectedCenter,
                    onCenterSelected = { viewModel.selectCenter(it) },
                    selectedTest = selectedTest
                )
                "map" -> MapTab(
                    centers = diagnosticCenters,
                    selectedCenter = selectedCenter,
                    onCenterSelected = { viewModel.selectCenter(it) },
                    selectedTest = selectedTest
                )
            }
        }
    }
}

@Composable
private fun TestsTab(
    tests: List<DiagnosticTest>,
    selectedTest: DiagnosticTest?,
    onTestSelected: (DiagnosticTest) -> Unit,
    onFindCenters: (DiagnosticTest) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        items(tests) { test ->
            DiagnosticTestCard(
                test = test,
                isSelected = test == selectedTest,
                onTestSelected = onTestSelected,
                onFindCenters = onFindCenters
            )
        }
    }
}

@Composable
private fun DiagnosticTestCard(
    test: DiagnosticTest,
    isSelected: Boolean,
    onTestSelected: (DiagnosticTest) -> Unit,
    onFindCenters: (DiagnosticTest) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier.fillMaxWidth(),
        onClick = { onTestSelected(test) }
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = test.name,
                        style = MaterialTheme.typography.titleMedium
                    )
                    Text(
                        text = test.category,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Text(
                    text = test.price,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary
                )
            }

            if (expanded) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = test.description,
                    style = MaterialTheme.typography.bodyMedium
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Duration: ${test.duration}",
                        style = MaterialTheme.typography.bodySmall
                    )
                    Text(
                        text = "Preparation: ${test.preparation}",
                        style = MaterialTheme.typography.bodySmall
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Common Uses:",
                    style = MaterialTheme.typography.bodyMedium
                )
                FlowRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    test.commonUses.forEach { use ->
                        AssistChip(
                            onClick = { },
                            label = { Text(use) }
                        )
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
                Button(
                    onClick = { onFindCenters(test) },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Find Centers")
                }
            }

            IconButton(
                onClick = { expanded = !expanded },
                modifier = Modifier.align(Alignment.End)
            ) {
                Icon(
                    imageVector = if (expanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                    contentDescription = if (expanded) "Collapse" else "Expand"
                )
            }
        }
    }
}

@Composable
private fun CentersTab(
    centers: List<DiagnosticCenter>,
    selectedCenter: DiagnosticCenter?,
    onCenterSelected: (DiagnosticCenter) -> Unit,
    selectedTest: DiagnosticTest?
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        if (selectedTest != null) {
            item {
                SelectedTestInfo(test = selectedTest)
            }
        }

        items(centers) { center ->
            DiagnosticCenterCard(
                center = center,
                isSelected = center == selectedCenter,
                onClick = { onCenterSelected(center) }
            )
        }
    }
}

@Composable
private fun SelectedTestInfo(test: DiagnosticTest) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        )
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.MedicalServices,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(
                    text = test.name,
                    style = MaterialTheme.typography.titleMedium
                )
                Text(
                    text = test.description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun DiagnosticCenterCard(
    center: DiagnosticCenter,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        onClick = onClick,
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) {
                MaterialTheme.colorScheme.primaryContainer
            } else {
                MaterialTheme.colorScheme.surface
            }
        )
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.LocalHospital,
                contentDescription = null,
                tint = if (isSelected) {
                    MaterialTheme.colorScheme.primary
                } else {
                    MaterialTheme.colorScheme.onSurface
                }
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = center.name,
                    style = MaterialTheme.typography.titleMedium
                )
                Text(
                    text = center.address,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = "${center.distance} away",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun MapTab(
    centers: List<DiagnosticCenter>,
    selectedCenter: DiagnosticCenter?,
    onCenterSelected: (DiagnosticCenter) -> Unit,
    selectedTest: DiagnosticTest?
) {
    // TODO: Implement map view with Google Maps
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Text("Map view coming soon...")
    }
} 