package com.ewaste.ewastebackend.dto;

import java.util.Map;

// Yeh DTO charts ke liye data hold karega
public class RequestStats {

    private long totalRequests;
    private Map<String, Long> statusCounts; // e.g., {"PENDING": 5, "COMPLETED": 10}
    private Map<String, Long> deviceTypeCounts; // e.g., {"Laptop": 8, "Mobile": 7}

    // Constructors, Getters, and Setters
    public RequestStats() {
    }

    public RequestStats(long totalRequests, Map<String, Long> statusCounts, Map<String, Long> deviceTypeCounts) {
        this.totalRequests = totalRequests;
        this.statusCounts = statusCounts;
        this.deviceTypeCounts = deviceTypeCounts;
    }

    public long getTotalRequests() { return totalRequests; }
    public void setTotalRequests(long totalRequests) { this.totalRequests = totalRequests; }
    public Map<String, Long> getStatusCounts() { return statusCounts; }
    public void setStatusCounts(Map<String, Long> statusCounts) { this.statusCounts = statusCounts; }
    public Map<String, Long> getDeviceTypeCounts() { return deviceTypeCounts; }
    public void setDeviceTypeCounts(Map<String, Long> deviceTypeCounts) { this.deviceTypeCounts = deviceTypeCounts; }
}