package com.example.coworking.server.entity;


import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String client;

    private LocalDateTime createdAt;

    // New fields for time-windowed reservations
    @Column(name = "start_at")
    private LocalDateTime startAt;

    @Column(name = "end_at")
    private LocalDateTime endAt;

    @Column(name = "status", length = 16)
    private String status; // PENDING | CONFIRMED | CANCELLED

    @ManyToOne
    @JoinColumn(name = "salle_id")
    private Salle salle;

    public Reservation() {}

    public Reservation(String client, Salle salle) {
        this.client = client;
        this.salle = salle;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getClient() { return client; }
    public void setClient(String client) { this.client = client; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Salle getSalle() { return salle; }
    public void setSalle(Salle salle) { this.salle = salle; }

    public LocalDateTime getStartAt() { return startAt; }
    public void setStartAt(LocalDateTime startAt) { this.startAt = startAt; }

    public LocalDateTime getEndAt() { return endAt; }
    public void setEndAt(LocalDateTime endAt) { this.endAt = endAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
