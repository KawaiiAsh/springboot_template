package org.ash.template.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 通用返回结果类，用于封装接口响应数据
 * @param <T> 返回的数据类型
 *
 * 提供多种静态方法用于生成标准的响应格式，包括成功和失败的情况。
 * 通常配合统一响应结构的 API 使用。
 *
 * 示例用途：
 * Result.success(data); // 成功返回数据
 * Result.error("操作失败"); // 返回自定义错误信息
 *
 * @author Ash
 * @date 2025/6/13 01:54
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {

    /** 状态码，例如：200 表示成功，500 表示服务器错误 */
    private int code;

    /** 返回信息，通常用于描述操作结果，例如："操作成功"、"参数错误" */
    private String message;

    /** 泛型数据，接口实际返回的数据内容 */
    private T data;

    /**
     * 成功响应（无返回数据）
     * @param <T> 数据类型
     * @return 标准成功结果
     */
    public static <T> Result<T> success() {
        return new Result<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMessage(), null);
    }

    /**
     * 成功响应（包含返回数据）
     * @param data 实际返回的数据
     * @param <T> 数据类型
     * @return 标准成功结果，包含数据
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMessage(), data);
    }

    /**
     * 错误响应（自定义错误信息）
     * @param message 错误描述
     * @param <T> 数据类型
     * @return 标准错误结果，状态码为默认错误码
     */
    public static <T> Result<T> error(String message) {
        return new Result<>(ResultCode.ERROR.getCode(), message, null);
    }

    /**
     * 错误响应（指定错误码和错误信息）
     * @param code 错误状态码
     * @param message 错误信息
     * @param <T> 数据类型
     * @return 自定义错误结果
     */
    public static <T> Result<T> error(int code, String message) {
        return new Result<>(code, message, null);
    }

    /**
     * 错误响应（基于枚举类型 ResultCode）
     * @param resultCode 枚举中定义的错误码和信息
     * @param <T> 数据类型
     * @return 枚举错误结果
     */
    public static <T> Result<T> error(ResultCode resultCode) {
        return new Result<>(resultCode.getCode(), resultCode.getMessage(), null);
    }
}
