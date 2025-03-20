package com.example.jeevanandroid.network

import retrofit2.http.GET
import com.example.jeevanandroid.utils.PrefsManager

interface DashboardApi {
    @GET("api/dashboard/info")
    suspend fun getDashboardInfo(): DashboardResponse

    companion object {
        private var retrofitService: DashboardApi? = null

        fun getInstance(prefsManager: PrefsManager): DashboardApi {
            if (retrofitService == null) {
                retrofitService = RetrofitClient.createAuthenticatedClient(prefsManager)
                    .create(DashboardApi::class.java)
            }
            return retrofitService!!
        }
    }
}

data class DashboardResponse(
    val email: String?,
    val greeting: String?,
    val lastLogin: String?,
    val quickStats: QuickStats?
)

data class QuickStats(
    val notifications: Int,
    val pendingAppointments: Int,
    val medicalAlerts: Int
) 