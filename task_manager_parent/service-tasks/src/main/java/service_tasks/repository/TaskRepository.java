package service_tasks.repository;

import service_tasks.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByOwnerUsername(String ownerUsername);
    Optional<Task> findByIdAndOwnerUsername(Long id, String ownerUsername);
}