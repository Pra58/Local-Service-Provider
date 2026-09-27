package com.Backend.Backend.security;

import com.Backend.Backend.entity.User;
import com.Backend.Backend.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

/**
 * Runs once per request. If a valid "Authorization: Bearer <token>" header
 * is present, resolves the corresponding user from the database and places
 * an Authentication into the SecurityContext, with the User entity itself
 * as the principal (so controllers can use @AuthenticationPrincipal User).
 * Anything wrong with the token simply results in no authentication being
 * set - the request continues unauthenticated, and Spring Security's
 * authorization rules decide from there whether that's acceptable.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String HEADER_NAME = "Authorization";
    private static final String PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader(HEADER_NAME);

        if (header != null && header.startsWith(PREFIX)) {
            String token = header.substring(PREFIX.length());
            try {
                if (jwtUtil.isTokenValid(token)) {
                    Long userId = jwtUtil.getUserIdFromToken(token);
                    Optional<User> userOpt = userRepository.findById(userId);

                    if (userOpt.isPresent() && SecurityContextHolder.getContext().getAuthentication() == null) {
                        User user = userOpt.get();
                        List<GrantedAuthority> authorities =
                                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(user, null, authorities);
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            } catch (JwtException | IllegalArgumentException ex) {
                // Invalid/expired token - leave the context unauthenticated
                // and let downstream authorization rules / entry point react.
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
