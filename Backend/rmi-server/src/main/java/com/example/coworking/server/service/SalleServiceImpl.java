package com.example.coworking.server.service;

import com.example.coworking.common.CreateReservationCommand;
import com.example.coworking.common.ReservationResult;
import com.example.coworking.common.SalleDTO;
import com.example.coworking.common.SalleService;
import com.example.coworking.server.entity.Reservation;
import com.example.coworking.server.entity.Salle;
import com.example.coworking.server.repository.ReservationRepository;
import com.example.coworking.server.repository.SalleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.rmi.RemoteException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service("salleServiceImpl")
public class SalleServiceImpl implements SalleService {
    private final SalleRepository salleRepository;
    private final ReservationRepository reservationRepository;

    public SalleServiceImpl(SalleRepository salleRepository, ReservationRepository reservationRepository) {
        this.salleRepository = salleRepository;
        this.reservationRepository = reservationRepository;

        // Seed some data if empty
        if (salleRepository.count() == 0) {
            salleRepository.save(new Salle(
                    "Innovation Hub", 8,
                    "Agadir",
                    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
                    true,
                    Arrays.asList("Projector", "Whiteboard", "Video Conference")
            ));
            salleRepository.save(new Salle(
                    "Executive Suite", 12,
                    "Agadir",
                    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
                    false,
                    Arrays.asList("TV Screen", "Premium Chairs", "Coffee Machine")
            ));
            salleRepository.save(new Salle(
                    "Collaboration Space", 6,
                    "Marrakech",
                    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
                    true,
                    Arrays.asList("Whiteboard", "Video Conference", "Standing Desk")
            ));
            salleRepository.save(new Salle(
                    "Creative Studio", 10,
                    "Marrakech",
                    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
                    true,
                    Arrays.asList("Smart TV", "Drawing Board", "Bean Bags")
            ));
            salleRepository.save(new Salle(
                    "Boardroom Prime", 16,
                    "Casablanca",
                    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
                    false,
                    Arrays.asList("Conference Phone", "Dual Monitors", "Executive Chairs")
            ));
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalleDTO> getAllSalles() throws RemoteException {
        return salleRepository.findAll().stream()
                .map(s -> new SalleDTO(
                        s.getId(),
                        s.getNom(),
                        s.getLocation(),
                        s.getCapacite(),
                        s.getAmenities(),
                        s.getImageUrl(),
                        s.isAvailable()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public ReservationResult reserverSalle(Long salleId, String client) throws RemoteException {
        Salle s = salleRepository.findById(salleId).orElse(null);
        if (s == null) {
            return new ReservationResult(false, "Salle introuvable");
        }
        Reservation r = new Reservation(client, s);
        // New reservations should start as PENDING and require admin approval
        r.setStatus("PENDING");
        reservationRepository.save(r);
        return new ReservationResult(true, "Réservation enregistrée pour " + client + " sur " + s.getNom(), r.getId(), r.getStatus());
    }

    @Override
    @Transactional
    public ReservationResult reserverSalle(CreateReservationCommand command) throws RemoteException {
        if (command == null || command.getSalleId() == null || command.getClient() == null) {
            return new ReservationResult(false, "Paramètres manquants");
        }
        Salle s = salleRepository.findById(command.getSalleId()).orElse(null);
        if (s == null) {
            return new ReservationResult(false, "Salle introuvable");
        }
        // Basic parse and store; no overlap logic yet (to be added with pessimistic locking)
        LocalDate date = null;
        LocalTime start = null;
        LocalTime end = null;
        try {
            if (command.getDate() != null) {
                date = LocalDate.parse(command.getDate());
            }
            if (command.getStartTime() != null) {
                start = LocalTime.parse(command.getStartTime());
            }
            if (command.getEndTime() != null) {
                end = LocalTime.parse(command.getEndTime());
            }
        } catch (Exception ex) {
            return new ReservationResult(false, "Format de date/heure invalide");
        }

        Reservation r = new Reservation(command.getClient(), s);
        if (date != null && start != null && end != null) {
            LocalDateTime startAt = LocalDateTime.of(date, start);
            LocalDateTime endAt = LocalDateTime.of(date, end);
            r.setStartAt(startAt);
            r.setEndAt(endAt);
        }
        // New reservations should start as PENDING and require admin approval
        r.setStatus("PENDING");
        reservationRepository.save(r);
        return new ReservationResult(true,
                "Réservation enregistrée pour " + command.getClient() + " sur " + s.getNom(),
                r.getId(), r.getStatus());
    }
}
