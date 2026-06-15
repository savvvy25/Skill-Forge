package com.skillforge.exception;

public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException(String message) {
        super(message);
    }

    public DuplicateEmailException(String email, Throwable cause) {
        super(String.format("An account with email '%s' already exists", email), cause);
    }
}
