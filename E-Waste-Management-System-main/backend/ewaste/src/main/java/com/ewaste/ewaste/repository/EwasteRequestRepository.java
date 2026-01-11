// src/main/java/com/ewaste/ewaste/repository/EwasteRequestRepository.java
package com.ewaste.ewaste.repository;

import com.ewaste.ewaste.model.EwasteRequest;
import com.ewaste.ewaste.model.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Map;

public interface EwasteRequestRepository extends JpaRepository<EwasteRequest, Long> {
    List<EwasteRequest> findByUserId(Long userId);
    List<EwasteRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<EwasteRequest> findByAssignedPickupPersonId(Long pickupPersonId);
    List<EwasteRequest> findAllByOrderByCreatedAtDesc();

    // Used for the actual certificate generation check
    long countByUserIdAndStatus(Long userId, RequestStatus status);

    // Admin Dashboard Stats
    @Query("SELECT e.status as status, COUNT(e) as count FROM EwasteRequest e GROUP BY e.status")
    List<Map<String, Object>> countRequestsByStatus();

    // FIX: Added aliases "as status" and "as count" so frontend can read the JSON correctly
    @Query("SELECT e.status as status, COUNT(e) as count FROM EwasteRequest e WHERE e.user.id = :userId GROUP BY e.status")
    List<Map<String, Object>> countUserRequestsByStatus(@Param("userId") Long userId);

    // Device Stats
    @Query("SELECT e.deviceType as device, COUNT(e) as count FROM EwasteRequest e GROUP BY e.deviceType")
    List<Map<String, Object>> countRequestsByDeviceType();
}