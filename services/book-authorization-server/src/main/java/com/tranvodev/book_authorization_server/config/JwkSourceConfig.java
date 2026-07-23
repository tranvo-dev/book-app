package com.tranvodev.book_authorization_server.config;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;

import java.io.InputStream;
import java.security.*;
import java.security.cert.Certificate;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.UUID;

@Configuration
public class JwkSourceConfig {
    @Bean
    @Profile("local")
    public JWKSource<SecurityContext> localJwkSource() {
        KeyPair keyPair = generateRsaKey();
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();

        RSAKey rsaKey = new RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .keyID(UUID.randomUUID().toString()) // Random ID per restart
                .build();

        return (jwkSelector, securityContext) -> jwkSelector.select(new JWKSet(rsaKey));
    }

    private static KeyPair generateRsaKey() {
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            return keyPairGenerator.generateKeyPair();
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to generate dev RSA keys", ex);
        }
    }

    // TODO: need to be verified
    @Configuration
    @Profile("prod")
    public static class ProdJwkConfig {

        @Value("${app.security.keystore.location}")
        private Resource keyStoreLocation;

        @Value("${app.security.keystore.password}")
        private String keyStorePassword;

        @Value("${app.security.keystore.alias}")
        private String keyAlias;

        @Bean
        public JWKSource<SecurityContext> prodJwkSource() {
            try {
                // Initialize a PKCS12 Keystore instance
                KeyStore keyStore = KeyStore.getInstance("PKCS12");

                // Read the keystore file binary stream
                try (InputStream inputStream = keyStoreLocation.getInputStream()) {
                    keyStore.load(inputStream, keyStorePassword.toCharArray());
                }

                // Extract Private and Public Keys using alias credentials
                PrivateKey privateKey = (PrivateKey) keyStore.getKey(keyAlias, keyStorePassword.toCharArray());
                Certificate certificate = keyStore.getCertificate(keyAlias);
                PublicKey publicKey = certificate.getPublicKey();

                // Build a deterministic RSA JWK using the fixed alias as the Key ID
                RSAKey rsaKey = new RSAKey.Builder((RSAPublicKey) publicKey)
                        .privateKey((RSAPrivateKey) privateKey)
                        .keyID(keyAlias) // Fixed Key ID ensures caching consistency across server restarts
                        .build();

                return (jwkSelector, securityContext) -> jwkSelector.select(new JWKSet(rsaKey));

            } catch (Exception ex) {
                throw new IllegalStateException("Critical error loading production KeyStore keys", ex);
            }
        }
    }
}
