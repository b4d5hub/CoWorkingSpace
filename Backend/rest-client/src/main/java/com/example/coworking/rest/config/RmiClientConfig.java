package com.example.coworking.rest.config;

import com.example.coworking.common.SalleService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.remoting.rmi.RmiProxyFactoryBean;

@Configuration
public class RmiClientConfig {
    @Bean
    public RmiProxyFactoryBean salleService() {
        RmiProxyFactoryBean proxy = new RmiProxyFactoryBean();
        proxy.setServiceInterface(SalleService.class);
        proxy.setServiceUrl("rmi://localhost:1099/SalleService");
        return proxy;
    }
}
