package com.example.coworking.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.rmi.registry.LocateRegistry;

@SpringBootApplication
public class RmiServerApplication {
    public static void main(String[] args) throws Exception {
        // Démarre le registry RMI
        LocateRegistry.createRegistry(1099);
        SpringApplication.run(RmiServerApplication.class, args);
    }
}
