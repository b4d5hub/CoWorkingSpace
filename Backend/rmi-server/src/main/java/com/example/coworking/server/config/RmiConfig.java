package com.example.coworking.server.config;

import com.example.coworking.common.SalleService;
import com.example.coworking.server.service.SalleServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.remoting.rmi.RmiServiceExporter;


@Configuration
public class RmiConfig {
    @Bean
    public RmiServiceExporter exporter(SalleServiceImpl service) {
        RmiServiceExporter exporter = new RmiServiceExporter();
        exporter.setServiceName("SalleService");
        exporter.setServiceInterface(SalleService.class);
        exporter.setService(service);
        exporter.setRegistryPort(1099);
        return exporter;
    }
}
