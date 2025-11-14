package com.example.coworking.rest.controller;

import com.example.coworking.common.ReservationResult;
import com.example.coworking.common.SalleDTO;
import com.example.coworking.common.SalleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salles")
@CrossOrigin(origins = "*")
public class SalleController {
    private final SalleService salleService;

    public SalleController(SalleService salleService) {
        this.salleService = salleService;
    }

    @GetMapping
    public List<SalleDTO> getAllSalles() throws Exception {
        return salleService.getAllSalles();
    }

    @PostMapping("/reserver")
    public ReservationResult reserver(@RequestParam Long salleId, @RequestParam String client) throws Exception {
        return salleService.reserverSalle(salleId, client);
    }
}
