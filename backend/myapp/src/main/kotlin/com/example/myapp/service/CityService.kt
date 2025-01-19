package com.example.myapp.service

import com.example.myapp.model.City
import org.springframework.stereotype.Service

@Service
class CityService {

    // Simple in-memory storage for cities
    private val cities = mutableListOf<City>(
        City(1, "New York"),
        City(2, "Los Angeles"),
        City(3, "Chicago")
    )

    fun getCityById(id: Long): City? {
        return cities.find { it.id == id }
    }

    fun getAllCities(): List<City> {
        return cities
    }

    fun addCity(city: City): City {
        cities.add(city)
        return city
    }

    fun updateCity(id: Long, updatedCity: City): City? {
        val index = cities.indexOfFirst { it.id == id }
        if (index != -1) {
            cities[index] = updatedCity
            return updatedCity
        }
        return null
    }

    fun deleteCity(id: Long): Boolean {
        return cities.removeIf { it.id == id }
    }
}
