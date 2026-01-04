package com.example.coworking.server.service;

import com.example.coworking.common.SalleDTO;
import com.example.coworking.server.entity.Salle;
import com.example.coworking.server.repository.ReservationRepository;
import com.example.coworking.server.repository.SalleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SalleServiceImplTest {

    @Mock
    private SalleRepository salleRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private SalleServiceImpl salleService;

    @Test
    void testGetAllSalles() throws Exception {

        Salle s1 = new Salle("Innovation Hub", 8);

        when(salleRepository.findAll()).thenReturn(Arrays.asList(s1));

        List<SalleDTO> result = salleService.getAllSalles();

        assertNotNull(result);
        assertEquals(1, result.size());

        assertEquals("Innovation Hub", result.get(0).getName());

        verify(salleRepository, times(1)).findAll();
    }
}