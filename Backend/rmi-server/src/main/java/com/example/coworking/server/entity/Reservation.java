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
}
