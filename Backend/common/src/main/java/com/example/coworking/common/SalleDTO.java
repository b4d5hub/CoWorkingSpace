package com.example.coworking.common;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * Room DTO shared over RMI and REST. Fields are aligned with frontend expectations.
 */
public class SalleDTO implements Serializable {
    private Long id;
    private String name;
    private String location;
    private int capacity;
    private List<String> amenities;
    private String imageUrl;
    private boolean available;
    private BigDecimal pricePerHour;

    public SalleDTO() {}

    public SalleDTO(Long id, String name, String location, int capacity, List<String> amenities, String imageUrl, boolean available) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.capacity = capacity;
        this.amenities = amenities;
        this.imageUrl = imageUrl;
        this.available = available;
    }

    public SalleDTO(Long id, String name, String location, int capacity, List<String> amenities, String imageUrl, boolean available, BigDecimal pricePerHour) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.capacity = capacity;
        this.amenities = amenities;
        this.imageUrl = imageUrl;
        this.available = available;
        this.pricePerHour = pricePerHour;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public BigDecimal getPricePerHour() { return pricePerHour; }
    public void setPricePerHour(BigDecimal pricePerHour) { this.pricePerHour = pricePerHour; }
}
