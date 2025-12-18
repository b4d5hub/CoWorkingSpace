package com.example.coworking.server.entity;



import javax.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "salles")
public class Salle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private int capacite;

    @Column(length = 80)
    private String location;

    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @Column(nullable = false)
    private boolean available = true;

    @Column(name = "price_per_hour", precision = 10, scale = 2)
    private BigDecimal pricePerHour;

    @ElementCollection
    @CollectionTable(name = "room_amenities", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "name", length = 60)
    private List<String> amenities = new ArrayList<>();

    public Salle() {}

    public Salle(String nom, int capacite) {
        this.nom = nom;
        this.capacite = capacite;
    }

    public Salle(String nom, int capacite, String location, String imageUrl, boolean available, List<String> amenities) {
        this.nom = nom;
        this.capacite = capacite;
        this.location = location;
        this.imageUrl = imageUrl;
        this.available = available;
        if (amenities != null) this.amenities = amenities;
    }

    public Salle(String nom, int capacite, String location, String imageUrl, boolean available, List<String> amenities, BigDecimal pricePerHour) {
        this.nom = nom;
        this.capacite = capacite;
        this.location = location;
        this.imageUrl = imageUrl;
        this.available = available;
        if (amenities != null) this.amenities = amenities;
        this.pricePerHour = pricePerHour;
    }

    public Long getId() { return id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public int getCapacite() { return capacite; }
    public void setCapacite(int capacite) { this.capacite = capacite; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }

    public BigDecimal getPricePerHour() { return pricePerHour; }
    public void setPricePerHour(BigDecimal pricePerHour) { this.pricePerHour = pricePerHour; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Salle)) return false;
        Salle salle = (Salle) o;
        return Objects.equals(id, salle.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
