package org.ash.template.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 用户实体类，对应数据库中的 users 表
 *
 * 用于存储系统用户的基础信息，包含用户名、密码、启用状态等。
 * 通常配合 Spring Security 和 JPA 实现登录认证与权限控制。
 *
 * 表结构示例（对应数据库）：
 * - id：主键，自增
 * - username：用户名，唯一
 * - password：密码，加密存储
 * - enabled：账户是否启用
 *
 * 注：密码字段应使用 BCrypt 等方式加密后存储。
 *
 * @author Ash
 * @date 2025/6/13 01:49
 */
@Entity
@Table(name = "users") // 指定数据库表名为 users
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    /** 用户 ID，主键，自增 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 用户名，不能为空且唯一 */
    @Column(nullable = false, unique = true)
    private String username;

    /** 加密后的密码，不能为空 */
    @Column(nullable = false)
    private String password;

    /** 用户是否启用，true 表示启用，false 表示禁用 */
    private boolean enabled;
}
