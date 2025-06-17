package org.ash.webapp_backend.dto;

import lombok.Data;

/**
 * 用户注册请求 DTO（Data Transfer Object）
 *
 * 用于接收客户端提交的用户注册信息，包括用户名和密码。
 * 通常用于 POST /auth/register 接口。
 *
 * 字段说明：
 * - username：用户名，必须唯一
 * - password：用户密码，建议服务层中加密存储
 *
 * 示例 JSON 请求体：
 * {
 *   "username": "ash",
 *   "password": "securePassword123"
 * }
 *
 * 可在后续扩展其他字段，如 email、验证码、昵称等。
 *
 * @author Ash
 * @date 2025/6/14 03:57
 */
@Data
public class RegisterRequest {
    /** 用户名 */
    private String username;

    /** 密码（建议在服务层进行加密） */
    private String password;
}
