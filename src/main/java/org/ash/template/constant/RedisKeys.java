package org.ash.template.constant;

/**
 * Redis 键名常量类，用于统一管理项目中使用的 Redis Key 前缀与格式。
 *
 * 目的：
 * - 避免硬编码字符串，提高代码可维护性与可读性
 * - 统一 Redis 命名规范，避免 key 冲突
 * - 按功能模块划分前缀，便于分类管理和清理缓存
 *
 * 命名规范示例：
 * - login:token:{username}       登录令牌
 * - user:session:{userId}       用户会话信息
 * - sms:code:{phone}            手机验证码
 *
 * 推荐配合 TTL 机制使用，并支持按前缀删除缓存。
 * 如需扩展更多功能模块（如：rate limit、cache 等），请继续在此类中添加静态方法。
 *
 * 示例用途：
 * ```java
 * String key = RedisKeys.loginToken("ash");
 * redisTemplate.opsForValue().set(key, token, Duration.ofHours(2));
 * ```
 *
 * @author Ash
 * @date 2025/6/13
 */
public class RedisKeys {

    /** 登录 Token 前缀：login:token:{username} */
    private static final String LOGIN_TOKEN_PREFIX = "login:token:";

    /**
     * 获取用户登录 Token 的 Redis Key
     *
     * @param username 用户名（唯一标识）
     * @return 完整 Redis Key，例如：login:token:ash
     */
    public static String loginToken(String username) {
        return LOGIN_TOKEN_PREFIX + username;
    }

    /**
     * 获取用户会话信息的 Redis Key
     *
     * @param userId 用户 ID
     * @return Redis Key，例如：user:session:10086
     */
    public static String userSession(String userId) {
        return "user:session:" + userId;
    }

    /**
     * 获取短信验证码的 Redis Key
     *
     * @param phone 手机号
     * @return Redis Key，例如：sms:code:13812345678
     */
    public static String smsCode(String phone) {
        return "sms:code:" + phone;
    }
}
