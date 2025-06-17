package org.ash.webapp_backend.service.impl;

import jakarta.annotation.Resource;
import org.ash.webapp_backend.common.Result;
import org.ash.webapp_backend.dto.LoginRequest;
import org.ash.webapp_backend.dto.RegisterRequest;
import org.ash.webapp_backend.entity.User;
import org.ash.webapp_backend.repository.UserRepository;
import org.ash.webapp_backend.service.AuthService;
import org.ash.webapp_backend.utils.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;

/**
 * 用户认证服务实现类
 *
 * 提供注册、登录、登出等认证相关业务逻辑。
 * - 登录时校验用户名密码，生成 JWT，并缓存到 Redis 中。
 * - 登出时清除 Redis 中对应的 Token。
 * - 注册时校验用户名是否唯一，并持久化新用户。
 *
 * 本类配合 AuthController 与 JwtAuthenticationFilter 使用，构成完整的身份认证机制。
 *
 * 日志用途：
 * - 记录用户操作轨迹
 * - 追踪失败原因与异常
 *
 * @author Ash
 * @date 2025/6/13
 */
@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Resource
    private UserRepository userRepository;

    @Resource
    private JwtUtil jwtUtil;

    @Resource
    private PasswordEncoder passwordEncoder;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    /**
     * 用户登录处理逻辑
     *
     * @param request 登录请求参数（用户名 + 密码）
     * @return 登录成功返回 JWT Token，失败返回错误信息
     */
    @Override
    public Result<String> login(LoginRequest request) {
        String username = request.getUsername();
        log.info("🔐 登录请求收到，用户名: {}", username);

        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            log.warn("❌ 用户不存在：{}", username);
            return Result.error("用户名或密码错误");
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("❌ 密码不匹配，用户名: {}", username);
            return Result.error("用户名或密码错误");
        }

        // 成功登录
        Map<String, String> claims = Map.of("role", user.getRole());
        String token = jwtUtil.generateToken(username, claims);
        redisTemplate.opsForValue().set("login:token:" + username, token, Duration.ofHours(1));
        log.info("✅ 用户登录成功，用户名: {}，Token 已写入 Redis", username);
        log.debug("🔑 Token 内容: {}", token);

        return Result.success(token);
    }

    /**
     * 用户登出逻辑
     * 从 Redis 删除 Token
     *
     * @param token 前端传来的 JWT
     */
    @Override
    public void logout(String token) {
        try {
            String username = jwtUtil.getUsername(token);
            redisTemplate.delete("login:token:" + username);
            log.info("👋 用户登出，用户名: {}", username);
        } catch (Exception e) {
            log.error("⚠️ 登出失败，Token 解析异常: {}", e.getMessage());
        }
    }

    /**
     * 用户注册逻辑
     *
     * @param request 注册请求参数
     * @return 成功或失败结果
     */
    @Override
    public Result<Void> register(RegisterRequest request) {
        String username = request.getUsername();
        log.info("📝 注册请求收到，用户名: {}", username);

        if (userRepository.findByUsername(username).isPresent()) {
            log.warn("❌ 用户名已存在：{}", username);
            return Result.error("用户名已存在");
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole("USER");
        userRepository.save(newUser);

        log.info("✅ 用户注册成功：{}", username);
        return Result.success();
    }
}
