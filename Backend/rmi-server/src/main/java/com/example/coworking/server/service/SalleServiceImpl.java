package com.example.coworking.server.service;

import com.example.coworking.common.ReservationResult;
import com.example.coworking.common.SalleDTO;
import com.example.coworking.common.SalleService;
import com.example.coworking.server.entity.Reservation;
import com.example.coworking.server.entity.Salle;
import com.example.coworking.server.repository.ReservationRepository;
import com.example.coworking.server.repository.SalleRepository;
import org.springframework.stereotype.Service;

import java.rmi.RemoteException;
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
            salleRepository.save(new Salle("Salle Alpha", 10));
            salleRepository.save(new Salle("Salle Beta", 8));
            salleRepository.save(new Salle("Salle Gamma", 6));
        }
    }

    @Override
    public List<SalleDTO> getAllSalles() throws RemoteException {
        return salleRepository.findAll().stream()
                .map(s -> new SalleDTO(s.getId(), s.getNom(), s.getCapacite()))
                .collect(Collectors.toList());
    }

    @Override
    public ReservationResult reserverSalle(Long salleId, String client) throws RemoteException {
        Salle s = salleRepository.findById(salleId).orElse(null);
        if (s == null) {
            return new ReservationResult(false, "Salle introuvable");
        }
        Reservation r = new Reservation(client, s);
        reservationRepository.save(r);
        return new ReservationResult(true, "Réservation enregistrée pour " + client + " sur " + s.getNom());
    }
}
