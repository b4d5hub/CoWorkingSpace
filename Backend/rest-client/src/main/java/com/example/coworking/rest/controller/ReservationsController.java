package com.example.coworking.rest.controller;

import com.example.coworking.common.ReservationResult;
import com.example.coworking.common.SalleService;
import com.example.coworking.rest.room.SalleEntity;
import com.example.coworking.rest.room.SalleRepository;
import com.example.coworking.rest.reservation.ReservationEntity;
import com.example.coworking.rest.reservation.ReservationRepository;
import com.example.coworking.rest.user.UserEntity;
import com.example.coworking.rest.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationsController {

    private final SalleService salleService;
    private final ReservationRepository reservationRepository;
    private final SalleRepository salleRepository;
    private final JdbcTemplate jdbcTemplate;
    private final UserRepository userRepository;

    public ReservationsController(SalleService salleService,
                                  ReservationRepository reservationRepository,
                                  SalleRepository salleRepository,
                                  JdbcTemplate jdbcTemplate,
                                  UserRepository userRepository) {
        this.salleService = salleService;
        this.reservationRepository = reservationRepository;
        this.salleRepository = salleRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.userRepository = userRepository;
    }

    public static class CreateReservationRequest {
        public Long salleId;
        public String client;
        public String date;      // YYYY-MM-DD
        public String startTime; // HH:mm
        public String endTime;   // HH:mm

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

    public static class ReservationDTO {
        public Long id;
        public String userId; // not available yet, keep null
        public String userName;
        public String roomId;
        public String roomName;
        public String location;
        public String date;
        public String startTime;
        public String endTime;
        public String status;
    }

    @PostMapping
    public ResponseEntity<ReservationResult> create(@RequestBody CreateReservationRequest request) throws Exception {
        if (request == null || request.getSalleId() == null || request.getClient() == null || request.getClient().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ReservationResult(false, "Missing salleId or client"));
        }
        // If client supplied a time window, enforce no-overlap policy before accepting
        LocalDateTime startAtForCheck = null;
        LocalDateTime endAtForCheck = null;
        if (request.getDate() != null && request.getStartTime() != null && request.getEndTime() != null) {
            try {
                LocalDate date = LocalDate.parse(request.getDate());
                LocalTime start = LocalTime.parse(request.getStartTime());
                LocalTime end = LocalTime.parse(request.getEndTime());
                startAtForCheck = LocalDateTime.of(date, start);
                endAtForCheck = LocalDateTime.of(date, end);
                if (!endAtForCheck.isAfter(startAtForCheck)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(new ReservationResult(false, "endTime must be after startTime"));
                }
            } catch (Exception ex) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ReservationResult(false, "Invalid date/time format"));
            }
            try {
                // Capacity rule: only approved (CONFIRMED) reservations count toward capacity
                long overlaps = reservationRepository.countOverlaps(
                        request.getSalleId(),
                        startAtForCheck,
                        endAtForCheck,
                        java.util.Arrays.asList("CONFIRMED")
                );
                // Fetch capacity for the salle
                Integer capacity = salleRepository.findById(request.getSalleId())
                        .map(com.example.coworking.rest.room.SalleEntity::getCapacity)
                        .orElse(null);
                if (capacity == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ReservationResult(false, "Room not found"));
                }
                if (overlaps >= capacity) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(new ReservationResult(false, "Room not available in requested interval"));
                }
            } catch (Exception ignore) {
                // If overlap check fails unexpectedly, proceed rather than block creation
            }
        }
        // Create via legacy RMI signature (now returns PENDING)
        ReservationResult result = salleService.reserverSalle(request.getSalleId(), request.getClient());
        if (result.isSuccess()) {
            // If we have a reservationId and date/time were provided, persist them to the row
            if (result.getReservationId() != null
                    && startAtForCheck != null && endAtForCheck != null) {
                try {
                    // Prefer JPA update; if entity not yet visible, fallback to direct SQL (Java 8 compatible)
                    java.util.Optional<ReservationEntity> opt = reservationRepository.findById(result.getReservationId());
                    if (opt.isPresent()) {
                        ReservationEntity r = opt.get();
                        r.setStartAt(startAtForCheck);
                        r.setEndAt(endAtForCheck);
                        // Auto-approve if under capacity per rules
                        r.setStatus("CONFIRMED");
                        reservationRepository.save(r);
                        if (r.getSalle() != null) {
                            updateRoomAvailability(r.getSalle());
                        }
                    } else {
                        // Fallback to direct column update
                        jdbcTemplate.update("UPDATE reservations SET start_at=?, end_at=?, status='CONFIRMED' WHERE id=?",
                                java.sql.Timestamp.valueOf(startAtForCheck), java.sql.Timestamp.valueOf(endAtForCheck), result.getReservationId());
                    }
                } catch (Exception ignore) {
                    // Leave times empty if parsing fails
                }
            }
            // Reflect auto-approval in the response payload
            try {
                result.setStatus("CONFIRMED");
            } catch (Exception ignore) { }
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(result);
    }

    @GetMapping
    public List<ReservationDTO> list(@RequestParam(value = "client", required = false) String client,
                                     @RequestParam(value = "status", required = false) String status) {
        List<ReservationEntity> list = new java.util.ArrayList<>();

        boolean hasClient = client != null && !client.trim().isEmpty();
        boolean hasStatus = status != null && !status.trim().isEmpty();
        String c = hasClient ? client.trim() : null;

        if (hasClient) {
            // 1) Direct match (case-insensitive)
            if (hasStatus) {
                list = reservationRepository.findByClientIgnoreCaseAndStatusIgnoreCase(c, status);
            } else {
                list = reservationRepository.findByClientIgnoreCase(c);
            }

            // 2) If it looks like an email, try local-part contains match
            if (list.isEmpty() && c.contains("@")) {
                String local = c.substring(0, c.indexOf('@'));
                if (hasStatus) {
                    list = reservationRepository.findByClientContainingIgnoreCaseAndStatusIgnoreCase(local, status);
                } else {
                    list = reservationRepository.findByClientContainingIgnoreCase(local);
                }
            }

            // 3) Try by the user's display name from users table
            if (list.isEmpty()) {
                java.util.Optional<com.example.coworking.rest.user.UserEntity> uo = userRepository.findByEmail(c);
                if (uo.isPresent()) {
                    String name = uo.get().getName();
                    List<ReservationEntity> alt;
                    if (hasStatus) {
                        alt = reservationRepository.findByClientIgnoreCaseAndStatusIgnoreCase(name, status);
                        if (alt.isEmpty()) {
                            alt = reservationRepository.findByClientContainingIgnoreCaseAndStatusIgnoreCase(name, status);
                        }
                    } else {
                        alt = reservationRepository.findByClientIgnoreCase(name);
                        if (alt.isEmpty()) {
                            alt = reservationRepository.findByClientContainingIgnoreCase(name);
                        }
                    }
                    if (!alt.isEmpty()) {
                        list = alt;
                    }
                }
            }

            // 4) Last resort: try contains on original input
            if (list.isEmpty()) {
                if (hasStatus) {
                    list = reservationRepository.findByClientContainingIgnoreCaseAndStatusIgnoreCase(c, status);
                } else {
                    list = reservationRepository.findByClientContainingIgnoreCase(c);
                }
            }
        } else if (hasStatus) {
            list = reservationRepository.findByStatus(status);
        } else {
            list = reservationRepository.findAll();
        }

        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable("id") Long id) {
        return reservationRepository.findById(id).map(r -> {
            // Allow cancelling only if the reservation has not yet started (upcoming-only rule)
            try {
                if (r.getStartAt() != null) {
                    java.time.LocalDateTime now = java.time.LocalDateTime.now();
                    if (!r.getStartAt().isAfter(now)) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body("Cannot cancel a reservation that has already started or elapsed");
                    }
                }
            } catch (Exception ignore) {
                // If time comparison fails, proceed rather than block
            }
            r.setStatus("CANCELLED");
            reservationRepository.save(r);
            // If a reservation is cancelled, recompute room availability
            SalleEntity salle = r.getSalle();
            if (salle != null) {
                updateRoomAvailability(salle);
            }
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable("id") Long id) {
        return reservationRepository.findById(id).map(r -> {
            // Prevent approving a reservation that overlaps another already CONFIRMED reservation for the same room/time
            try {
                if (r.getSalle() != null && r.getStartAt() != null && r.getEndAt() != null) {
                    long overlaps = reservationRepository.countOverlaps(
                            r.getSalle().getId(),
                            r.getStartAt(),
                            r.getEndAt(),
                            java.util.Arrays.asList("CONFIRMED")
                    );
                    if (overlaps > 0) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body("Room already booked in the requested interval");
                    }
                }
            } catch (Exception ignore) {
                // If overlap check fails unexpectedly, we proceed to avoid blocking admin
            }
            r.setStatus("CONFIRMED");
            reservationRepository.save(r);
            // On approve, set room availability based on capacity vs confirmed reservations
            SalleEntity salle = r.getSalle();
            if (salle != null) {
                updateRoomAvailability(salle);
            }
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable("id") Long id) {
        return reservationRepository.findById(id).map(r -> {
            r.setStatus("CANCELLED");
            reservationRepository.save(r);
            // Recompute room availability after rejection
            SalleEntity salle = r.getSalle();
            if (salle != null) {
                updateRoomAvailability(salle);
            }
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    private ReservationDTO toDto(ReservationEntity r) {
        ReservationDTO dto = new ReservationDTO();
        dto.id = r.getId();
        dto.userId = null;
        dto.userName = r.getClient();
        SalleEntity salle = r.getSalle();
        if (salle != null) {
            dto.roomId = String.valueOf(salle.getId());
            dto.roomName = salle.getName();
            dto.location = salle.getLocation();
        }
        if (r.getStartAt() != null) {
            dto.date = r.getStartAt().toLocalDate().toString();
            dto.startTime = r.getStartAt().toLocalTime().toString();
        } else if (r.getCreatedAt() != null) {
            // Fallback to createdAt to avoid "Invalid Date" and missing start time for legacy rows
            dto.date = r.getCreatedAt().toLocalDate().toString();
            dto.startTime = r.getCreatedAt().toLocalTime().withSecond(0).withNano(0).toString();
        }
        if (r.getEndAt() != null) {
            dto.endTime = r.getEndAt().toLocalTime().toString();
        } else if (dto.startTime != null && !dto.startTime.isEmpty()) {
            // Provide a minimal endTime fallback (same as startTime) to avoid rendering "-"
            dto.endTime = dto.startTime;
        }
        dto.status = r.getStatus() != null ? r.getStatus() : "CONFIRMED";
        return dto;
    }

    /**
     * Toggle a room's availability based on the number of CONFIRMED reservations versus its capacity.
     * For now, we consider all confirmed reservations (simple policy). If confirmedCount >= capacity, available=false.
     * Otherwise available=true.
     */
    private void updateRoomAvailability(SalleEntity salle) {
        try {
            Long salleId = salle.getId();
            int capacity = salle.getCapacity();
            List<ReservationEntity> confirmed = reservationRepository.findBySalle_IdAndStatus(salleId, "CONFIRMED");
            boolean available = confirmed.size() < capacity;
            // Only update if changed to reduce writes
            if (salle.isAvailable() != available) {
                salle.setAvailable(available);
                salleRepository.save(salle);
            }
        } catch (Exception ignore) {
            // Do not fail the request if availability recomputation fails
        }
    }
}
