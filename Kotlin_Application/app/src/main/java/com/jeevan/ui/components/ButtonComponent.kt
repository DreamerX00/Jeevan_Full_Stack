package com.jeevan.ui.components

import androidx.compose.animation.animateColor
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.keyframes
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun MedicalThemeColorChangingButton(text: String, onClick: () -> Unit) {
    val infiniteTransition = rememberInfiniteTransition()
    val colors = listOf(
        Color(0xFF4CAF50), // Medical green
        Color(0xFF2196F3), // Medical blue
        Color(0xFF00BCD4), // Cyan
        Color(0xFF8BC34A), // Light green
        Color(0xFFFFC107)  // Amber
    )

    val animatedColor by infiniteTransition.animateColor(
        initialValue = colors.first(),
        targetValue = colors.last(),
        animationSpec = infiniteRepeatable(
            animation = keyframes {
                durationMillis = 5000
                colors.forEachIndexed { index, color ->
                    color at (index * 1000) with LinearEasing
                }
            },
            repeatMode = RepeatMode.Reverse
        )
    )

    Button(
        onClick = onClick,
        colors = ButtonDefaults.buttonColors(containerColor = animatedColor),
        modifier = Modifier
            .padding(16.dp)
            .fillMaxWidth()
            .height(60.dp)
    ) {
        Text(text = text, color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
    }
}