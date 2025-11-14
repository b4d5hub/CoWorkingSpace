package com.example.coworking.common;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;

public interface SalleService extends Remote {
    List<SalleDTO> getAllSalles() throws RemoteException;
    ReservationResult reserverSalle(Long salleId, String client) throws RemoteException;
}
