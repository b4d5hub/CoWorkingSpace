package com.example.coworking.rest.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {
    List<ReservationEntity> findByClient(String client);
    List<ReservationEntity> findByStatus(String status);
    List<ReservationEntity> findByClientAndStatus(String client, String status);

    // Case-insensitive helpers
    List<ReservationEntity> findByClientIgnoreCase(String client);
    List<ReservationEntity> findByClientIgnoreCaseAndStatusIgnoreCase(String client, String status);

    // Partial match helpers (for legacy values that stored only name or just local-part)
    List<ReservationEntity> findByClientContainingIgnoreCase(String client);
    List<ReservationEntity> findByClientContainingIgnoreCaseAndStatusIgnoreCase(String client, String status);

    // For availability toggling: count/find reservations for a specific room by status
    List<ReservationEntity> findBySalle_IdAndStatus(Long salleId, String status);

    // Overlap count for a time window: (start < :end AND end > :start)
    @Query("SELECT COUNT(r) FROM ReservationEntity r " +
           "WHERE r.salle.id = :salleId " +
           "AND r.status IN (:statuses) " +
           "AND r.startAt IS NOT NULL AND r.endAt IS NOT NULL " +
           "AND r.startAt < :end AND r.endAt > :start")
    long countOverlaps(@Param("salleId") Long salleId,
                       @Param("start") java.time.LocalDateTime start,
                       @Param("end") java.time.LocalDateTime end,
                       @Param("statuses") java.util.List<String> statuses);

    // Fetch all reservations that intersect a day window for a room
    @Query("SELECT r FROM ReservationEntity r " +
           "WHERE r.salle.id = :salleId " +
           "AND r.status IN (:statuses) " +
           "AND r.startAt IS NOT NULL AND r.endAt IS NOT NULL " +
           "AND r.startAt < :dayEnd AND r.endAt > :dayStart")
    java.util.List<com.example.coworking.rest.reservation.ReservationEntity> findForDay(
            @Param("salleId") Long salleId,
            @Param("dayStart") java.time.LocalDateTime dayStart,
            @Param("dayEnd") java.time.LocalDateTime dayEnd,
            @Param("statuses") java.util.List<String> statuses);
}
