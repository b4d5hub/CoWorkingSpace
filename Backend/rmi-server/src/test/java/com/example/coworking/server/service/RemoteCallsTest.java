package com.example.coworking.server.service;

import com.example.coworking.common.SalleDTO;
import com.example.coworking.common.SalleService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.rmi.RemoteException;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RemoteCallsTest {

    @Mock
    private SalleService salleService;

    @Test
    void testRemoteGetAllSalles() throws RemoteException {
        SalleDTO salleFictive = new SalleDTO();
        salleFictive.setName("Salle Distante");

        when(salleService.getAllSalles()).thenReturn(Collections.singletonList(salleFictive));

        List<SalleDTO> result = salleService.getAllSalles();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Salle Distante", result.get(0).getName());

        verify(salleService, times(1)).getAllSalles();
    }

    @Test
    void testRemoteCallConnectionError() throws RemoteException {

        when(salleService.getAllSalles()).thenThrow(new RemoteException("Connexion perdue"));

        assertThrows(RemoteException.class, () -> {
            salleService.getAllSalles();
        });
    }
}