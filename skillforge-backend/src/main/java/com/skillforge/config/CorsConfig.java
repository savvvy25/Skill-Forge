package com.skillforge.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    // FIX #3 — CORS ISSUE: CORS_ORIGINS may contain spaces after commas
    // ("http://a, http://b"). Split on ",\\s*" not just "," to strip them.
    // Also: in production you can pass a comma-separated list from Render's
    // env var panel and it will be split correctly.
    @Value("${app.cors.origins}")
    private String corsOrigins;

    /**
     * MVC-level CORS configuration for non-security-filtered requests.
     */
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns(getAllowedOrigins())  // FIX: use allowedOriginPatterns so
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Vercel preview *.vercel.app works
                .allowedHeaders("Authorization", "Content-Type", "Accept")
                .exposedHeaders("Authorization")
                .allowCredentials(true)
                .maxAge(3600);
    }

    /**
     * Spring Security-level CORS configuration source.
     * This is critical for production: without it, Spring Security blocks
     * preflight OPTIONS requests before they reach the MVC CORS handler.
     *
     * FIX #4 — SECURITY CORS BUG: The original used setAllowedOrigins() which
     * does NOT support patterns. Switched to setAllowedOriginPatterns() so that
     * wildcard entries like https://*.vercel.app work correctly.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // allowedOriginPatterns supports both exact origins and glob patterns
        configuration.setAllowedOriginPatterns(Arrays.asList(getAllowedOrigins()));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

    /**
     * Parses the CORS_ORIGINS env variable (comma-separated, trims whitespace).
     */
    private String[] getAllowedOrigins() {
        return Arrays.stream(corsOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toArray(String[]::new);
    }
}
