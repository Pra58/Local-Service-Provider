package com.Backend.Backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * Invoked by Spring Security itself (not a controller) whenever an
 * unauthenticated request hits a protected endpoint - e.g. a missing or
 * invalid JWT. The JSON body is built manually rather than through a
 * Jackson ObjectMapper, since this class lives below the Spring MVC
 * message-converter layer and shouldn't take on a direct dependency on
 * whichever Jackson major version happens to be configured.
 */
@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                          AuthenticationException authException) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        String json = """
                {"timestamp":"%s","status":401,"error":"Unauthorized","message":"Authentication is required to access this resource","path":"%s"}""".formatted(
                LocalDateTime.now(), escape(request.getRequestURI()));

        response.getWriter().write(json);
    }

    private String escape(String value) {
        return value == null ? "" : value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
