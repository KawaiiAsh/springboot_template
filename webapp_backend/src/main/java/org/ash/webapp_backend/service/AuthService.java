package org.ash.webapp_backend.service;

import org.ash.webapp_backend.common.Result;
import org.ash.webapp_backend.dto.LoginRequest;
import org.ash.webapp_backend.dto.RegisterRequest;

/**
 * 用户认证服务接口
 *
 * 定义用户身份认证相关操作，包括：
 * - 登录（验证用户名密码并生成 JWT）
 * - 登出（使 Token 失效）
 * - 注册（创建新用户）
 *
 * 该接口的具体实现由 {@link org.ash.webapp_backend.service.impl.AuthServiceImpl} 提供。
 * 通常由控制器层调用，用于实现登录认证逻辑的封装与解耦。
 *
 * 可扩展功能：Token 刷新、密码修改、验证码校验、多端登录等。
 *
 * 示例用法：
 * <pre>
 *   Result&lt;String&gt; result = authService.login(new LoginRequest("user", "pwd"));
 * </pre>
 *
 * @author Ash
 * @date 2025/6/13 01:58
 */
public interface AuthService {

    /**
     * 用户登录
     *
     * 验证用户名与密码是否匹配，认证通过后生成并返回 JWT Token。
     *
     * @param request 登录请求参数（用户名和密码）
     * @return 登录成功返回包含 JWT 的结果；失败返回错误信息
     */
    Result<String> login(LoginRequest request);

    /**
     * 用户登出
     *
     * 接收前端传入的 JWT Token，进行解析后从 Redis 中删除对应记录，
     * 实现 Token 主动失效。
     *
     * @param token 待注销的 JWT Token
     */
    void logout(String token);

    /**
     * 用户注册
     *
     * 校验用户名是否唯一，密码进行加密后保存用户信息。
     *
     * @param request 注册参数（用户名、密码）
     * @return 注册成功返回空结果，失败返回错误信息
     */
    Result<Void> register(RegisterRequest request);
}
