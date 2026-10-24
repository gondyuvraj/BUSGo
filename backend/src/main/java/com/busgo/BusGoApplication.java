package com.busgo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.h2.H2ConsoleAutoConfiguration;

@SpringBootApplication(exclude = { H2ConsoleAutoConfiguration.class })
public class BusGoApplication {

    public static void main(String[] args) {
        SpringApplication.run(BusGoApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 BusGo Backend API Server Started Successfully!");
        System.out.println("🔗 Port: 8080 | Health: http://localhost:8080/api/health");
        System.out.println("=================================================");
    }
}
