package com.example.coworking.server.service;

import com.example.coworking.common.SalleService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SystemPerformanceTest {

    @Mock
    private SalleService salleService;

    @Test
    void testRequestOverloadPerformance() throws Exception {

        int numberOfRequests = 100;
        when(salleService.getAllSalles()).thenReturn(Collections.emptyList());

        ExecutorService executor = Executors.newFixedThreadPool(10);
        CountDownLatch latch = new CountDownLatch(numberOfRequests);

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < numberOfRequests; i++) {
            executor.execute(() -> {
                try {
                    salleService.getAllSalles();
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        long duration = System.currentTimeMillis() - startTime;

        System.out.println("Performance Result: " + numberOfRequests + " requests processed in " + duration + "ms");

        assertTrue(duration < 1000, "Le système est trop lent sous surcharge");
        executor.shutdown();
    }
}