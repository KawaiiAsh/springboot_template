package org.ash.webapp_backend.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;

/**
 * JWT 工具类
 *
 * 提供生成、解析和校验 JWT Token 的方法。
 * 使用 HMAC256 算法和固定密钥进行签名，适用于无状态认证机制。
 *
 * 注意：真实项目中应将密钥和过期时间从配置文件中读取，避免硬编码。
 *
 * 使用库：auth0/java-jwt
 *
 * 示例用途：
 * - 生成 token：jwtUtil.generateToken("admin")
 * - 解析 token：jwtUtil.getUsername(token)
 * - 判断是否过期：jwtUtil.isTokenExpired(token)
 *
 * @author Ash
 * @date 2025/6/13
 */
@Component
@Getter
@Setter
public class JwtUtil {

    /** 从配置中读取 JWT 密钥 */
    @Value("${jwt.secret}")
    private String secret;

    /** 从配置中读取过期时间（单位：毫秒） */
    @Value("${jwt.expiration}")
    private long expiration;

    private Algorithm algorithm;

    @PostConstruct
    public void init() {
        this.algorithm = Algorithm.HMAC256(secret);
    }

    /**
     * 生成带扩展信息的 Token（如用户 ID、角色）
     *
     * @param username 用户名
     * @param claims 自定义 Claims，例如 Map.of("role", "admin")
     * @return JWT Token 字符串
     */
    public String generateToken(String username, Map<String, String> claims) {
        var builder = JWT.create()
                .withSubject(username)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expiration));

        // 添加自定义 Claims
        claims.forEach(builder::withClaim);

        return builder.sign(algorithm);
    }

    /**
     * 简化版本，仅含用户名的 Token
     */
    public String generateToken(String username) {
        return generateToken(username, Map.of());
    }

    /**
     * 解析并验证 Token
     */
    public DecodedJWT decodeToken(String token) {
        return JWT.require(algorithm).build().verify(token);
    }

    /**
     * 提取用户名（subject）
     */
    public String getUsername(String token) {
        return decodeToken(token).getSubject();
    }

    /**
     * 判断是否过期
     */
    public boolean isTokenExpired(String token) {
        return decodeToken(token).getExpiresAt().before(new Date());
    }

    /**
     * 获取指定 Claim 的值（例如：role、userId）
     */
    public String getClaim(String token, String claimName) {
        return decodeToken(token).getClaim(claimName).asString();
    }
}