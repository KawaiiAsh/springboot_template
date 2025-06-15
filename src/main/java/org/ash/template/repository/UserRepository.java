package org.ash.template.repository;

import org.ash.template.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 用户持久层接口
 *
 * 继承自 Spring Data JPA 提供的 {@link JpaRepository}，用于操作 User 实体的数据访问逻辑。
 *
 * 提供了基础的 CRUD 操作（如 save、findById、deleteById 等）及自定义查询方法。
 *
 * 常用于服务层（Service）调用进行用户信息的查询与持久化。
 *
 * 示例用途：
 * - userRepository.findById(1L);
 * - userRepository.findByUsername("admin");
 *
 * @author Ash
 * @date 2025/6/13 01:50
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 根据用户名查找用户
     *
     * @param username 用户名
     * @return 匹配的用户对象（Optional 包装，避免空指针）
     */
    Optional<User> findByUsername(String username);
}
