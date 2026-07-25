package com.tranvodev.book_client_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class GatewaySecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            // 1. Activate JWT validation at the gateway level
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(Customizer.withDefaults())
            )
            // 2. Define your "Smart" forwarding rules
            .authorizeExchange(exchanges -> exchanges
                .anyExchange().authenticated()
            )
            // 3. Unauthenticated browser requests get redirected to the authorization server
            .oauth2Login(Customizer.withDefaults());
        return http.build();
    }

}