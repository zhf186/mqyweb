package com.manqiyou.app.cms.exception;

/**
 * 并发修改异常
 * Requirements: 15.6
 */
public class ConcurrentModificationException extends RuntimeException {
    
    public ConcurrentModificationException(String message) {
        super(message);
    }
    
    public ConcurrentModificationException(String message, Throwable cause) {
        super(message, cause);
    }
}
