package service_users.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        // Vous pouvez tester ici vos connexions BD, JWT, etc.
        return ResponseEntity.ok("OK");
    }
}