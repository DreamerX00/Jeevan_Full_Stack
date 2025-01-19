package com.jeevan.myapp

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class JeevanApplication

fun main(args: Array<String>) {
	runApplication<JeevanApplication>(*args)
}
