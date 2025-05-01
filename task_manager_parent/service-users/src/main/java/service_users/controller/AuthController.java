package service_users.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import service_users.config.JwtProperties;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtProperties jwtProperties;

    public AuthController(AuthenticationManager authManager,
                          JwtProperties jwtProperties) {
        this.authManager = authManager;
        this.jwtProperties = jwtProperties;
    }

    // Entry point to login, receive an username and a password in entry and return a JWT token
    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@RequestBody AuthRequest req) {
        Authentication result = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.username(), req.password())
        );

        Instant now = Instant.now();
        Instant exp = now.plusMillis(jwtProperties.getExpirationMs());

        byte[] keyBytes = Base64.getDecoder().decode(jwtProperties.getSecret());
        Key hmacKey = new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());

        String token = Jwts.builder()
                .setIssuer("service-users")
                .setSubject(result.getName())
                .claim("roles", result.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()))
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .signWith(hmacKey, SignatureAlgorithm.HS256)
                .compact();

        return ResponseEntity.ok(Map.of("token", token));
    }

    public static record AuthRequest(String username, String password) {}
}