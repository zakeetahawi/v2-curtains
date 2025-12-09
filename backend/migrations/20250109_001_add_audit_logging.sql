-- Migration: Add audit logging tables
-- Created: 2025-01-09
-- Description: Create tables for security audit logging, login attempts tracking, and account lockout

-- ===== Audit Logs Table =====
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action VARCHAR(50) NOT NULL,
    resource VARCHAR(100),
    method VARCHAR(10),
    path VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    request_id VARCHAR(100),
    status INTEGER,
    details TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_request_id ON audit_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource);

-- ===== Login Attempts Table =====
CREATE TABLE IF NOT EXISTS login_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    success BOOLEAN NOT NULL DEFAULT 0,
    fail_reason VARCHAR(255),
    user_agent VARCHAR(255),
    attempted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for login_attempts
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_attempted_at ON login_attempts(attempted_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_success ON login_attempts(success);

-- ===== Account Lockouts Table =====
CREATE TABLE IF NOT EXISTS account_lockouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL,
    locked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unlocked_at DATETIME,
    failed_count INTEGER NOT NULL DEFAULT 0,
    lock_reason VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for account_lockouts
CREATE INDEX IF NOT EXISTS idx_account_lockouts_user_id ON account_lockouts(user_id);
CREATE INDEX IF NOT EXISTS idx_account_lockouts_email ON account_lockouts(email);
CREATE INDEX IF NOT EXISTS idx_account_lockouts_is_active ON account_lockouts(is_active);
CREATE INDEX IF NOT EXISTS idx_account_lockouts_locked_at ON account_lockouts(locked_at);

-- ===== Comments =====
-- audit_logs: Tracks all API requests for security monitoring
-- login_attempts: Tracks all login attempts (successful and failed)
-- account_lockouts: Tracks temporarily locked accounts due to suspicious activity
