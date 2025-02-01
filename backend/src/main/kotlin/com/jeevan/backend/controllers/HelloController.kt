package com.jeevan.backend.controllers

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class HelloController {
    @PostMapping("/greet")
    fun greetUser(@RequestBody request: Map<String, String>): String {
        val name = request["name"] ?: "Guest"
        return "Hello, $name! Welcome to Jeevan Backend."
    }
}
//@RestController
//@RequestMapping("/api")
//class HelloController {
//    @GetMapping("/hello")
//    fun helloWorld(): String {
//        return "Hello from Jeevan Backend!"
//    }
//}

