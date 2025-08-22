package com.jeevan.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.jeevan.models.Disease
import com.jeevan.models.Symptom
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class SymptomCheckerViewModel : ViewModel() {
    // All available symptoms
    private val _symptoms = MutableLiveData<List<Symptom>>()
    val symptoms: LiveData<List<Symptom>> = _symptoms

    // Filtered symptoms based on search
    private val _filteredSymptoms = MutableLiveData<List<Symptom>>()
    val filteredSymptoms: LiveData<List<Symptom>> = _filteredSymptoms

    // Selected symptoms
    private val _selectedSymptoms = MutableLiveData<List<Symptom>>(emptyList())
    val selectedSymptoms: LiveData<List<Symptom>> = _selectedSymptoms

    // Predicted diseases based on selected symptoms
    private val _predictedDiseases = MutableLiveData<List<Disease>>(emptyList())
    val predictedDiseases: LiveData<List<Disease>> = _predictedDiseases

    // Search query
    private val _searchQuery = MutableLiveData<String>("")
    val searchQuery: LiveData<String> = _searchQuery

    // Loading state
    private val _isLoading = MutableLiveData<Boolean>(false)
    val isLoading: LiveData<Boolean> = _isLoading

    // Error state
    private val _error = MutableLiveData<String?>(null)
    val error: LiveData<String?> = _error

    init {
        loadSymptoms()
    }

    private fun loadSymptoms() {
        // In a real app, this would come from an API or database
        // For now, we'll use mock data
        val mockSymptoms = listOf(
            Symptom(
                id = "1",
                name = "Headache",
                description = "Pain in any region of the head. Headaches may occur on one or both sides of the head, be isolated to a certain location, radiate across the head from one point, or have a viselike quality.",
                causes = listOf(
                    "Stress and tension",
                    "Dehydration",
                    "Lack of sleep",
                    "Eye strain",
                    "Sinus congestion"
                ),
                cures = listOf(
                    "Over-the-counter pain relievers like acetaminophen or ibuprofen",
                    "Rest in a quiet, dark room",
                    "Hot or cold compress to the head",
                    "Hydration",
                    "Massage of the temples or neck"
                )
            ),
            Symptom(
                id = "2",
                name = "Fever",
                description = "A temporary increase in body temperature, often due to an illness. Having a fever is a sign that something out of the ordinary is going on in your body.",
                causes = listOf(
                    "Viral infections",
                    "Bacterial infections",
                    "Heat exhaustion",
                    "Inflammatory conditions",
                    "Certain medications"
                ),
                cures = listOf(
                    "Rest and fluids",
                    "Over-the-counter fever reducers like acetaminophen or ibuprofen",
                    "Cool, damp cloths on the forehead",
                    "Lukewarm baths",
                    "Light clothing and reduced room temperature"
                )
            ),
            Symptom(
                id = "3",
                name = "Cough",
                description = "A sudden, often repetitive, spasmodic contraction of the thoracic cavity, resulting in violent release of air from the lungs, and usually accompanied by a distinctive sound.",
                causes = listOf(
                    "Common cold or flu",
                    "Allergies",
                    "Asthma",
                    "Smoking",
                    "Postnasal drip"
                ),
                cures = listOf(
                    "Staying hydrated",
                    "Honey and warm water",
                    "Cough drops or lozenges",
                    "Humidifier",
                    "Over-the-counter cough suppressants"
                )
            ),
            Symptom(
                id = "4",
                name = "Sore Throat",
                description = "Pain, scratchiness or irritation of the throat that often worsens when you swallow. The most common cause of a sore throat is a viral infection, such as a cold or the flu.",
                causes = listOf(
                    "Viral infections like cold or flu",
                    "Bacterial infections like strep throat",
                    "Allergies",
                    "Dry air",
                    "Irritants like smoking or air pollution"
                ),
                cures = listOf(
                    "Gargling with warm salt water",
                    "Drinking warm liquids",
                    "Throat lozenges",
                    "Over-the-counter pain relievers",
                    "Humidifier to add moisture to the air"
                )
            ),
            Symptom(
                id = "5",
                name = "Fatigue",
                description = "Extreme tiredness resulting from mental or physical exertion or illness. It's a common symptom of many medical conditions that range in severity from mild to serious.",
                causes = listOf(
                    "Lack of sleep",
                    "Poor diet",
                    "Stress",
                    "Medical conditions like anemia or thyroid problems",
                    "Depression or anxiety"
                ),
                cures = listOf(
                    "Getting adequate sleep",
                    "Balanced diet",
                    "Regular exercise",
                    "Stress management techniques",
                    "Treating underlying medical conditions"
                )
            ),
            Symptom(
                id = "6",
                name = "Nausea",
                description = "A feeling of sickness with an inclination to vomit. Nausea has many causes including motion sickness, pregnancy, emotional stress, gallbladder disease, and other illnesses.",
                causes = listOf(
                    "Motion sickness",
                    "Food poisoning",
                    "Pregnancy",
                    "Migraine",
                    "Medication side effects"
                ),
                cures = listOf(
                    "Ginger tea or supplements",
                    "Small, frequent meals",
                    "Avoiding strong odors",
                    "Anti-nausea medications",
                    "Acupressure wristbands"
                )
            ),
            Symptom(
                id = "7",
                name = "Stomach Pain",
                description = "Pain or discomfort that occurs in the abdomen, between the bottom of the ribs and the groin. Stomach pain can be caused by many conditions.",
                causes = listOf(
                    "Indigestion",
                    "Gas",
                    "Food allergies or intolerances",
                    "Stomach virus",
                    "Ulcers"
                ),
                cures = listOf(
                    "Over-the-counter antacids",
                    "Avoiding trigger foods",
                    "Heating pad on the abdomen",
                    "Hydration",
                    "Bland diet until symptoms improve"
                )
            ),
            Symptom(
                id = "8",
                name = "Dizziness",
                description = "A term used to describe a range of sensations, such as feeling faint, woozy, weak or unsteady. Dizziness that creates the false sense that you or your surroundings are spinning or moving is called vertigo.",
                causes = listOf(
                    "Inner ear problems",
                    "Low blood pressure",
                    "Dehydration",
                    "Anemia",
                    "Medication side effects"
                ),
                cures = listOf(
                    "Sitting or lying down immediately",
                    "Hydration",
                    "Avoiding sudden movements",
                    "Treating underlying conditions",
                    "Vestibular rehabilitation exercises"
                )
            ),
            Symptom(
                id = "9",
                name = "Shortness of Breath",
                description = "A tight feeling in the chest, the need to breathe more quickly or more deeply, or the feeling that you're not getting enough air. It can be a symptom of many different conditions.",
                causes = listOf(
                    "Asthma",
                    "Anxiety",
                    "Physical exertion",
                    "Allergic reactions",
                    "Heart or lung conditions"
                ),
                cures = listOf(
                    "Breathing exercises",
                    "Inhalers for asthma",
                    "Avoiding triggers",
                    "Anxiety management techniques",
                    "Treating underlying conditions"
                )
            ),
            Symptom(
                id = "10",
                name = "Rash",
                description = "A change of the skin which affects its color, appearance, or texture. A rash may be localized to one part of the body, or affect all the skin.",
                causes = listOf(
                    "Allergic reactions",
                    "Infections",
                    "Heat",
                    "Medications",
                    "Autoimmune disorders"
                ),
                cures = listOf(
                    "Avoiding triggers",
                    "Topical corticosteroids",
                    "Antihistamines",
                    "Cool compresses",
                    "Oatmeal baths"
                )
            )
        )

        _symptoms.value = mockSymptoms
        _filteredSymptoms.value = mockSymptoms
    }

    // Mock disease data
    private val mockDiseases = listOf(
        Disease(
            id = "1",
            name = "Common Cold",
            description = "A viral infectious disease of the upper respiratory tract that primarily affects the nose. Signs and symptoms may appear less than two days after exposure to the virus.",
            cures = listOf(
                "Rest and adequate fluid intake",
                "Over-the-counter pain relievers",
                "Decongestants",
                "Throat lozenges",
                "Humidifier to add moisture to the air"
            ),
            relatedSymptoms = listOf("Cough", "Sore Throat", "Fever", "Headache")
        ),
        Disease(
            id = "2",
            name = "Influenza (Flu)",
            description = "A contagious respiratory illness caused by influenza viruses. It can cause mild to severe illness, and at times can lead to death.",
            cures = listOf(
                "Rest and staying hydrated",
                "Antiviral medications if prescribed early",
                "Over-the-counter pain relievers",
                "Avoiding contact with others",
                "Annual flu vaccination for prevention"
            ),
            relatedSymptoms = listOf("Fever", "Cough", "Fatigue", "Headache", "Sore Throat")
        ),
        Disease(
            id = "3",
            name = "Migraine",
            description = "A primary headache disorder characterized by recurrent headaches that are moderate to severe. Typically, the headaches affect one half of the head, are pulsating in nature, and last from 2 to 72 hours.",
            cures = listOf(
                "Rest in a quiet, dark room",
                "Prescription migraine medications",
                "Over-the-counter pain relievers",
                "Cold compresses",
                "Preventive medications for chronic migraines"
            ),
            relatedSymptoms = listOf("Headache", "Nausea", "Dizziness")
        ),
        Disease(
            id = "4",
            name = "Gastroenteritis",
            description = "An intestinal infection marked by diarrhea, abdominal cramps, nausea or vomiting, and sometimes fever. The most common way to develop viral gastroenteritis is through contact with an infected person or by consuming contaminated food or water.",
            cures = listOf(
                "Hydration with water, clear broths, and electrolyte solutions",
                "Gradual reintroduction of bland foods",
                "Rest",
                "Avoiding dairy, caffeine, and fatty foods",
                "Over-the-counter anti-diarrheal medications (if not contraindicated)"
            ),
            relatedSymptoms = listOf("Nausea", "Stomach Pain", "Fever")
        ),
        Disease(
            id = "5",
            name = "Allergic Reaction",
            description = "An exaggerated immune response to substances (allergens) that are generally not harmful. Allergic reactions can range from mild to severe, and in some cases, can be life-threatening.",
            cures = listOf(
                "Avoiding known allergens",
                "Antihistamines",
                "Topical corticosteroids for skin reactions",
                "Epinephrine auto-injector for severe reactions",
                "Allergy immunotherapy for long-term management"
            ),
            relatedSymptoms = listOf("Rash", "Shortness of Breath", "Cough")
        ),
        Disease(
            id = "6",
            name = "Anxiety Disorder",
            description = "A mental health disorder characterized by feelings of worry, anxiety, or fear that are strong enough to interfere with one's daily activities.",
            cures = listOf(
                "Cognitive-behavioral therapy",
                "Relaxation techniques and mindfulness",
                "Regular exercise",
                "Adequate sleep",
                "Medications such as antidepressants or anti-anxiety drugs if prescribed"
            ),
            relatedSymptoms = listOf("Shortness of Breath", "Dizziness", "Fatigue", "Headache")
        )
    )

    fun updateSearchQuery(query: String) {
        _searchQuery.value = query
        filterSymptoms(query)
    }

    private fun filterSymptoms(query: String) {
        if (query.isBlank()) {
            _filteredSymptoms.value = _symptoms.value
            return
        }

        _symptoms.value?.let { symptomsList ->
            _filteredSymptoms.value = symptomsList.filter {
                it.name.contains(query, ignoreCase = true) ||
                it.description.contains(query, ignoreCase = true)
            }
        }
    }

    fun toggleSymptomSelection(symptomId: String) {
        val currentSymptoms = _symptoms.value?.toMutableList() ?: mutableListOf()
        val currentSelectedSymptoms = _selectedSymptoms.value?.toMutableList() ?: mutableListOf()

        // Find the symptom in the list
        val symptomIndex = currentSymptoms.indexOfFirst { it.id == symptomId }
        if (symptomIndex != -1) {
            val symptom = currentSymptoms[symptomIndex]
            val updatedSymptom = symptom.copy(isSelected = !symptom.isSelected)
            currentSymptoms[symptomIndex] = updatedSymptom

            // Update selected symptoms list
            if (updatedSymptom.isSelected) {
                currentSelectedSymptoms.add(updatedSymptom)
            } else {
                currentSelectedSymptoms.removeAll { it.id == symptomId }
            }

            _symptoms.value = currentSymptoms
            _selectedSymptoms.value = currentSelectedSymptoms
            filterSymptoms(_searchQuery.value ?: "")

            // Update disease predictions
            updateDiseasePredictions()
        }
    }

    fun clearAllSymptoms() {
        val currentSymptoms = _symptoms.value?.map { it.copy(isSelected = false) } ?: emptyList()
        _symptoms.value = currentSymptoms
        _selectedSymptoms.value = emptyList()
        _predictedDiseases.value = emptyList()
        filterSymptoms(_searchQuery.value ?: "")
    }

    private fun updateDiseasePredictions() {
        val selectedSymptoms = _selectedSymptoms.value ?: emptyList()
        
        // Only predict diseases if at least 2 symptoms are selected
        if (selectedSymptoms.size < 2) {
            _predictedDiseases.value = emptyList()
            return
        }

        // Simulate API call with loading state
        _isLoading.value = true
        viewModelScope.launch {
            try {
                // Simulate network delay
                delay(1000)
                
                val selectedSymptomNames = selectedSymptoms.map { it.name }
                
                // Filter diseases that match at least 2 of the selected symptoms
                val predictions = mockDiseases.filter { disease ->
                    val matchingSymptoms = disease.relatedSymptoms.filter { it in selectedSymptomNames }
                    matchingSymptoms.size >= 2
                }
                
                _predictedDiseases.value = predictions
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to predict diseases: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }
}