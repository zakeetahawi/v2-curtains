# 🔒 Security Implementation Guide

**Version**: 2.0.0  
**Last Updated**: 2025-01-09  
**Status**: Week 2 - Security Hardening Complete

---

## 📋 Overview

This document outlines all security measures implemented in the ERP System to protect against common vulnerabilities and attacks.

---

## 🛡️ Security Features Implemented

### 1. **Rate Limiting** ✅

**Purpose**: Prevent DDoS attacks and API abuse

**Implementation**:
- Location: `internal/middleware/rate_limiter.go`
- Limit: 100 requests per minute per client
- Client identification: IP address or User ID (if authenticated)
- Automatic cleanup of stale entries every 5 minutes

**Configuration**:
```go
rateLimiter := middleware.NewRateLimiter(100, 1*time.Minute)
router.Use(rateLimiter.Middleware())
```

**Testing**:
```bash
# Test rate limiting
curl -X GET http://localhost:8080/api/v1/customers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --parallel --parallel-max 150
```

**Expected Behavior**:
- First 100 requests: HTTP 200
- Requests 101+: HTTP 429 (Too Many Requests)
- After 1 minute: Counter resets

---

### 2. **Security Headers** ✅

**Purpose**: Protect against clickjacking, XSS, and MIME sniffing

**Implementation**:
- Location: `internal/middleware/security_headers.go`
- Applied to all HTTP responses

**Headers Added**:

| Header | Value | Protection |
|--------|-------|------------|
| `X-Frame-Options` | `DENY` | Prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME sniffing |
| `X-XSS-Protection` | `1; mode=block` | Enables browser XSS filter |
| `Content-Security-Policy` | See below | Restricts resource loading |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer info |
| `Permissions-Policy` | Restricts browser features | Disables unnecessary APIs |

**Content Security Policy (CSP)**:
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net;
style-src 'self' 'unsafe-inline' cdn.jsdelivr.net fonts.googleapis.com;
font-src 'self' fonts.gstatic.com cdn.jsdelivr.net;
img-src 'self' data: https:;
connect-src 'self';
frame-ancestors 'none';
```

**Verification**:
```bash
curl -I http://localhost:8080/health
# Check response headers
```

---

### 3. **Input Sanitization** ✅

**Purpose**: Prevent XSS, SQL injection, and code injection attacks

**Implementation**:
- Location: `internal/middleware/sanitizer.go`
- Applied to: Query parameters, form data, JSON bodies

**Features**:
- HTML escaping of special characters
- Null byte removal
- Whitespace trimming
- Recursive sanitization of nested structures

**Functions**:
```go
// Sanitize string
sanitized := sanitizeString(userInput)

// Sanitize struct
middleware.SanitizeStruct(&customerRequest)

// Sanitize map
middleware.SanitizeMap(jsonData)
```

**Example**:
```go
// Input: "<script>alert('xss')</script>"
// Output: "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
```

---

### 4. **Audit Logging** ✅

**Purpose**: Track all API activities for security monitoring and compliance

**Implementation**:
- Location: `internal/middleware/audit_logger.go`
- Database Table: `audit_logs`

**Logged Information**:
- User ID (if authenticated)
- Action (CREATE, UPDATE, DELETE, READ)
- Resource (customers, orders, etc.)
- HTTP Method (GET, POST, PUT, DELETE)
- Request path
- IP address
- User agent
- Request ID (for tracing)
- HTTP status code
- Request duration
- Error details (if any)

**Schema**:
```sql
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(50),
    resource VARCHAR(100),
    method VARCHAR(10),
    path VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    request_id VARCHAR(100),
    status INTEGER,
    details TEXT,
    created_at DATETIME
);
```

**Query Examples**:
```sql
-- Get all actions by user
SELECT * FROM audit_logs WHERE user_id = 1 ORDER BY created_at DESC;

-- Get failed requests
SELECT * FROM audit_logs WHERE status >= 400 ORDER BY created_at DESC;

-- Get DELETE operations
SELECT * FROM audit_logs WHERE action = 'DELETE' ORDER BY created_at DESC;

-- Get suspicious activity (multiple failures from same IP)
SELECT ip_address, COUNT(*) as failures
FROM audit_logs
WHERE status >= 400 AND created_at > datetime('now', '-1 hour')
GROUP BY ip_address
HAVING failures > 10;
```

---

### 5. **Login Attempt Tracking** 🔄 (In Progress)

**Purpose**: Detect brute force attacks and suspicious login activity

**Implementation**:
- Location: `internal/repositories/security_repository.go`
- Database Table: `login_attempts`

**Features**:
- Track all login attempts (success and failure)
- Store: email, IP, timestamp, success status, fail reason
- Query recent failures by email or IP
- Automatic cleanup of old records

**Schema**:
```sql
CREATE TABLE login_attempts (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255),
    ip_address VARCHAR(45),
    success BOOLEAN,
    fail_reason VARCHAR(255),
    user_agent VARCHAR(255),
    attempted_at DATETIME
);
```

**Usage**:
```go
// Record failed attempt
repo.RecordAttempt(email, ipAddress, userAgent, false, "Invalid password")

// Check recent failures
count, _ := repo.GetRecentFailedAttempts(email, 15) // last 15 minutes
if count >= 5 {
    // Trigger lockout
}
```

---

### 6. **Account Lockout** 🔄 (In Progress)

**Purpose**: Protect against brute force attacks

**Configuration**:
- Max failed attempts: 5 (within 15 minutes)
- Lockout duration: 30 minutes
- Auto-unlock after duration expires

**Implementation**:
- Location: `internal/repositories/security_repository.go`
- Database Table: `account_lockouts`

**Schema**:
```sql
CREATE TABLE account_lockouts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    email VARCHAR(255),
    locked_at DATETIME,
    unlocked_at DATETIME,
    failed_count INTEGER,
    lock_reason VARCHAR(255),
    is_active BOOLEAN
);
```

**Functions**:
```go
// Lock account
repo.LockAccount(userID, email, "Too many failed attempts", 5)

// Check if locked
isLocked, _ := repo.IsAccountLocked(email)

// Unlock account
repo.UnlockAccount(email)

// Auto-unlock expired lockouts
repo.AutoUnlockExpiredLockouts(30 * time.Minute)
```

---

### 7. **Password Security** ✅

**Current Implementation**:
- Algorithm: bcrypt
- Cost factor: 12 (default)
- Minimum length: 8 characters (enforced in frontend)

**Hashing**:
```go
hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
```

**Verification**:
```go
err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
```

---

### 8. **JWT Token Security** ✅

**Access Token**:
- Expiration: 15 minutes
- Contains: User ID, Email, Role ID
- Algorithm: HS256

**Refresh Token**:
- Expiration: 7 days
- Contains: User ID
- Purpose: Obtain new access token without re-login

**Token Rotation** 🔄 (Planned):
- Automatic refresh token rotation on use
- Invalidate old refresh tokens
- Detect token reuse (security breach indicator)

---

## 🔍 Security Testing

### Manual Testing

#### 1. Test Rate Limiting
```bash
# Send 150 requests in quick succession
for i in {1..150}; do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/health
done
```

#### 2. Test XSS Protection
```bash
# Try to inject script
curl -X POST http://localhost:8080/api/v1/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<script>alert(\"xss\")</script>",
    "email": "test@test.com"
  }'
```

#### 3. Test SQL Injection
```bash
# Try SQL injection in search
curl "http://localhost:8080/api/v1/customers?search=' OR '1'='1"
```

#### 4. Test Security Headers
```bash
curl -I http://localhost:8080/health | grep "X-Frame-Options"
curl -I http://localhost:8080/health | grep "X-Content-Type-Options"
curl -I http://localhost:8080/health | grep "Content-Security-Policy"
```

### Automated Testing

```bash
# Run security tests
cd backend
go test ./tests/middleware/... -v

# Expected: All tests pass
```

---

## 📊 Security Monitoring

### Audit Log Queries

#### Recent Activity
```sql
SELECT 
    user_id,
    action,
    resource,
    created_at
FROM audit_logs
ORDER BY created_at DESC
LIMIT 100;
```

#### Failed Requests
```sql
SELECT 
    path,
    method,
    status,
    ip_address,
    created_at
FROM audit_logs
WHERE status >= 400
ORDER BY created_at DESC;
```

#### Suspicious Patterns
```sql
-- Multiple failures from same IP
SELECT 
    ip_address,
    COUNT(*) as failure_count,
    MIN(created_at) as first_attempt,
    MAX(created_at) as last_attempt
FROM audit_logs
WHERE status = 401
  AND created_at > datetime('now', '-1 hour')
GROUP BY ip_address
HAVING failure_count > 5;
```

---

## 🚨 Security Incident Response

### Account Compromise
1. Check audit logs for user activity
2. Immediately lock account
3. Invalidate all active tokens
4. Force password reset
5. Notify user via email

### Brute Force Attack Detected
1. Check login attempts table
2. Lock affected accounts
3. Block IP address (if pattern detected)
4. Monitor for continued attempts
5. Alert system administrator

### SQL Injection Attempt
1. Log attempt in audit_logs
2. Block IP address
3. Review and patch vulnerable endpoint
4. Check database for unauthorized changes

---

## ✅ Security Checklist

- [x] Rate limiting implemented (100 req/min)
- [x] Security headers configured
- [x] Input sanitization on all inputs
- [x] Audit logging for all requests
- [x] Password hashing with bcrypt
- [x] JWT token authentication
- [x] CORS configuration
- [ ] CSRF protection (planned)
- [ ] Refresh token rotation (planned)
- [ ] 2FA (optional, future)
- [ ] IP whitelist/blacklist (future)
- [ ] WAF integration (future)

---

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Content Security Policy](https://content-security-policy.com/)
- [bcrypt](https://github.com/golang/crypto/tree/master/bcrypt)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Maintained By**: Development Team  
**Review Frequency**: Quarterly  
**Next Review**: 2025-04-09
