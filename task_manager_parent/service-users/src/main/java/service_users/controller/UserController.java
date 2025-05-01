package service_users.controller;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import service_users.model.User;
import service_users.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> all() {
        return service.findAll();
    }

    // Return the connected's user information
    @GetMapping("/me")
    public ResponseEntity<Map<String,Object>> me(Authentication auth) {
        String username = auth.getName();
        User user = service.findByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername()
        ));
    }

    // Create a new user
    @PostMapping
    public ResponseEntity<Map<String,String>> create(@RequestBody User u) {
        try {
            User created = service.create(u);
            return ResponseEntity
                    .created(URI.create("/api/users/" + created.getId()))
                    .body(Map.of(
                            "message", "Utilisateur créé avec succès",
                            "id", created.getId().toString()
                    ));
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Nom d’utilisateur déjà existant"));
        }
    }

    // Delete the connected user's account
    @DeleteMapping
    public ResponseEntity<Map<String,String>> delete(Authentication auth) {
        String username = auth.getName();

        User user = service.findByUsername(username);
        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Utilisateur introuvable"));
        }

        service.delete(user.getId());
        return ResponseEntity
                .ok(Map.of("message", "Compte supprimé avec succès"));
    }
}