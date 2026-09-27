package com.Backend.Backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * Invoked by Spring Security when an authenticated user's role doesn't
 * permit the requested action (e.g. a CUSTOMER hitting a PROVIDER-only
 * endpoint). See RestAuthenticationEntryPoint for why the JSON is built
 * by hand instead of via an injected ObjectMapper.
 */
@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                        AccessDeniedException accessDeniedException) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        String json = """
                {"timestamp":"%s","status":403,"error":"Forbidden","message":"You do not have permission to perform this action","path":"%s"}""".formatted(
                LocalDateTime.now(), escape(request.getRequestURI()));

        response.getWriter().write(json);
    }

    private String escape(String value) {
        return value == null ? "" : value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
