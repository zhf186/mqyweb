package com.manqiyou.app.cms.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.manqiyou.app.cms.annotation.OperationLog;
import com.manqiyou.app.cms.mapper.OperationLogMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

/**
 * Aspect for recording operation logs for methods annotated with @OperationLog.
 */
@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class OperationLogAspect {

    private final OperationLogMapper operationLogMapper;
    private final ObjectMapper objectMapper;

    @Around("@annotation(com.manqiyou.app.cms.annotation.OperationLog)")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        OperationLog annotation = method.getAnnotation(OperationLog.class);

        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes != null ? attributes.getRequest() : null;

        Map<String, Object> beforeData = new HashMap<>();
        beforeData.put("args", joinPoint.getArgs());

        Object result = null;
        Exception exception = null;
        try {
            result = joinPoint.proceed();
            return result;
        } catch (Exception e) {
            exception = e;
            throw e;
        } finally {
            try {
                recordLog(annotation, request, beforeData, result, exception);
            } catch (Exception e) {
                log.error("Failed to record operation log", e);
            }
        }
    }

    private void recordLog(OperationLog annotation,
                           HttpServletRequest request,
                           Map<String, Object> beforeData,
                           Object result,
                           Exception exception) {
        try {
            com.manqiyou.app.cms.entity.OperationLog logEntity = new com.manqiyou.app.cms.entity.OperationLog();
            logEntity.setAction(annotation.action());
            logEntity.setResourceType(annotation.resourceType());
            logEntity.setResourceId(extractResourceId(result));
            logEntity.setUserId(resolveCurrentUserId());

            Map<String, Object> details = new HashMap<>();
            details.put("description", annotation.description());
            details.put("before", beforeData);
            if (result != null) {
                details.put("after", result);
            }
            if (exception != null) {
                details.put("error", exception.getMessage());
            }
            logEntity.setDetails(objectMapper.writeValueAsString(details));

            if (request != null) {
                logEntity.setIpAddress(getClientIp(request));
                logEntity.setUserAgent(request.getHeader("User-Agent"));
            }

            operationLogMapper.insert(logEntity);
            log.debug("Operation log recorded: {} {} {}", annotation.action(), annotation.resourceType(), logEntity.getResourceId());
        } catch (Exception e) {
            log.error("Error recording operation log", e);
        }
    }

    private Long resolveCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Long userId) {
            return userId;
        }
        if (principal instanceof String userIdText && !userIdText.isBlank()) {
            try {
                return Long.parseLong(userIdText);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }

        String name = authentication.getName();
        if (name != null && !name.isBlank()) {
            try {
                return Long.parseLong(name);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }

        return null;
    }

    private Long extractResourceId(Object result) {
        if (result == null) {
            return null;
        }

        try {
            if (result.getClass().getSimpleName().equals("Result")) {
                Method getDataMethod = result.getClass().getMethod("getData");
                Object data = getDataMethod.invoke(result);
                if (data != null) {
                    Method getIdMethod = data.getClass().getMethod("getId");
                    Object id = getIdMethod.invoke(data);
                    if (id instanceof Long longId) {
                        return longId;
                    }
                    if (id instanceof String stringId) {
                        return Long.parseLong(stringId);
                    }
                }
            }
        } catch (Exception e) {
            log.debug("Could not extract resource id from operation result", e);
        }

        return null;
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
}