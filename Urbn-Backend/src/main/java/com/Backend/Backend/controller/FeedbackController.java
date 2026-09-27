package com.Backend.Backend.controller;

import com.Backend.Backend.dto.FeedbackRequest;
import com.Backend.Backend.dto.FeedbackResponse;
import com.Backend.Backend.entity.User;
import com.Backend.Backend.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<FeedbackResponse> addFeedback(@AuthenticationPrincipal User currentUser,
                                                          @Valid @RequestBody FeedbackRequest request) {
        FeedbackResponse response = feedbackService.addFeedback(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /** Public: feedback/ratings for a given service. */
    @GetMapping("/service/{serviceId}")
    public List<FeedbackResponse> getFeedbackForService(@PathVariable Long serviceId) {
        return feedbackService.getFeedbackForService(serviceId);
    }

    @GetMapping("/{id}")
    public FeedbackResponse getFeedback(@PathVariable Long id) {
        return feedbackService.getFeedbackById(id);
    }
}
