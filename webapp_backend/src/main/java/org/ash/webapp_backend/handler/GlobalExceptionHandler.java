package org.ash.webapp_backend.handler;

import lombok.extern.slf4j.Slf4j;
import org.ash.webapp_backend.common.Result;
import org.ash.webapp_backend.common.ResultCode;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器
 * 用于捕获 controller 层抛出的异常，统一返回结构
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("服务器异常", e);
        return Result.error(ResultCode.ERROR);
    }

    @ExceptionHandler(AuthenticationException.class)
    public Result<Void> handleAuthenticationException(AuthenticationException e) {
        log.warn("未登录或认证失败：{}", e.getMessage());
        return Result.error(ResultCode.UNAUTHORIZED);
    }

}
