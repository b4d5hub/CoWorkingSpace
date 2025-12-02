package com.example.coworking.common;

import java.io.Serializable;

public class ReservationResult implements Serializable {
    private boolean success;
    private String message;
    private Long reservationId;
    private String status; // PENDING | CONFIRMED | CANCELLED

    public ReservationResult() {}

    public ReservationResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public ReservationResult(boolean success, String message, Long reservationId, String status) {
        this.success = success;
        this.message = message;
        this.reservationId = reservationId;
        this.status = status;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Long getReservationId() { return reservationId; }
    public void setReservationId(Long reservationId) { this.reservationId = reservationId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
