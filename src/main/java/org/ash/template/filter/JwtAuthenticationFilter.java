package org.ash.template.filter;

import jakarta.annotation.Resource;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.ash.template.utils.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT 认证过滤器
 *
 * 拦截每个 HTTP 请求：
 * - 检查请求头中是否携带有效 JWT Token
 * - 校验 Redis 中是否存在该 Token（防止登出后复用）
 * - 验证通过后，设置 Spring Security 的认证上下文
 *
 * 特性：
 * - 每个请求仅执行一次（继承 OncePerRequestFilter）
 * - 忽略登录/登出接口
 * - 不处理权限，只负责认证
 *
 * ⚠ 如需支持 Token 续期或黑名单机制，请在此扩展逻辑。
 *
 * @author Ash
 * @date 2025/6/13
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Resource
    private JwtUtil jwtUtil;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String path = request.getServletPath();
        log.info("🛡 JWT 过滤器触发，URI: {}", path);

        // 跳过无需认证的路径
        if (path.equals("/auth/login") || path.equals("/auth/logout")) {
            log.warn("➡ 跳过 JWT 校验路径: {}", path);
            filterChain.doFilter(request, response);
            return;
        }

        // 读取 Authorization 请求头
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                log.debug("🔍 解析 Token: {}", token);
                String username = jwtUtil.getUsername(token);
                log.debug("👤 解析出用户名: {}", username);

                String redisToken = redisTemplate.opsForValue().get("login:token:" + username);
                if (redisToken == null || !redisToken.equals(token)) {
                    log.warn("❌ Token 被撤销或过期，用户名: {}", username);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"error\": \"Token 已失效，请重新登录\"}");
                    return;
                }

                // 验证通过，设置认证信息
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.info("✅ 用户认证通过，用户名: {}", username);

            } catch (Exception e) {
                log.error("💥 Token 验证失败: {}", e.getMessage());
            }
        } else {
            log.debug("🕳 未携带 Bearer Token，跳过认证处理");
        }

        // 放行请求
        filterChain.doFilter(request, response);
    }
}
