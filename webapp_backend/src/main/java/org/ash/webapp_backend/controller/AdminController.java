package org.ash.webapp_backend.controller;

import org.ash.webapp_backend.common.Result;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Ash
 * @date 2025/6/15 03:26
 * @description AdminController（TODO: 类功能简述）
 */
@RestController
@RequestMapping("/admin")
public class AdminController {

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/data")
    public Result<String> onlyAdmin() {
        return Result.success("只有管理员能访问");
    }

}
