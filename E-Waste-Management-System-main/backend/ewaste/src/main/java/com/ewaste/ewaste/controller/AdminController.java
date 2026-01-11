// backend/ewaste/src/main/java/com/ewaste/ewaste/controller/AdminController.java
package com.ewaste.ewaste.controller;

import com.ewaste.ewaste.dto.PickupPersonRegister;
import com.ewaste.ewaste.model.PickupPerson;
import com.ewaste.ewaste.model.User;
import com.ewaste.ewaste.repository.UserRepository;
import com.ewaste.ewaste.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;
    private final com.ewaste.ewaste.repository.PickupPersonRepository pickupPersonRepository;
    private final com.ewaste.ewaste.repository.EwasteRequestRepository ewasteRequestRepository;

    @GetMapping("/dashboard-summary")
    public ResponseEntity<?> getDashboardSummary() {
        Map<String, Object> summary = new java.util.HashMap<>();
        summary.put("totalUsers", userRepository.count());
        summary.put("totalPickupPersons", pickupPersonRepository.count());
        summary.put("totalRequests", ewasteRequestRepository.count());
        summary.put("statusStats", ewasteRequestRepository.countRequestsByStatus());
        summary.put("deviceStats", ewasteRequestRepository.countRequestsByDeviceType());
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/pickup-persons")
    public ResponseEntity<?> getPickupPersons() {
        List<PickupPerson> persons = adminService.getAllPickupPersons();
        return ResponseEntity.ok(persons);
    }

    @PostMapping("/register-pickup-person")
    public ResponseEntity<?> registerPickupPerson(@RequestBody PickupPersonRegister request) {
        try {
            User savedUser = adminService.registerPickupPerson(request);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- USER MANAGEMENT ENDPOINTS ---

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // Toggle Status
    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String newStatus = payload.get("status");
            adminService.updateUserStatus(id, newStatus);
            return ResponseEntity.ok("User status updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Update User Details
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            User updatedUser = adminService.updateUser(id, updates);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}