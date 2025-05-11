package com.example.jeevanandroid.ui.components

import androidx.compose.animation.core.FastOutLinearInEasing
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.LinearOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.sin

@Composable
fun HeartbeatLoadingIndicator(
    modifier: Modifier = Modifier,
    color: Color = MaterialTheme.colorScheme.primary,
    message: String? = null
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        val infiniteTransition = rememberInfiniteTransition(label = "heartbeat")
        
        // Heartbeat scale animation
        val scale by infiniteTransition.animateFloat(
            initialValue = 1f,
            targetValue = 1.2f,
            animationSpec = infiniteRepeatable(
                animation = tween(500, easing = FastOutSlowInEasing),
                repeatMode = RepeatMode.Reverse
            ),
            label = "scale"
        )

        // ECG line animation
        val position by infiniteTransition.animateFloat(
            initialValue = 0f,
            targetValue = 1f,
            animationSpec = infiniteRepeatable(
                animation = tween(1500, easing = LinearEasing)
            ),
            label = "position"
        )

        Box(
            modifier = Modifier
                .size(200.dp)
                .scale(scale),
            contentAlignment = Alignment.Center
        ) {
            // ECG Line
            Canvas(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                val width = size.width
                val height = size.height
                val path = Path()
                
                // Create ECG wave pattern
                path.moveTo(0f, height * 0.5f)
                
                for (x in 0..size.width.toInt()) {
                    val progress = (x + position * width) / width
                    val wave = sin(progress * 2 * Math.PI) * 0.1
                    val y = height * 0.5f + (wave * height).toFloat()
                    
                    if (x == 0) {
                        path.moveTo(x.toFloat(), y)
                    } else {
                        path.lineTo(x.toFloat(), y)
                    }
                }

                // Draw the ECG line
                drawPath(
                    path = path,
                    color = color,
                    style = Stroke(
                        width = 4.dp.toPx(),
                        cap = StrokeCap.Round
                    )
                )

                // Draw the pulse dot
                drawCircle(
                    color = color,
                    radius = 8.dp.toPx(),
                    center = Offset(width * position,
                        (height * 0.5f + (sin(position * 2 * Math.PI) * 0.1f * height)).toFloat()
                    )
                )
            }
        }

        // Loading text with fade animation
        message?.let { text ->
            val textAlpha by infiniteTransition.animateFloat(
                initialValue = 0.4f,
                targetValue = 1f,
                animationSpec = infiniteRepeatable(
                    animation = tween(500),
                    repeatMode = RepeatMode.Reverse
                ),
                label = "textAlpha"
            )

            Text(
                text = text,
                color = color.copy(alpha = textAlpha),
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                modifier = Modifier.padding(top = 16.dp)
            )
        }
    }
}

@Composable
fun PulseLoadingIndicator(
    modifier: Modifier = Modifier,
    color: Color = MaterialTheme.colorScheme.primary,
    message: String? = null
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        val infiniteTransition = rememberInfiniteTransition(label = "pulse")
        
        val pulseScale by infiniteTransition.animateFloat(
            initialValue = 0f,
            targetValue = 2f,
            animationSpec = infiniteRepeatable(
                animation = tween(2000, easing = FastOutLinearInEasing),
                repeatMode = RepeatMode.Restart
            ),
            label = "pulseScale"
        )

        val pulseAlpha by infiniteTransition.animateFloat(
            initialValue = 0.7f,
            targetValue = 0f,
            animationSpec = infiniteRepeatable(
                animation = tween(5000, easing = LinearOutSlowInEasing),
                repeatMode = RepeatMode.Reverse
            ),
            label = "pulseAlpha"
        )

        Box(
            modifier = Modifier.size(100.dp),
            contentAlignment = Alignment.Center
        ) {
            // Pulsing circles
            Canvas(modifier = Modifier.fillMaxSize()) {
                drawCircle(
                    color = color.copy(alpha = pulseAlpha),
                    radius = (size.minDimension / 2) * pulseScale,
                    style = Stroke(width = 4.dp.toPx())
                )
            }
            
            // Center dot
            Canvas(modifier = Modifier.size(20.dp)) {
                drawCircle(
                    color = color,
                    radius = size.minDimension / 2
                )
            }
        }

        // Loading text
        message?.let { text ->
            val textAlpha by infiniteTransition.animateFloat(
                initialValue = 0.4f,
                targetValue = 1f,
                animationSpec = infiniteRepeatable(
                    animation = tween(500),
                    repeatMode = RepeatMode.Reverse
                ),
                label = "textAlpha"
            )

            Text(
                text = text,
                color = color.copy(alpha = textAlpha),
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                modifier = Modifier.padding(top = 16.dp)
            )
        }
    }
}