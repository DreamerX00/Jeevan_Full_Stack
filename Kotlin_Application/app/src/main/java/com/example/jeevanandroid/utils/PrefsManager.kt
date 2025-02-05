package com.example.jeevanandroid.utils

import android.content.Context
import android.content.SharedPreferences

class PrefsManager(context: Context) {
    private val sharedPreferences: SharedPreferences = context.getSharedPreferences("jeevan_prefs", Context.MODE_PRIVATE)

    fun saveToken(token: String) {
        sharedPreferences.edit().putString("jwt_token", token).apply()
    }

    fun getToken(): String? {
        return sharedPreferences.getString("jwt_token", null)
    }
}
