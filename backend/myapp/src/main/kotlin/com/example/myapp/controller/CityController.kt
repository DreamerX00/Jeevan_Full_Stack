package com.example.myapp.controller

import com.example.myapp.model.City
import com.example.myapp.service.CityService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/cities")
class CityController(private val cityService: CityService) {

    @GetMapping
    fun getAllCities(): List<City> {
        return cityService.getAllCities()
    }

    @GetMapping("/{id}")
    fun getCity(@PathVariable id: Long): City? {
        return cityService.getCityById(id)
    }

    @PostMapping
    fun addCity(@RequestBody city: City): City {
        return cityService.addCity(city)
    }

    @PutMapping("/{id}")
    fun updateCity(@PathVariable id: Long, @RequestBody updatedCity: City): City? {
        return cityService.updateCity(id, updatedCity)
    }

    @DeleteMapping("/{id}")
    fun deleteCity(@PathVariable id: Long): Boolean {
        return cityService.deleteCity(id)
    }
}
