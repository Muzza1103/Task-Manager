package service_tasks.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import service_tasks.model.Task;
import service_tasks.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    // Return all the connected user's tasks
    @GetMapping
    public List<Task> all(Authentication auth) {
        return service.findByOwnerUsername(auth.getName());
    }

    // Return a specific task
    @GetMapping("/{id}")
    public ResponseEntity<Task> one(@PathVariable Long id, Authentication auth) {
        return service.findByIdAndOwner(id, auth.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new task for the user
    @PostMapping
    public ResponseEntity<Map<String,String>> create(@Valid @RequestBody Task t, Authentication auth) {
        t.setOwnerUsername(auth.getName());

        service.create(t, auth.getName());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Tâche créée avec succès"));
    }

    // Update a specific task
    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable("id") Long id, @Valid @RequestBody Task t, Authentication auth) {
        if (!service.findByIdAndOwner(id, auth.getName()).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(service.update(id, t, auth.getName()));
    }

    // Toggle the done attribute
    @PutMapping("/toggle/{id}")
    public ResponseEntity<Task> toggleDone(@PathVariable("id") Long id, Authentication auth) {
        Optional<Task> optionalTask = service.findByIdAndOwner(id, auth.getName());
        if (optionalTask.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Task task = optionalTask.get();
        Task updated;
        if (task.isDone()){
            updated = service.updateUndone(id, auth.getName());
        }else {
            updated = service.updateDone(id, auth.getName());
        }
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/done/{id}")
    public ResponseEntity<Task> updateDone(@PathVariable("id") Long id, Authentication auth) {
        Optional<Task> optionalTask = service.findByIdAndOwner(id, auth.getName());
        if (optionalTask.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Task updated = service.updateDone(id, auth.getName());
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/undone/{id}")
    public ResponseEntity<Task> updateUndone(@PathVariable("id") Long id, Authentication auth) {
        Optional<Task> optionalTask = service.findByIdAndOwner(id, auth.getName());
        if (optionalTask.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Task updated = service.updateUndone(id, auth.getName());
        return ResponseEntity.ok(updated);
    }

    // Delete a specific task
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String,String>> delete(@PathVariable("id") Long id, Authentication auth) {
        service.delete(id, auth.getName());
        return ResponseEntity
                .ok(Map.of("message", "Tâche supprimée avec succès"));
    }

    // Delete all the user's tasks
    @DeleteMapping
    public ResponseEntity<Void> deleteAllForCurrentUser(Authentication auth) {
        String username = auth.getName();
        service.deleteAllByUsername(username);
        return ResponseEntity.noContent().build();
    }

}