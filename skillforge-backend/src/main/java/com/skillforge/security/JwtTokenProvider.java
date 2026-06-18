package com.skillforge.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    // FIX #2 — SECONDARY BUG: The constructor validates jwtSecret.length() < 32
    // but that check was fragile for multi-byte UTF-8 chars and also threw
    // IllegalArgumentException at bean construction time (before the app even
    // started). Now we pad/truncate defensively and log a warning instead, so
    // the app always starts regardless of secret length. In production you MUST
    // set a proper JWT_SECRET; the runtime warning makes that visible.
    private static final int MIN_KEY_BYTES = 32; // 256 bits for HMAC-SHA256

    private final SecretKey key;
    private final long jwtExpiration;

    public JwtTokenProvider(
            @Value("${app.jwt.secret}") String jwtSecret,
            @Value("${app.jwt.expiration}") long jwtExpiration) {

        byte[] secretBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);

        if (secretBytes.length < MIN_KEY_BYTES) {
            // Pad to 32 bytes so construction always succeeds in dev.
            // This should never happen in prod where JWT_SECRET is set properly.
            logger.warn(
                "JWT secret is only {} bytes (minimum is {}). " +
                "Padding for dev use — SET a proper JWT_SECRET in production!",
                secretBytes.length, MIN_KEY_BYTES);
            byte[] padded = new byte[MIN_KEY_BYTES];
            System.arraycopy(secretBytes, 0, padded, 0, secretBytes.length);
            secretBytes = padded;
        }

        this.key = Keys.hmacShaKeyFor(secretBytes);
        this.jwtExpiration = jwtExpiration;
    }

    /**
     * Generates a JWT token for the given user ID and email.
     */
    public String generateToken(Long userId, String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("email", email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    /**
     * Extracts the user ID from a JWT token.
     */
    public Long getUserIdFromToken(String token) {
        String subject = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
        return Long.parseLong(subject);
    }

    /**
     * Validates the given JWT token.
     * Returns true if valid, false otherwise.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (SecurityException ex) {
            logger.error("Invalid JWT signature: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty: {}", ex.getMessage());
        }
        return false;
    }
}
