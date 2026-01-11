// backend/ewaste/src/main/java/com/ewaste/ewaste/controller/EwasteRequestController.java
package com.ewaste.ewaste.controller;

import com.ewaste.ewaste.dto.AdminRequestView;
import com.ewaste.ewaste.dto.EwasteRequestView;
import com.ewaste.ewaste.model.*;
import com.ewaste.ewaste.repository.EwasteRequestRepository;
import com.ewaste.ewaste.repository.PickupPersonRepository;
import com.ewaste.ewaste.repository.UserRepository;
import com.ewaste.ewaste.service.EmailService; // Import EmailService
import com.ewaste.ewaste.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin
@RequiredArgsConstructor
public class EwasteRequestController {
    private final EwasteRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final PickupPersonRepository pickupPersonRepository;
    private final EmailService emailService; // Inject EmailService

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createRequest(
            @RequestParam(value = "images", required = false) MultipartFile[] files,
            @RequestParam Map<String, String> params,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        EwasteRequest request = new EwasteRequest();
        request.setUser(user);
        request.setDeviceType(params.get("deviceType"));
        request.setBrand(params.get("brand"));
        request.setModel(params.get("model"));
        request.setConditionStatus(ConditionStatus.valueOf(params.get("condition")));
        request.setQuantity(Integer.parseInt(params.get("quantity")));
        request.setPickupAddress(params.get("pickupAddress"));
        request.setRemarks(params.get("remarks"));

        if (files != null) {
            List<String> fileUrls = Arrays.stream(files)
                    .map(fileStorageService::storeFile)
                    .collect(Collectors.toList());
            request.setImageUrls(String.join(",", fileUrls));
        }
        requestRepository.save(request);
        return ResponseEntity.ok("Request submitted successfully");
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserRequests(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        List<EwasteRequest> requests = requestRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<EwasteRequestView> dtos = requests.stream()
                .map(EwasteRequestView::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping
    public ResponseEntity<?> getAllRequests() {
        List<EwasteRequest> requests = requestRepository.findAllByOrderByCreatedAtDesc();
        List<AdminRequestView> dtos = requests.stream()
                .map(AdminRequestView::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        EwasteRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        RequestStatus newStatus = RequestStatus.valueOf(payload.get("status"));
        request.setStatus(newStatus);

        if (payload.containsKey("rejectionReason")) {
            request.setRejectionReason(payload.get("rejectionReason"));
        }

        requestRepository.save(request);

        // --- EMAIL TRIGGER LOGIC ---
        if (newStatus == RequestStatus.APPROVED) {
            try {
                User user = request.getUser();
                emailService.sendApprovalEmail(
                        user.getEmail(),
                        user.getName(),
                        request.getId(),
                        request.getDeviceType()
                );
            } catch (Exception e) {
                System.err.println("Failed to send approval email: " + e.getMessage());
                // We catch the error so the status update doesn't fail if email fails
            }
        }
        // ---------------------------

        return ResponseEntity.ok("Status updated");
    }

    @PutMapping("/{id}/schedule")
    public ResponseEntity<?> schedulePickup(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        EwasteRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        String dateStr = (String) payload.get("pickupDate");
        if (dateStr != null) {
            request.setScheduledPickupDate(Instant.parse(dateStr));
        }

        Object personIdObj = payload.get("pickupPersonId");
        if (personIdObj != null) {
            Long personId = Long.valueOf(personIdObj.toString());
            PickupPerson person = pickupPersonRepository.findById(personId)
                    .orElseThrow(() -> new RuntimeException("Pickup Person not found"));
            request.setAssignedPickupPerson(person);
        }

        request.setStatus(RequestStatus.SCHEDULED);

        requestRepository.save(request);
        return ResponseEntity.ok("Pickup scheduled successfully");
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        List<Map<String, Object>> deviceStats = requestRepository.countRequestsByDeviceType();
        Map<String, Long> statsMap = new HashMap<>();

        for (Map<String, Object> row : deviceStats) {
            String device = (String) row.get("device");

            // FIX: Handle null keys from database to prevent JSON crash
            if (device == null) {
                device = "Unknown";
            }

            statsMap.put(device, (Long) row.get("count"));
        }
        return ResponseEntity.ok(Map.of("deviceTypeStats", statsMap));
    }
}