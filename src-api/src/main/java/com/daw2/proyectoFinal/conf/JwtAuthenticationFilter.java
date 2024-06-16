package com.daw2.proyectoFinal.conf;

import java.io.IOException;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.daw2.proyectoFinal.services.JwtService;
import com.daw2.proyectoFinal.services.UsuarioService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * Filtro para autenticación basada en tokens JWT.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /**
     * Inyección del servicio de JWT.
     */
    @Autowired
    private JwtService jwtService;

    /**
     * Inyección del servicio de usuario.
     */
    @Autowired
    private UsuarioService usuarioService;

    /**
     * Método que realiza la lógica de filtrado para la autenticación basada en tokens JWT.
     *
     * @param request     El objeto HttpServletRequest.
     * @param response    El objeto HttpServletResponse.
     * @param filterChain El objeto FilterChain.
     * @throws ServletException Si ocurre un error durante el filtrado.
     * @throws IOException      Si ocurre un error de I/O durante el filtrado.
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        response.setCharacterEncoding("UTF-8");

        if (StringUtils.isEmpty(authHeader) || !StringUtils.startsWith(authHeader, "Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Authorization header está vacío o no comienza con Bearer.");
            return;
        }

        jwt = authHeader.substring(7);

        if (StringUtils.isEmpty(jwt)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token está vacío.");
            return;
        }

        try {
            userEmail = jwtService.extractUserName(jwt);
        } catch (ExpiredJwtException e) {
            // Token caducado
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token ha caducado.");
            return;
        } catch (JwtException e) {
            // Token incorrecto
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token no es válido.");
            return;
        }

        if (StringUtils.isNotEmpty(userEmail) && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = usuarioService.userDetailsService().loadUserByUsername(userEmail);
            if (jwtService.isTokenValid(jwt, userDetails)) {
                SecurityContext context = SecurityContextHolder.createEmptyContext();
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
                        null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                context.setAuthentication(authToken);
                SecurityContextHolder.setContext(context);
            }
        }

        filterChain.doFilter(request, response);
    }
}
