package com.example.coworking.rest.room;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "salles")
public class SalleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom")
    private String name; // maps to 'nom' column

    @Column(name = "capacite")
    private int capacity;

    @Column(length = 80)
    private String location;

    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @Column(nullable = false)
    private Boolean available = true; // use wrapper to avoid NPE if legacy rows are NULL

    @Column(name = "price_per_hour", precision = 10, scale = 2)
    private BigDecimal pricePerHour;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "room_amenities", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "name", length = 60)
    private List<String> amenities = new ArrayList<>();

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public boolean isAvailable() { return Boolean.TRUE.equals(available); }
    public void setAvailable(boolean available) { this.available = available; }
    public void setAvailable(Boolean available) { this.available = available; }
    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }

    public BigDecimal getPricePerHour() { return pricePerHour; }
    public void setPricePerHour(BigDecimal pricePerHour) { this.pricePerHour = pricePerHour; }
}
