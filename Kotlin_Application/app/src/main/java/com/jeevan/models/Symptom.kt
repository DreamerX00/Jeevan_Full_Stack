package com.jeevan.models

data class Symptom(
    val id: String,
    val name: String,
    val description: String,
    val causes: List<String>,
    val cures: List<String>,
    val isSelected: Boolean = false
)

data class Disease(
    val id: String,
    val name: String,
    val description: String,
    val cures: List<String>,
    val relatedSymptoms: List<String>
)