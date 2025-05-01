package service_tasks.service;

import org.springframework.security.access.AccessDeniedException;
import service_tasks.model.Task;
import service_tasks.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    private final TaskRepository repo;

    public TaskService(TaskRepository repo) {
        this.repo = repo;
    }

    public List<Task> findByOwnerUsername(String ownerUsername) {
        return repo.findByOwnerUsername(ownerUsername);
    }

    public Optional<Task> findByIdAndOwner(Long id, String ownerUsername) {
        return repo.findByIdAndOwnerUsername(id, ownerUsername);
    }

    public Task create(Task t, String ownerUsername) {
        t.setOwnerUsername(ownerUsername);
        return repo.save(t);
    }

    public Task update(Long id, Task t, String ownerUsername) {
        Task existing = repo.findByIdAndOwnerUsername(id, ownerUsername)
                .orElseThrow(() -> new AccessDeniedException("Not allowed to update this task"));
        // On conserve l’owner et l’id
        t.setId(existing.getId());
        t.setOwnerUsername(ownerUsername);
        return repo.save(t);
    }


    public Task updateDone(Long id, String ownerUsername) {
        Task existing = repo.findByIdAndOwnerUsername(id, ownerUsername)
                .orElseThrow(() -> new AccessDeniedException("Not allowed to update this task"));
        existing.setDone(true);
        return repo.save(existing);
    }

    public Task updateUndone(Long id, String ownerUsername) {
        Task existing = repo.findByIdAndOwnerUsername(id, ownerUsername)
                .orElseThrow(() -> new AccessDeniedException("Not allowed to update this task"));
        existing.setDone(false);
        return repo.save(existing);
    }

    public void delete(Long id, String ownerUsername) {
        Task existing = repo.findByIdAndOwnerUsername(id, ownerUsername)
                .orElseThrow(() -> new AccessDeniedException("Not allowed to delete this task"));
        repo.delete(existing);
    }

    public void deleteAllByUsername(String username) {
        List<Task> existingTasks= repo.findByOwnerUsername(username);
        if (existingTasks.isEmpty()) {
            throw new AccessDeniedException("Not allowed to delete tasks for this user");
        }
        repo.deleteAll(existingTasks);
    }
}