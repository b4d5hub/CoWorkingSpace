package com.example.coworking.rest.config;

import com.example.coworking.common.SalleService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.remoting.rmi.RmiProxyFactoryBean;

@Configuration
public class RmiClientConfig {

    @Value("${rmi.host:localhost}")
    private String rmiHost;

    @Value("${rmi.port:1099}")
    private int rmiPort;

    @Value("${rmi.salleServiceName:SalleService}")
    private String salleServiceName;

    @Bean
    public RmiProxyFactoryBean salleService() {
        RmiProxyFactoryBean proxy = new RmiProxyFactoryBean();
        proxy.setServiceInterface(SalleService.class);
        proxy.setServiceUrl(String.format("rmi://%s:%d/%s", rmiHost, rmiPort, salleServiceName));
        // Defer lookup so the REST app can start even if RMI registry/server is down at startup
        proxy.setLookupStubOnStartup(false);
        // Attempt to refresh the stub on failure at call time
        proxy.setRefreshStubOnConnectFailure(true);
        // Cache the stub between successful lookups
        proxy.setCacheStub(true);
        return proxy;
    }
}
