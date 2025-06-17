package org.ash.webapp_backend.common;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 通用返回码枚举，用于统一管理后端接口的状态码及其对应的信息
 *
 * 每个枚举值包含两个字段：
 * - code：整数类型的状态码（例如：200 表示成功，500 表示服务器错误）
 * - message：该状态码对应的描述信息
 *
 * 通常配合 {@link Result} 类一起使用，用于标准化接口响应结构。
 *
 * 示例用途：
 * Result.error(ResultCode.NOT_FOUND); // 返回 404 错误
 *
 * 可根据业务需要扩展更多状态码（如业务异常码：1001、1002 等）
 *
 * @author Ash
 * @date 2025/6/13
 */
@Getter
@AllArgsConstructor
public enum ResultCode {

    /** 操作成功 */
    SUCCESS(200, "操作成功"),

    /** 服务器内部错误 */
    ERROR(500, "服务器内部错误"),

    /** 请求资源不存在 */
    NOT_FOUND(404, "资源未找到"),

    /** 用户未授权（未登录或权限失效） */
    UNAUTHORIZED(401, "未授权访问"),

    /** 权限不足，禁止访问 */
    FORBIDDEN(403, "无权限访问"),

    /** 请求参数有误，客户端错误 */
    BAD_REQUEST(400, "请求参数错误");

    /** 状态码 */
    private final int code;

    /** 状态码对应的描述信息 */
    private final String message;
}
