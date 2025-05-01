package service_tasks.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre ne peut pas être vide")
    @Size(max = 100, message = "Le titre doit faire au plus 100 caractères")
    @Column(nullable = false, length = 100, unique = true)
    private String title;

    @Size(max = 500, message = "La description doit faire au plus 500 caractères")
    @Column(length = 500)
    private String description;

    @NotNull(message = "La date d'échéance est requise")
    private LocalDate dueDate;

    private boolean done;

    private String ownerUsername;

    public Task(String title, String description, LocalDate dueDate) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.done = false;
    }



}