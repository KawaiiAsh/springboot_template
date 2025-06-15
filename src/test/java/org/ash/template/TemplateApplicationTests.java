package org.ash.template;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class TemplateApplicationTests {

    @Test
    void contextLoads() {
        String rawPassword = "123456";
        String hashed = "$2a$10$76jk4vx0mfFMMoEUtJgXi.l7RHgwfaLGFzhBkFJJHqI7VDDw4WaV6"; // 替换成你数据库查出来的

        PasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println(encoder.matches(rawPassword, hashed));
    }

}
