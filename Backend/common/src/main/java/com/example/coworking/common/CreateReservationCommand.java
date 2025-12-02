package com.example.coworking.common;

import java.io.Serializable;

public class CreateReservationCommand implements Serializable {
    private Long salleId;
    private String client; // for now we use client name/email; can be userId later
    private String date; // YYYY-MM-DD
    private String startTime; // HH:mm
    private String endTime; // HH:mm

    public CreateReservationCommand() {}

    // Backward-compatible constructor
    public CreateReservationCommand(Long salleId, String client) {
        this.salleId = salleId;
        this.client = client;
    }

    public CreateReservationCommand(Long salleId, String client, String date, String startTime, String endTime) {
        this.salleId = salleId;
        this.client = client;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getSalleId() { return salleId; }
    public void setSalleId(Long salleId) { this.salleId = salleId; }

    public String getClient() { return client; }
    public void setClient(String client) { this.client = client; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
}
