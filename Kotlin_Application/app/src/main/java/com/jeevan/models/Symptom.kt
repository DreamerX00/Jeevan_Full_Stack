package com.jeevan.models

data class Symptom(
    val id: String,
    val name: String,
    val description: String,
    val causes: List<String> = emptyList(),
    val cures: List<String> = emptyList(),
    var isSelected: Boolean = false
)

data class Disease(
    val id: String,
    val name: String,
    val description: String,
    val cures: List<String>,
    val relatedSymptoms: List<String>
)