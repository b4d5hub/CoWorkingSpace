package com.example.coworking.rest.config;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Hardening layer to ensure CORS headers are always present and
 * preflight (OPTIONS) requests are answered with 200.
 * This complements Spring's CorsFilter and WebMvcConfigurer mappings.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class AlwaysAllowCorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        // Reflect origin if present, otherwise wildcard. For dev simplicity, use wildcard.
        String origin = request.getHeader("Origin");
        response.setHeader("Access-Control-Allow-Origin", origin != null ? origin : "*");
        response.setHeader("Vary", "Origin");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", request.getHeader("Access-Control-Request-Headers") != null
                ? request.getHeader("Access-Control-Request-Headers")
                : "Origin, Content-Type, Accept, Authorization");
        response.setHeader("Access-Control-Max-Age", "3600");
        // Do NOT set Access-Control-Allow-Credentials with wildcard origin

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return; // short-circuit preflight
        }

        chain.doFilter(req, res);
    }
}
