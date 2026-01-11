package com.ewaste.ewaste.service;

import com.ewaste.ewaste.model.RequestStatus;
import com.ewaste.ewaste.model.User;
import com.ewaste.ewaste.repository.EwasteRequestRepository;
import com.ewaste.ewaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final UserRepository userRepository;
    private final EwasteRequestRepository ewasteRequestRepository;
    private final PdfGenerationService pdfGenerationService;

    private static final int REQUIRED_SUBMISSIONS = 10;

    public ByteArrayInputStream generateCertificateForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check qualification (using long now)
        long completedSubmissions = ewasteRequestRepository.countByUserIdAndStatus(user.getId(), RequestStatus.COMPLETED);

        // Logic: Must be Greater Than or Equal to 10
        if (completedSubmissions < REQUIRED_SUBMISSIONS) {
            throw new RuntimeException("You do not qualify for a certificate yet. You need " +
                    REQUIRED_SUBMISSIONS + " completed submissions. You have " + completedSubmissions + ".");
        }

        // User qualifies, generate the PDF
        return pdfGenerationService.generateAppreciationCertificate(user);
    }
}