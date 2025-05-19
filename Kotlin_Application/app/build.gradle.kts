plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    alias(libs.plugins.compose.compiler)
}

android {
    namespace = "com.jeevan.android"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.jeevan.android"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

        // Add BuildConfig fields from local.properties
        buildConfigField("String", "MAPS_API_KEY", "\"${project.findProperty("MAPS_API_KEY") ?: ""}\"")
        buildConfigField("String", "API_BASE_URL", "\"${project.findProperty("API_BASE_URL") ?: ""}\"")
        buildConfigField("String", "JWT_SECRET", "\"${project.findProperty("JWT_SECRET") ?: ""}\"")
        buildConfigField("String", "WEBSOCKET_URL", "\"${project.findProperty("WEBSOCKET_URL") ?: ""}\"")
        buildConfigField("Boolean", "ENABLE_ANALYTICS", "${project.findProperty("ENABLE_ANALYTICS") ?: false}")
        buildConfigField("Boolean", "ENABLE_NOTIFICATIONS", "${project.findProperty("ENABLE_NOTIFICATIONS") ?: true}")
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        compose = true
        buildConfig = true  // Enable BuildConfig generation
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.1"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    // Core Android dependencies
    implementation(libs.androidx.core.ktx.v1120)
    implementation(libs.androidx.lifecycle.runtime.ktx.v270)
    implementation(libs.androidx.activity.compose.v182)

    // Compose dependencies
    implementation(platform(libs.androidx.compose.bom.v20240200))
    implementation(libs.ui)
    implementation(libs.ui.graphics)
    implementation(libs.ui.tooling.preview)
    implementation(libs.material3)
    
    // Material Icons Extended - needed for Visibility and VisibilityOff icons
    implementation("androidx.compose.material:material-icons-extended")
    
    // Navigation and ViewModel
    implementation(libs.androidx.navigation.compose)
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.9.0")
    implementation(libs.runtime.livedata)

    // Maps dependencies
    implementation(libs.play.services.maps)
    implementation(libs.maps.compose)
    
    // Location dependencies
    implementation("com.google.android.gms:play-services-location:21.1.0")

    // Network dependencies
    implementation(libs.retrofit)
    implementation(libs.converter.gson)
    implementation(libs.logging.interceptor)

    // WebSocket dependencies
    implementation(libs.java.websocket)

    // Testing dependencies
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit.v115)
    androidTestImplementation(libs.androidx.espresso.core.v351)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.ui.test.junit4)
    debugImplementation(libs.ui.tooling)
    debugImplementation(libs.ui.test.manifest)
}