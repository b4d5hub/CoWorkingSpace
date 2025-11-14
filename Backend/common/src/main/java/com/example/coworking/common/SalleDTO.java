package com.example.coworking.common;

import java.io.Serializable;

public class SalleDTO implements Serializable {
    private Long id;
    private String nom;
    private int capacite;

    public SalleDTO() {}

    public SalleDTO(Long id, String nom, int capacite) {
        this.id = id;
        this.nom = nom;
        this.capacite = capacite;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public int getCapacite() { return capacite; }
    public void setCapacite(int capacite) { this.capacite = capacite; }
}
