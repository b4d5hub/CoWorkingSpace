package com.example.coworking.server.service;

import com.example.coworking.common.CreateReservationCommand;
import com.example.coworking.common.ReservationResult;
import com.example.coworking.server.entity.Reservation;
import com.example.coworking.server.entity.Salle;
import com.example.coworking.server.repository.ReservationRepository;
import com.example.coworking.server.repository.SalleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationLogicTest {

    @Mock
    private SalleRepository salleRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private SalleServiceImpl salleService; // On teste la logique de réservation contenue ici

    @Test
    void testReserverSalle() throws Exception {

        Salle salle = new Salle("Espace Innovation", 10);
        when(salleRepository.findById(1L)).thenReturn(Optional.of(salle));

        CreateReservationCommand command = new CreateReservationCommand();
        command.setSalleId(1L);
        command.setClient("Yassine");
        command.setDate("2026-01-10");
        command.setStartTime("14:00");
        command.setEndTime("16:00");

        ReservationResult result = salleService.reserverSalle(command);

        assertTrue(result.isSuccess(), "La réservation devrait réussir");
        assertEquals("PENDING", result.getStatus(), "Le statut initial doit être PENDING");

        verify(reservationRepository, times(1)).save(any(Reservation.class));
    }

    @Test
    void testReserverInvalidSalle() throws Exception {

        ReservationResult result = salleService.reserverSalle(null);

        assertFalse(result.isSuccess());
        assertEquals("Paramètres manquants", result.getMessage());
    }
}