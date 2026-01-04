package com.example.coworking.rest;

import com.example.coworking.common.SalleDTO;
import com.example.coworking.common.SalleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SystemIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean(name = "salleService")
    private SalleService salleService;

    @Test
    void testFrontendToBackendIntegration() throws Exception {

        SalleDTO dto = new SalleDTO();
        dto.setId(1L);
        dto.setName("Innovation Hub");

        when(salleService.getAllSalles()).thenReturn(Collections.singletonList(dto));


        mockMvc.perform(get("/api/salles")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Innovation Hub"));
    }
}