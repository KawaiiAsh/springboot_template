package org.ash.webapp_backend.config;

import jakarta.annotation.Resource;
import org.ash.webapp_backend.filter.JwtAuthenticationFilter;
import org.ash.webapp_backend.handler.CustomAccessDeniedHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 配置类，用于配置系统的安全认证策略。
 *
 * 核心功能：
 * - 配置访问路径的权限控制（如登录、注册、API 文档放行）
 * - 注册 JWT 认证过滤器，实现无状态令牌认证机制
 * - 禁用默认的表单登录和 HTTP Basic 验证方式
 * - 关闭 CSRF 防护（因使用 JWT，不依赖 Cookie）
 * - 配置无状态 Session 策略
 * - 提供密码加密器（BCrypt）与认证管理器 Bean
 *
 * 适用于前后端分离、基于 JWT 的身份认证方案。
 * 注意：如果将来需要支持角色权限、RBAC 等功能，可以在 `authorizeHttpRequests` 中扩展配置。
 *
 * 示例用途：
 * - 登录成功后获取 JWT，前端将其附加在请求头中
 * - 后续请求通过 JwtAuthenticationFilter 解析并验证 Token
 * - 所有未放行的请求路径将被认证保护
 *
 * @author Ash
 * @date 2025/6/13
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Resource
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    /**
     * 配置 Spring Security 核心过滤链。
     *
     * 主要作用：
     * - 关闭 CSRF、表单登录、Basic 登录（仅使用 Token）
     * - 定义哪些路径可以匿名访问，哪些需要认证
     * - 设置 Session 策略为无状态（不存储登录状态）
     * - 注入自定义 JWT 认证过滤器，用于替代默认登录验证逻辑
     *
     * @param http HttpSecurity 对象，由 Spring 注入
     * @return 配置完成的 SecurityFilterChain
     * @throws Exception 配置异常
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                // ✅ 开启跨域支持，使用 CorsConfig 中的配置
                .cors(Customizer.withDefaults())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/auth/login",
                                "/auth/logout",
                                "/auth/register",
                                "/auth/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )

                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .exceptionHandling(exception -> exception
                        .accessDeniedHandler(customAccessDeniedHandler)
                )
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * 获取认证管理器，用于处理登录认证逻辑。
     *
     * Spring Boot 会自动根据配置生成一个 AuthenticationManager，
     * 通过 AuthenticationConfiguration 注入即可。
     *
     * @param config Spring Security 提供的认证配置对象
     * @return AuthenticationManager 实例
     * @throws Exception 初始化失败
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * 配置密码加密方式。
     *
     * 使用 BCryptPasswordEncoder 可确保密码存储时加盐加密，提升安全性。
     * 登录时也会通过该加密器验证密码匹配。
     *
     * @return BCryptPasswordEncoder 实例
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 注册自定义的 JWT 认证过滤器。
     *
     * 该过滤器在用户每次请求时检查 Authorization 头中的 JWT，
     * 并完成用户认证上下文的构建。
     *
     * @return JwtAuthenticationFilter 实例
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }
}
