package org.ash.webapp_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis 配置类，用于定义 RedisTemplate 的 Bean。
 *
 * 该配置将 Redis 的 key 和 value 的序列化方式统一设置为字符串序列化器（StringRedisSerializer），
 * 避免默认使用 JDK 序列化导致的可读性差和兼容性问题。
 *
 * 本类主要用于简化 Redis 操作并提高数据可读性，适用于处理简单的字符串键值对缓存。
 *
 * 如果你需要处理更复杂的对象（如 JSON），可以将序列化器改为 Jackson 等。
 *
 * 示例用途：
 * redisTemplate.opsForValue().set("key", "value");
 * String value = redisTemplate.opsForValue().get("key");
 *
 * @author Ash
 * @date 2025/6/13 02:52
 */
@Configuration
public class RedisConfig {

    /**
     * 配置 RedisTemplate Bean，指定 key 和 value 使用 String 序列化方式
     *
     * @param connectionFactory Redis 连接工厂，由 Spring Boot 自动注入
     * @return 配置完成的 RedisTemplate 实例
     */
    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // 创建字符串序列化器，用于 key 和 value
        StringRedisSerializer stringSerializer = new StringRedisSerializer();

        // 设置 key、value 和 hash 的 key、value 的序列化器
        template.setKeySerializer(stringSerializer);          // 设置 key 序列化方式
        template.setValueSerializer(stringSerializer);        // 设置 value 序列化方式
        template.setHashKeySerializer(stringSerializer);      // 设置 hash key 序列化方式
        template.setHashValueSerializer(stringSerializer);    // 设置 hash value 序列化方式

        // 初始化 RedisTemplate 设置
        template.afterPropertiesSet();
        return template;
    }
}
