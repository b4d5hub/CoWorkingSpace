package com.example.coworking.rest.controller;
import com.example.coworking.rest.reservation.ReservationEntity;
import com.example.coworking.rest.reservation.ReservationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.sql.PreparedStatement;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomsController {
    private final JdbcTemplate jdbcTemplate;
    private final ReservationRepository reservationRepository;

    public RoomsController(JdbcTemplate jdbcTemplate, ReservationRepository reservationRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.reservationRepository = reservationRepository;
    }

    private void ensureSchema() {
        try {
            jdbcTemplate.execute(
                    "CREATE TABLE IF NOT EXISTS salles (" +
                            "id BIGINT PRIMARY KEY AUTO_INCREMENT," +
                            "nom VARCHAR(255) NOT NULL," +
                            "capacite INT NOT NULL" +
                            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
            );
        } catch (Exception ignored) {}
        try {
            jdbcTemplate.execute("ALTER TABLE salles ADD COLUMN location VARCHAR(80)");
        } catch (Exception ignored) {}
        try {
            jdbcTemplate.execute("ALTER TABLE salles ADD COLUMN image_url VARCHAR(512)");
        } catch (Exception ignored) {}
        try {
            jdbcTemplate.execute("ALTER TABLE salles ADD COLUMN available TINYINT(1) NOT NULL DEFAULT 1");
        } catch (Exception ignored) {}
        try {
            jdbcTemplate.execute("ALTER TABLE salles ADD COLUMN price_per_hour DECIMAL(10,2)");
        } catch (Exception ignored) {}
        try {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS room_amenities (" +
                    "room_id BIGINT NOT NULL, " +
                    "name VARCHAR(60) NOT NULL, " +
                    "PRIMARY KEY (room_id, name), " +
                    "CONSTRAINT fk_room_amenities_room FOREIGN KEY (room_id) REFERENCES salles(id) ON DELETE CASCADE" +
                    ")");
        } catch (Exception ignored) {}
    }

    public static class AvailabilitySlot {
        public String start;
        public String end;
        public boolean available;
        public AvailabilitySlot(String start, String end, boolean available) {
            this.start = start; this.end = end; this.available = available;
        }
    }

    public static class AvailabilityResponse {
        public String date;
        public List<AvailabilitySlot> slots;
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<?> availability(@PathVariable("id") Long id,
                                          @RequestParam("date") String dateStr) {
        ensureSchema();
        LocalDate date;
        try {
            date = LocalDate.parse(dateStr);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid date format (expected YYYY-MM-DD)");
        }
        // Load capacity
        Integer capacity = null;
        try {
            capacity = jdbcTemplate.queryForObject("SELECT capacite FROM salles WHERE id=?", new Object[]{id}, Integer.class);
        } catch (Exception ignored) {}
        if (capacity == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");

        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd = date.atTime(LocalTime.of(23, 59, 59));
        // Capacity rule counts only APPROVED (CONFIRMED) reservations
        List<ReservationEntity> dayRes = reservationRepository.findForDay(id, dayStart, dayEnd,
                Arrays.asList("CONFIRMED"));

        // Build 30-min slots between 08:00 and 20:00
        List<AvailabilitySlot> slots = new ArrayList<>();
        LocalTime t = LocalTime.of(8, 0);
        LocalTime close = LocalTime.of(20, 0);
        while (t.isBefore(close)) {
            LocalTime tEnd = t.plusMinutes(30);
            LocalDateTime s = LocalDateTime.of(date, t);
            LocalDateTime e = LocalDateTime.of(date, tEnd);
            int overlapCount = 0;
            for (ReservationEntity r : dayRes) {
                if (r.getStartAt() != null && r.getEndAt() != null) {
                    boolean overlaps = r.getStartAt().isBefore(e) && r.getEndAt().isAfter(s);
                    if (overlaps) overlapCount++;
                }
            }
            boolean available = overlapCount < capacity;
            slots.add(new AvailabilitySlot(t.toString(), tEnd.toString(), available));
            t = tEnd;
        }
        AvailabilityResponse resp = new AvailabilityResponse();
        resp.date = date.toString();
        resp.slots = slots;
        return ResponseEntity.ok(resp);
    }

    // Local DTO to avoid classpath/version conflicts with the shared RMI DTO
    public static class RoomDTO {
        private Long id;
        private String name;
        private String location;
        private int capacity;
        private List<String> amenities;
        private String imageUrl;
        private boolean available;
        private java.math.BigDecimal pricePerHour;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public int getCapacity() { return capacity; }
        public void setCapacity(int capacity) { this.capacity = capacity; }
        public List<String> getAmenities() { return amenities; }
        public void setAmenities(List<String> amenities) { this.amenities = amenities; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public boolean isAvailable() { return available; }
        public void setAvailable(boolean available) { this.available = available; }
        public java.math.BigDecimal getPricePerHour() { return pricePerHour; }
        public void setPricePerHour(java.math.BigDecimal pricePerHour) { this.pricePerHour = pricePerHour; }
    }

    @GetMapping
    public List<RoomDTO> getAll() {
        ensureSchema();
        // Fetch base room data
        List<RoomDTO> list = jdbcTemplate.query(
                "SELECT * FROM salles",
                (rs, rowNum) -> {
                    RoomDTO dto = new RoomDTO();
                    dto.setId(rs.getLong("id"));
                    // name may be stored as 'nom' or 'name'
                    try { dto.setName(rs.getString("nom")); } catch (Exception ignore) {
                        try { dto.setName(rs.getString("name")); } catch (Exception ignored) { dto.setName("Room " + rs.getLong("id")); }
                    }
                    // capacity as 'capacite' or 'capacity'
                    try { dto.setCapacity(rs.getInt("capacite")); } catch (Exception ignore) {
                        try { dto.setCapacity(rs.getInt("capacity")); } catch (Exception ignored) { dto.setCapacity(0); }
                    }
                    try { dto.setLocation(rs.getString("location")); } catch (Exception ignore) { dto.setLocation(null); }
                    try { dto.setImageUrl(rs.getString("image_url")); } catch (Exception ignore) { dto.setImageUrl(null); }
                    boolean available = true;
                    try { available = (rs.getObject("available") == null) ? true : rs.getBoolean("available"); } catch (Exception ignore) {}
                    dto.setAvailable(available);
                    dto.setAmenities(new ArrayList<>());
                    return dto;
                }
        );
        // Load amenities for each (ignore if table missing)
        for (RoomDTO dto : list) {
            try {
                List<String> am = jdbcTemplate.query(
                        "SELECT name FROM room_amenities WHERE room_id = ?",
                        ps -> ps.setLong(1, dto.getId()),
                        (rs, rn) -> rs.getString("name")
                );
                dto.setAmenities(am);
            } catch (Exception ignored) {
                dto.setAmenities(new ArrayList<>());
            }
        }
        return list;
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDTO> getById(@PathVariable("id") Long id) {
        ensureSchema();
        List<RoomDTO> res = jdbcTemplate.query(
                "SELECT * FROM salles WHERE id = ?",
                ps -> ps.setLong(1, id),
                (rs, rowNum) -> {
                    RoomDTO dto = new RoomDTO();
                    dto.setId(rs.getLong("id"));
                    try { dto.setName(rs.getString("nom")); } catch (Exception ignore) {
                        try { dto.setName(rs.getString("name")); } catch (Exception ignored) { dto.setName("Room " + rs.getLong("id")); }
                    }
                    try { dto.setCapacity(rs.getInt("capacite")); } catch (Exception ignore) {
                        try { dto.setCapacity(rs.getInt("capacity")); } catch (Exception ignored) { dto.setCapacity(0); }
                    }
                    try { dto.setLocation(rs.getString("location")); } catch (Exception ignore) { dto.setLocation(null); }
                    try { dto.setImageUrl(rs.getString("image_url")); } catch (Exception ignore) { dto.setImageUrl(null); }
                    boolean available = true;
                    try { available = (rs.getObject("available") == null) ? true : rs.getBoolean("available"); } catch (Exception ignore) {}
                    dto.setAvailable(available);
                    return dto;
                }
        );
        if (res.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        RoomDTO dto = res.get(0);
        try {
            List<String> am = jdbcTemplate.query(
                    "SELECT name FROM room_amenities WHERE room_id = ?",
                    ps -> ps.setLong(1, id),
                    (rs, rn) -> rs.getString("name")
            );
            dto.setAmenities(am);
        } catch (Exception ignored) {
            dto.setAmenities(new ArrayList<>());
        }
        return ResponseEntity.ok(dto);
    }

    public static class RoomRequest {
        public String name;
        public String location;
        public Integer capacity;
        public List<String> amenities;
        public String imageUrl;
        public Boolean available;
    }

    @PostMapping
    public ResponseEntity<RoomDTO> create(@RequestBody RoomRequest req) {
        if (req == null || req.name == null || req.location == null || req.capacity == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        ensureSchema();
        // Insert with reliable generated key retrieval on the same connection
        Long id = jdbcTemplate.execute((java.sql.Connection con) -> {
            try (PreparedStatement ps = con.prepareStatement(
                    "INSERT INTO salles(nom, capacite, location, image_url, available) VALUES (?,?,?,?,?)",
                    java.sql.Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, req.name);
                ps.setInt(2, req.capacity);
                ps.setString(3, req.location);
                ps.setString(4, req.imageUrl);
                ps.setBoolean(5, req.available == null ? true : req.available);
                ps.executeUpdate();
                try (java.sql.ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs != null && rs.next()) return rs.getLong(1);
                }
            }
            try (java.sql.Statement st = con.createStatement();
                 java.sql.ResultSet rs = st.executeQuery("SELECT LAST_INSERT_ID()")) {
                if (rs.next()) return rs.getLong(1);
            }
            return null;
        });
        // Insert amenities if provided
        if (id != null && req.amenities != null) {
            for (String a : req.amenities) {
                if (a == null || a.trim().isEmpty()) continue;
                try {
                    jdbcTemplate.update("INSERT INTO room_amenities(room_id, name) VALUES (?,?)", id, a.trim());
                } catch (Exception ignore) { /* join table may be missing; schema initializer should have created it */ }
            }
        }
        // Build DTO
        RoomDTO dto = new RoomDTO();
        if (id != null) dto.setId(id);
        dto.setName(req.name);
        dto.setLocation(req.location);
        dto.setCapacity(req.capacity);
        dto.setAmenities(req.amenities);
        dto.setImageUrl(req.imageUrl);
        dto.setAvailable(req.available == null ? true : req.available);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomDTO> update(@PathVariable("id") Long id, @RequestBody RoomRequest req) {
        ensureSchema();
        // Check exists
        Integer exists = jdbcTemplate.queryForObject("SELECT COUNT(1) FROM salles WHERE id=?", new Object[]{id}, Integer.class);
        if (exists == null || exists == 0) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        // Build dynamic update
        List<Object> params = new ArrayList<>();
        StringBuilder sql = new StringBuilder("UPDATE salles SET ");
        boolean first = true;
        if (req.name != null) { sql.append(first?"":" ,").append("nom=?"); params.add(req.name); first=false; }
        if (req.capacity != null) { sql.append(first?"":" ,").append("capacite=?"); params.add(req.capacity); first=false; }
        if (req.location != null) { sql.append(first?"":" ,").append("location=?"); params.add(req.location); first=false; }
        if (req.imageUrl != null) { sql.append(first?"":" ,").append("image_url=?"); params.add(req.imageUrl); first=false; }
        if (req.available != null) { sql.append(first?"":" ,").append("available=?"); params.add(req.available); first=false; }
        sql.append(" WHERE id=?"); params.add(id);
        if (!first) jdbcTemplate.update(sql.toString(), params.toArray());
        // Update amenities if provided
        if (req.amenities != null) {
            jdbcTemplate.update("DELETE FROM room_amenities WHERE room_id=?", id);
            for (String a : req.amenities) {
                if (a == null || a.trim().isEmpty()) continue;
                jdbcTemplate.update("INSERT INTO room_amenities(room_id, name) VALUES (?,?)", id, a.trim());
            }
        }
        return getById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        ensureSchema();
        Integer exists = jdbcTemplate.queryForObject("SELECT COUNT(1) FROM salles WHERE id=?", new Object[]{id}, Integer.class);
        if (exists == null || exists == 0) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        jdbcTemplate.update("DELETE FROM room_amenities WHERE room_id=?", id);
        jdbcTemplate.update("DELETE FROM salles WHERE id=?", id);
        return ResponseEntity.noContent().build();
    }
}
