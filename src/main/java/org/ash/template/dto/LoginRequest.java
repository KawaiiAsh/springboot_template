package org.ash.template.dto;

import lombok.Data;

/**
 * 用户登录请求参数对象
 *
 * 封装前端传来的登录信息（用户名和密码），用于登录接口接收参数。
 * 可扩展字段如验证码、设备信息等。
 *
 * 示例 JSON 请求体：
 * {
 *   "username": "admin",
 *   "password": "123456"
 * }
 *
 * 该类通常用于与控制器层（Controller）配合处理用户登录逻辑。
 *
 * @author Ash
 * @date 2025/6/13 01:57
 */
@Data
public class LoginRequest {

    /** 用户名 */
    private String username;

    /** 密码（明文，通过接口加密或 HTTPS 保护传输） */
    private String password;
}
