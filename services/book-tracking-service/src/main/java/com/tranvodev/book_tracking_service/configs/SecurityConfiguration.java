package com.tranvodev.book_tracking_service.configs;

import java.util.List;
import org.apache.commons.lang3.Strings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimNames;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwtSetUri;

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issueUri;

    @Value("${spring.security.oauth2.client.provider.google.client-id}")
    private String clientId;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        return http.authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/swagger-ui/**")
                        .permitAll()
                        .requestMatchers("/v3/api-docs*/**")
                        .permitAll()
                        .requestMatchers("/**")
                        .authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(googleJwtDecoder())))
                .build();
    }

    @Bean
    public JwtDecoder googleJwtDecoder() {
        // Direct Spring to Google's public key endpoint
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri(jwtSetUri).build();

        // Custom validation to handle Google's dual-issuer anomaly
        OAuth2TokenValidator<Jwt> audienceValidator =
                new JwtClaimValidator<List<String>>(JwtClaimNames.AUD, aud -> aud != null && aud.contains(clientId));

        OAuth2TokenValidator<Jwt> issuerValidator = new DelegatingOAuth2TokenValidator<>(
                new JwtClaimValidator<String>(JwtClaimNames.ISS, iss -> Strings.CS.equals(iss, issueUri)));

        // Combine standard timestamp validation with our custom rules
        OAuth2TokenValidator<Jwt> combinedValidator =
                new DelegatingOAuth2TokenValidator<>(new JwtTimestampValidator(), audienceValidator, issuerValidator);

        jwtDecoder.setJwtValidator(combinedValidator);
        return jwtDecoder;
    }
}
