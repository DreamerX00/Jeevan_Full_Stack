package com.jeevan.models

data class DiagnosticTest(
    val id: String,
    val name: String,
    val category: String,
    val description: String,
    val price: String,
    val duration: String,
    val preparation: String,
    val commonUses: List<String>
) 