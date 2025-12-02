package com.example.coworking.rest.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Ensures the minimal schema for rooms exists in MySQL when running in dev.
 * This complements Hibernate's ddl-auto=update and avoids runtime 500s due to
 * missing columns or the amenities join table.
 */
@Configuration
public class SchemaInitializer {
    private static final Logger log = LoggerFactory.getLogger(SchemaInitializer.class);

    @Bean
    CommandLineRunner ensureRoomSchema(JdbcTemplate jdbcTemplate) {
        return args -> {
            // Ensure base 'salles' table exists (minimal columns). If it exists, MySQL will ignore this.
            try {
                jdbcTemplate.execute(
                        "CREATE TABLE IF NOT EXISTS salles (" +
                                "id BIGINT PRIMARY KEY AUTO_INCREMENT," +
                                "nom VARCHAR(255) NOT NULL," +
                                "capacite INT NOT NULL" +
                                ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
                );
            } catch (Exception ex) {
                log.debug("[SCHEMA] salles table ensure failed (may already exist): {}", ex.getMessage());
            }
            try {
                // Try to add columns; if they already exist, MySQL will throw and we ignore.
                jdbcTemplate.execute("ALTER TABLE salles ADD COLUMN location VARCHAR(80)");
            } catch (Exception ex) {
                log.debug("[SCHEMA] location column add handled (exists or error): {}", ex.getMessage());
            }
            try {
                jdbcTemplate.execute("ALTER TABLE salles ADD COLUMN image_url VARCHAR(512)");
            } catch (Exception ex) {
                log.debug("[SCHEMA] image_url column add handled (exists or error): {}", ex.getMessage());
            }
            try {
                jdbcTemplate.execute("ALTER TABLE salles ADD COLUMN available TINYINT(1) NOT NULL DEFAULT 1");
            } catch (Exception ex) {
                log.debug("[SCHEMA] available column add handled (exists or error): {}", ex.getMessage());
            }
            try {
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS room_amenities (" +
                        "room_id BIGINT NOT NULL, " +
                        "name VARCHAR(60) NOT NULL, " +
                        "PRIMARY KEY (room_id, name), " +
                        "CONSTRAINT fk_room_amenities_room FOREIGN KEY (room_id) REFERENCES salles(id) ON DELETE CASCADE" +
                        ")");
            } catch (Exception ex) {
                log.debug("[SCHEMA] room_amenities ensure failed (may already exist): {}", ex.getMessage());
            }

            // Ensure 'available' has a default to avoid INSERT errors when client omits it
            try {
                jdbcTemplate.execute("ALTER TABLE salles MODIFY available TINYINT(1) NOT NULL DEFAULT 1");
            } catch (Exception ex) {
                log.debug("[SCHEMA] alter default for available ignored: {}", ex.getMessage());
            }

            // Backfill reservations times for legacy rows to avoid "Invalid Date" / missing times in UI
            try {
                jdbcTemplate.execute("UPDATE reservations SET start_at = created_at WHERE start_at IS NULL AND created_at IS NOT NULL");
            } catch (Exception ex) {
                log.debug("[SCHEMA] backfill start_at failed: {}", ex.getMessage());
            }
            try {
                jdbcTemplate.execute("UPDATE reservations SET end_at = start_at WHERE end_at IS NULL AND start_at IS NOT NULL");
            } catch (Exception ex) {
                log.debug("[SCHEMA] backfill end_at failed: {}", ex.getMessage());
            }
            log.info("[SCHEMA] Rooms schema ensured (columns + room_amenities)");
        };
    }
}
