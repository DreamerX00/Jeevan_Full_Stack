package com.jeevan.viewmodel

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.jeevan.android.R
import com.jeevan.models.BodyPart
import com.jeevan.models.DiagnosticCenter
import com.jeevan.models.DiagnosticTest
import com.jeevan.models.Symptom
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class DiagnoseViewModel : ViewModel() {
    private val _selectedBodyPart = MutableLiveData<BodyPart?>()
    val selectedBodyPart: LiveData<BodyPart?> = _selectedBodyPart

    private val _symptoms = MutableLiveData<List<Symptom>>()
    val symptoms: LiveData<List<Symptom>> = _symptoms

    private val _selectedSymptoms = MutableLiveData<Set<Symptom>>()
    val selectedSymptoms: LiveData<Set<Symptom>> = _selectedSymptoms

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    private val _diagnosisResult = MutableLiveData<String?>()
    val diagnosisResult: LiveData<String?> = _diagnosisResult

    private val _selectedTest = MutableLiveData<DiagnosticTest?>()
    val selectedTest: LiveData<DiagnosticTest?> = _selectedTest

    private val _diagnosticTests = MutableLiveData<List<DiagnosticTest>>()
    val diagnosticTests: LiveData<List<DiagnosticTest>> = _diagnosticTests

    private val _diagnosticCenters = MutableLiveData<List<DiagnosticCenter>>()
    val diagnosticCenters: LiveData<List<DiagnosticCenter>> = _diagnosticCenters

    private val _selectedCenter = MutableLiveData<DiagnosticCenter?>()
    val selectedCenter: LiveData<DiagnosticCenter?> = _selectedCenter

    // Body parts with Material icons
    val bodyParts = listOf(
        BodyPart("Head", Icons.Default.Person),
        BodyPart("Chest", Icons.Default.Favorite),
        BodyPart("Abdomen", Icons.Default.LocalHospital),
        BodyPart("Arms", Icons.Default.TouchApp),
        BodyPart("Legs", Icons.Default.DirectionsWalk),
        BodyPart("Skin", Icons.Default.Spa)
    )

    // Sample symptoms for each body part
    private val symptomsMap = mapOf(
        "Head" to listOf(
            Symptom("1", "Headache", "Pain in the head or upper neck", listOf("Stress", "Dehydration"), listOf("Rest", "Pain relievers")),
            Symptom("2", "Dizziness", "Feeling of spinning or lightheadedness", listOf("Inner ear problems", "Low blood pressure"), listOf("Rest", "Stay hydrated")),
            Symptom("3", "Fever", "Elevated body temperature", listOf("Infection", "Inflammation"), listOf("Rest", "Fever reducers"))
        ),
        "Chest" to listOf(
            Symptom("4", "Chest Pain", "Pain or discomfort in the chest area", listOf("Heart problems", "Muscle strain"), listOf("Rest", "Medical attention")),
            Symptom("5", "Shortness of Breath", "Difficulty breathing", listOf("Asthma", "Anxiety"), listOf("Rest", "Deep breathing exercises"))
        ),
        "Abdomen" to listOf(
            Symptom("6", "Stomach Pain", "Pain in the abdominal area", listOf("Indigestion", "Food poisoning"), listOf("Rest", "Light diet")),
            Symptom("7", "Nausea", "Feeling of wanting to vomit", listOf("Food poisoning", "Motion sickness"), listOf("Rest", "Stay hydrated"))
        ),
        "Arms" to listOf(
            Symptom("8", "Arm Pain", "Pain in the arms", listOf("Muscle strain", "Nerve compression"), listOf("Rest", "Ice therapy")),
            Symptom("9", "Numbness", "Loss of sensation in arms", listOf("Nerve compression", "Poor circulation"), listOf("Exercise", "Medical attention"))
        ),
        "Legs" to listOf(
            Symptom("10", "Leg Pain", "Pain in the legs", listOf("Muscle strain", "Poor circulation"), listOf("Rest", "Elevation")),
            Symptom("11", "Swelling", "Swelling in the legs", listOf("Fluid retention", "Injury"), listOf("Elevation", "Compression"))
        ),
        "Skin" to listOf(
            Symptom("12", "Rash", "Skin irritation or eruption", listOf("Allergy", "Infection"), listOf("Topical creams", "Avoid irritants")),
            Symptom("13", "Itching", "Uncomfortable sensation on skin", listOf("Dry skin", "Allergy"), listOf("Moisturize", "Antihistamines"))
        )
    )

    init {
        _selectedSymptoms.value = emptySet()
        _symptoms.value = emptyList()
        loadDiagnosticTests()
    }

    fun selectBodyPart(bodyPart: BodyPart) {
        _selectedBodyPart.value = bodyPart
        _symptoms.value = getSymptomsForBodyPart(bodyPart)
        _selectedSymptoms.value = emptySet()
    }

    fun toggleSymptom(symptom: Symptom) {
        val currentSelected = _selectedSymptoms.value ?: emptySet()
        _selectedSymptoms.value = if (symptom in currentSelected) {
            currentSelected - symptom
        } else {
            currentSelected + symptom
        }
    }

    fun getDiagnosis() {
        val selected = _selectedSymptoms.value ?: emptySet()
        if (selected.isEmpty()) {
            _error.value = "Please select at least one symptom"
            return
        }

        _isLoading.value = true
        _error.value = null

        // Simulate API call
        // In a real app, this would be an API call to a medical diagnosis service
        val diagnosis = analyzeSymptoms(selected)
        _diagnosisResult.value = diagnosis
        _isLoading.value = false
    }

    fun clearDiagnosis() {
        _diagnosisResult.value = null
    }

    private fun getSymptomsForBodyPart(bodyPart: BodyPart): List<Symptom> {
        return when (bodyPart.name) {
            "Head" -> listOf(
                Symptom(
                    id = "headache",
                    name = "Headache",
                    description = "Pain in the head or upper neck",
                    causes = listOf("Stress", "Dehydration", "Eye strain"),
                    cures = listOf("Rest", "Hydration", "Pain medication")
                ),
                Symptom(
                    id = "dizziness",
                    name = "Dizziness",
                    description = "Feeling of spinning or lightheadedness",
                    causes = listOf("Low blood pressure", "Inner ear problems"),
                    cures = listOf("Rest", "Stay hydrated", "Avoid sudden movements")
                ),
                Symptom(
                    id = "nausea_head",
                    name = "Nausea",
                    description = "Feeling of sickness with an urge to vomit",
                    causes = listOf("Motion sickness", "Food poisoning"),
                    cures = listOf("Rest", "Clear fluids", "Anti-nausea medication")
                )
            )
            "Chest" -> listOf(
                Symptom(
                    id = "chest_pain",
                    name = "Chest Pain",
                    description = "Pain or discomfort in the chest area",
                    causes = listOf("Heart conditions", "Muscle strain"),
                    cures = listOf("Seek immediate medical attention", "Rest")
                ),
                Symptom(
                    id = "shortness_breath",
                    name = "Shortness of Breath",
                    description = "Difficulty breathing or catching breath",
                    causes = listOf("Asthma", "Anxiety", "Heart conditions"),
                    cures = listOf("Seek medical attention", "Rest", "Stay calm")
                ),
                Symptom(
                    id = "cough",
                    name = "Cough",
                    description = "Sudden expulsion of air from the lungs",
                    causes = listOf("Cold", "Flu", "Allergies"),
                    cures = listOf("Rest", "Stay hydrated", "Cough medicine")
                )
            )
            "Abdomen" -> listOf(
                Symptom(
                    id = "stomach_pain",
                    name = "Stomach Pain",
                    description = "Pain or discomfort in the stomach area",
                    causes = listOf("Indigestion", "Food poisoning"),
                    cures = listOf("Rest", "Clear fluids", "Avoid spicy foods")
                ),
                Symptom(
                    id = "nausea_abdomen",
                    name = "Nausea",
                    description = "Feeling of sickness with an urge to vomit",
                    causes = listOf("Food poisoning", "Gastritis"),
                    cures = listOf("Rest", "Clear fluids", "Anti-nausea medication")
                ),
                Symptom(
                    id = "diarrhea",
                    name = "Diarrhea",
                    description = "Frequent, loose, watery bowel movements",
                    causes = listOf("Food poisoning", "Viral infection"),
                    cures = listOf("Stay hydrated", "BRAT diet", "Rest")
                )
            )
            "Arms" -> listOf(
                Symptom(
                    id = "arm_pain",
                    name = "Arm Pain",
                    description = "Pain or discomfort in the arm",
                    causes = listOf("Muscle strain", "Nerve compression"),
                    cures = listOf("Rest", "Ice/Heat therapy", "Pain medication")
                ),
                Symptom(
                    id = "numbness_arm",
                    name = "Numbness",
                    description = "Loss of sensation in the arm",
                    causes = listOf("Nerve compression", "Poor circulation"),
                    cures = listOf("Exercise", "Proper posture", "Medical attention")
                ),
                Symptom(
                    id = "weakness_arm",
                    name = "Weakness",
                    description = "Reduced strength in the arm",
                    causes = listOf("Muscle fatigue", "Nerve damage"),
                    cures = listOf("Rest", "Physical therapy", "Exercise")
                )
            )
            "Legs" -> listOf(
                Symptom(
                    id = "leg_pain",
                    name = "Leg Pain",
                    description = "Pain or discomfort in the leg",
                    causes = listOf("Muscle strain", "Poor circulation"),
                    cures = listOf("Rest", "Ice/Heat therapy", "Exercise")
                ),
                Symptom(
                    id = "swelling_leg",
                    name = "Swelling",
                    description = "Enlargement of the leg",
                    causes = listOf("Injury", "Poor circulation"),
                    cures = listOf("Elevation", "Compression", "Medical attention")
                ),
                Symptom(
                    id = "cramps",
                    name = "Cramps",
                    description = "Sudden, involuntary muscle contractions",
                    causes = listOf("Dehydration", "Mineral deficiency"),
                    cures = listOf("Stretching", "Hydration", "Mineral supplements")
                )
            )
            "Skin" -> listOf(
                Symptom(
                    id = "rash",
                    name = "Rash",
                    description = "Area of irritated or swollen skin",
                    causes = listOf("Allergies", "Infections"),
                    cures = listOf("Topical creams", "Avoid irritants", "Medical attention")
                ),
                Symptom(
                    id = "itching",
                    name = "Itching",
                    description = "Uncomfortable sensation that causes scratching",
                    causes = listOf("Dry skin", "Allergies"),
                    cures = listOf("Moisturize", "Anti-itch cream", "Avoid scratching")
                ),
                Symptom(
                    id = "blisters",
                    name = "Blisters",
                    description = "Small pockets of fluid within the skin",
                    causes = listOf("Friction", "Burns"),
                    cures = listOf("Keep clean", "Don't pop", "Medical attention")
                )
            )
            else -> emptyList()
        }
    }

    private fun analyzeSymptoms(symptoms: Set<Symptom>): String {
        // This is a simplified example. In a real app, this would use a more sophisticated
        // medical diagnosis algorithm or API
        val symptomNames = symptoms.joinToString(", ") { it.name }
        val possibleCauses = symptoms.flatMap { it.causes }.distinct()
        val recommendedCures = symptoms.flatMap { it.cures }.distinct()

        return buildString {
            appendLine("Based on your symptoms ($symptomNames):")
            appendLine()
            appendLine("Possible causes:")
            possibleCauses.forEach { appendLine("• $it") }
            appendLine()
            appendLine("Recommended actions:")
            recommendedCures.forEach { appendLine("• $it") }
            appendLine()
            appendLine("Note: This is not a substitute for professional medical advice. Please consult a healthcare professional for a proper diagnosis.")
        }
    }

    private fun loadDiagnosticTests() {
        // TODO: Replace with actual API call
        _diagnosticTests.value = listOf(
            DiagnosticTest(
                id = "1",
                name = "Complete Blood Count (CBC)",
                category = "Blood Tests",
                description = "A complete blood count (CBC) is a blood test used to evaluate your overall health and detect a wide range of disorders, including anemia, infection, and leukemia.",
                price = "₹500",
                duration = "15-20 minutes",
                preparation = "Fasting for 8-12 hours",
                commonUses = listOf(
                    "Anemia",
                    "Infection",
                    "Leukemia",
                    "Inflammation"
                )
            ),
            DiagnosticTest(
                id = "2",
                name = "Lipid Panel",
                category = "Blood Tests",
                description = "A lipid panel is a blood test that measures lipids—fats and fatty substances used as a source of energy by your body.",
                price = "₹800",
                duration = "15-20 minutes",
                preparation = "Fasting for 12-14 hours",
                commonUses = listOf(
                    "Heart Disease",
                    "High Cholesterol",
                    "Metabolic Syndrome"
                )
            ),
            DiagnosticTest(
                id = "3",
                name = "Thyroid Function Test",
                category = "Hormone Tests",
                description = "A thyroid function test is a blood test that measures how well your thyroid gland is working.",
                price = "₹1200",
                duration = "15-20 minutes",
                preparation = "No special preparation needed",
                commonUses = listOf(
                    "Hypothyroidism",
                    "Hyperthyroidism",
                    "Thyroid Disorders"
                )
            )
        )
    }

    fun selectTest(test: DiagnosticTest) {
        _selectedTest.value = test
    }

    fun findCentersForTest(test: DiagnosticTest) {
        _isLoading.value = true
        // TODO: Replace with actual API call
        _diagnosticCenters.value = listOf(
            DiagnosticCenter(
                id = "1",
                name = "City Diagnostic Center",
                address = "123 Main Street, City Center",
                distance = "2.5 km",
                latitude = 12.9716,
                longitude = 77.5946,
                phone = "+91 1234567890",
                email = "info@citydiagnostic.com",
                website = "www.citydiagnostic.com",
                availableTests = listOf("1", "2", "3")
            ),
            DiagnosticCenter(
                id = "2",
                name = "Metro Health Labs",
                address = "456 Park Avenue, Metro City",
                distance = "3.8 km",
                latitude = 12.9784,
                longitude = 77.6408,
                phone = "+91 9876543210",
                email = "contact@metrohealth.com",
                website = "www.metrohealth.com",
                availableTests = listOf("1", "2")
            )
        )
        _isLoading.value = false
    }

    fun selectCenter(center: DiagnosticCenter) {
        _selectedCenter.value = center
    }
} 