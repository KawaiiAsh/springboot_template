package org.ash.webapp_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.net.*;
import java.util.*;

@RestController
@RequestMapping("/monitor")
public class MonitorController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final List<Integer> portsToCheck = List.of(3000, 8080, 6379);

    @GetMapping("/status")
    public Map<String, Object> getSystemStatus() {
        Map<String, Object> result = new LinkedHashMap<>();

        // 1. 前端状态
        result.put("frontend", checkUrl("http://localhost:3000"));

        // 2. 后端状态
        result.put("backend", Map.of("status", "up", "latency", 0));

        // 3. 数据库状态
        try {
            long start = System.currentTimeMillis();
            jdbcTemplate.execute("SELECT 1");
            long latency = System.currentTimeMillis() - start;
            result.put("database", Map.of("status", "up", "latency", latency));
        } catch (Exception e) {
            result.put("database", Map.of("status", "down", "error", e.getMessage()));
        }

        // 4. Redis 状态
        try {
            long start = System.currentTimeMillis();
            String pong = redisTemplate.getConnectionFactory().getConnection().ping();
            long latency = System.currentTimeMillis() - start;
            result.put("redis", Map.of(
                    "status", "PONG".equalsIgnoreCase(pong) ? "up" : "down",
                    "latency", latency
            ));
        } catch (Exception e) {
            result.put("redis", Map.of("status", "down", "error", e.getMessage()));
        }

        // 5. 系统资源状态
        com.sun.management.OperatingSystemMXBean sys =
                (com.sun.management.OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();

        double cpuLoad = sys.getSystemCpuLoad(); // 0.0 - 1.0
        long totalMemory = sys.getTotalPhysicalMemorySize();
        long freeMemory = sys.getFreePhysicalMemorySize();
        long usedMemory = totalMemory - freeMemory;

        result.put("system", Map.of(
                "osName", sys.getName(),
                "cpuUsagePercent", (int) (cpuLoad * 100),
                "memoryUsagePercent", (int) (usedMemory * 100 / totalMemory),
                "usedMemoryMB", usedMemory / 1024 / 1024,
                "totalMemoryMB", totalMemory / 1024 / 1024
        ));

        // 6. 图表数据（当前值加扰动）
        result.put("cpuUsage", generateRecentList((int) (cpuLoad * 100)));
        result.put("memoryUsage", generateRecentList((int) (usedMemory * 100 / totalMemory)));

        // 7. 端口检测
        result.put("ports", checkPorts(portsToCheck));

        return result;
    }

    private Map<String, Object> checkUrl(String urlStr) {
        try {
            long start = System.currentTimeMillis();
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(1000);
            conn.connect();
            long latency = System.currentTimeMillis() - start;
            int code = conn.getResponseCode();

            return Map.of(
                    "status", (code >= 200 && code < 400) ? "up" : "warn",
                    "latency", latency
            );
        } catch (IOException e) {
            return Map.of("status", "down", "error", e.getMessage());
        }
    }

    private List<Map<String, Object>> checkPorts(List<Integer> ports) {
        List<Map<String, Object>> results = new ArrayList<>();
        for (int port : ports) {
            boolean open = isPortListening("127.0.0.1", port);
            results.add(Map.of(
                    "name", "Port " + port,
                    "port", port,
                    "status", open ? "🟢" : "🔴"
            ));
        }
        return results;
    }

    private boolean isPortListening(String host, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), 500);
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    private List<Integer> generateRecentList(int value) {
        Random rand = new Random();
        return List.of(
                Math.max(0, value - 5 + rand.nextInt(5)),
                Math.max(0, value - 3 + rand.nextInt(5)),
                value,
                Math.min(100, value + rand.nextInt(5)),
                Math.min(100, value + 2 + rand.nextInt(5))
        );
    }
}
