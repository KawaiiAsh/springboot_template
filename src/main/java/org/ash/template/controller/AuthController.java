package org.ash.template.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.ash.template.common.Result;
import org.ash.template.dto.LoginRequest;
import org.ash.template.dto.RegisterRequest;
import org.ash.template.service.AuthService;
import org.ash.template.utils.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

/**
 * 用户认证控制器
 *
 * 提供登录和登出接口，支持 JWT + Redis 实现的前后端分离无状态登录机制。
 * 登录成功后返回 JWT token，登出时从 Redis 中移除 token，实现 token 失效。
 *
 * 接口说明：
 * - POST /auth/login：用户登录，返回 JWT token
 * - POST /auth/logout：用户登出，清除 Redis 中的 token
 * - POST /auth/register：用户注册
 *
 * 日志用途：
 * - 追踪用户登录、登出和注册行为
 * - 有助于调试和生产环境问题排查
 *
 * @author Ash
 * @date 2025/6/13
 */
@Tag(name = "用户认证模块")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Resource
    private AuthService authService;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private JwtUtil jwtUtil;

    /**
     * 登录接口
     *
     * @param request 登录请求参数（用户名、密码）
     * @return 返回 JWT token 包装在 Result 中
     */
    @Operation(summary = "登录接口")
    @PostMapping("/login")
    public Result<String> login(@RequestBody LoginRequest request) {
        log.info("✅ 登录请求进入，用户名: {}", request.getUsername());
        return authService.login(request);
    }

    /**
     * 登出接口
     *
     * 从请求头中解析 JWT，提取用户名，并清除 Redis 中对应的登录 token，
     * 使其失效，实现登出效果。
     *
     * @param request HTTP 请求对象，用于获取 Authorization 头
     * @return 成功响应
     */
    @Operation(summary = "登出接口")
    @PostMapping("/logout")
    public Result<Void> logout(HttpServletRequest request) {
        log.info("✅ 收到登出请求");
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            log.debug("🔐 提取到 Token: {}", token);
            authService.logout(token); // 把逻辑交给服务层处理
        } else {
            log.warn("⚠️ 请求头中未找到合法的 Authorization 信息");
        }
        return Result.success();
    }

    /**
     * 注册接口
     *
     * 接收用户注册信息并委托给服务层处理。
     *
     * @param request 注册请求参数（用户名、密码等）
     * @return 注册成功响应
     */
    @Operation(summary = "注册接口")
    @PostMapping("/register")
    public Result<Void> register(@RequestBody RegisterRequest request) {
        log.info("✅ 收到注册请求，用户名: {}", request.getUsername());
        return authService.register(request);
    }
}
