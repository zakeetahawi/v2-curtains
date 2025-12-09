# 🚀 Week 2 Features - Quick Reference

## التاريخ: 9 ديسمبر 2025

---

## 🔐 CSRF Protection

### How to Use

**Frontend (GET request to get token):**
```javascript
// 1. Get CSRF token
const response = await fetch('/api/v1/customers', {
  credentials: 'include' // Important for cookies
});
const csrfToken = response.headers.get('X-CSRF-Token');
```

**Frontend (POST/PUT/DELETE with token):**
```javascript
// 2. Use token in requests
await fetch('/api/v1/customers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  credentials: 'include',
  body: JSON.stringify({ name: 'Customer Name' })
});
```

**Configuration:**
```go
// In cmd/server/main.go
csrfProtection := middleware.NewCSRFProtection(1 * time.Hour)
router.Use(csrfProtection.Middleware())
```

---

## 🔄 Token Rotation

### How to Use

**1. Login (get initial tokens):**
```bash
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": {...},
    "access_token": "eyJhbGc...",   # 15 minutes
    "refresh_token": "eyJhbGc..."   # 7 days
  }
}
```

**2. Refresh tokens (when access token expires):**
```bash
POST /api/v1/auth/refresh
{
  "refresh_token": "eyJhbGc..."
}

Response:
{
  "success": true,
  "data": {
    "user": {...},
    "access_token": "NEW_TOKEN",      # New 15-min token
    "refresh_token": "NEW_REFRESH"    # New 7-day token (old one revoked)
  }
}
```

**3. Logout single device:**
```bash
POST /api/v1/auth/revoke
{
  "refresh_token": "eyJhbGc..."
}
```

**4. Logout all devices:**
```bash
POST /api/v1/auth/logout-all
Authorization: Bearer <access_token>
```

### Security Features

**Token Reuse Detection:**
- If someone tries to reuse an already-rotated refresh token
- System detects this as a security breach
- Automatically revokes ALL user tokens
- User must login again

**Replacement Chain:**
- Each refresh creates new token pair
- Old refresh token marked as revoked
- `replaced_by` field tracks the chain
- Helps forensic analysis

---

## 📊 Database Tables

### refresh_tokens
```sql
CREATE TABLE refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    expires_at DATETIME NOT NULL,
    revoked BOOLEAN DEFAULT 0,
    replaced_by TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at DATETIME,
    revoked_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_revoked ON refresh_tokens(revoked);
```

---

## 🧪 Testing

### Run All Tests
```bash
cd backend
go test ./tests/... -v
```

### Run Specific Test Suite
```bash
# CSRF tests only
go test ./tests/middleware/csrf_test.go -v

# Token rotation tests only
go test ./tests/unit/token_rotation_test.go -v
```

### Test Coverage
```bash
go test ./tests/... -cover
```

---

## 🔧 Configuration

### Environment Variables (Optional)
```bash
# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-key-change-this-in-production

# Token Lifetimes
ACCESS_TOKEN_DURATION=15m
REFRESH_TOKEN_DURATION=168h  # 7 days

# CSRF Protection
CSRF_TOKEN_TTL=1h

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=1m
```

---

## 📝 Error Messages

### CSRF Errors
- `"رمز CSRF مفقود"` - CSRF token missing
- `"رمز CSRF غير صالح"` - CSRF token invalid
- `"رمز CSRF منتهي الصلاحية"` - CSRF token expired

### Token Rotation Errors
- `"رمز التحديث غير صالح أو منتهي الصلاحية"` - Invalid or expired refresh token
- `"تم اكتشاف محاولة إعادة استخدام رمز ملغي"` - Token reuse detected (security breach)
- `"الحساب غير مفعل"` - User account is inactive
- `"فشل في حفظ رمز التحديث"` - Failed to save refresh token

---

## 🎯 Best Practices

### Frontend
1. **Store tokens securely**
   - Access token: Memory only (don't persist)
   - Refresh token: HttpOnly cookie (preferred) or secure storage

2. **Handle token refresh**
   - Detect 401 Unauthorized
   - Call /refresh endpoint
   - Retry original request with new token

3. **CSRF tokens**
   - Get on first GET request
   - Reuse for same session
   - Get new one if you get 403

### Backend
1. **Monitor security events**
   - Check audit_logs for suspicious activity
   - Alert on multiple failed login attempts
   - Alert on token reuse detection

2. **Cleanup jobs**
   - Run token cleanup daily (already implemented)
   - Clean expired tokens (>7 days old)
   - Clean revoked tokens (>30 days old)

3. **Rate limiting**
   - Monitor rate limit hits
   - Adjust limits based on usage
   - Consider IP whitelisting for known clients

---

## 🚨 Security Incidents Response

### Token Reuse Detected
1. **Automatic**: All user tokens revoked
2. **Manual**: Check audit logs for user activity
3. **Notify**: Alert security team
4. **Review**: Check IP addresses and user agents

### Multiple Failed Logins
1. **Automatic**: Account locked after 5 failures
2. **Manual**: Review login attempts in audit logs
3. **Notify**: Email user about lockout
4. **Unlock**: After 15 minutes or manual unlock

---

## 📞 Support & Troubleshooting

### Common Issues

**Q: CSRF token keeps expiring**
- A: Default TTL is 1 hour. Increase in configuration if needed.

**Q: Refresh token returns "invalid"**
- A: Token may be expired (7 days), revoked, or reused. User needs to login again.

**Q: Getting 429 Too Many Requests**
- A: Rate limit hit (100 req/min). Wait or increase limit.

**Q: Account locked after failed logins**
- A: Wait 15 minutes for auto-unlock or contact admin.

---

## 📚 Documentation Files

- `WEEK2_COMPLETE.md` - Full Week 2 report
- `WEEK2_STATUS_FINAL.md` - Final status summary
- `WEEK2_SUMMARY.txt` - Quick text summary
- `WEEK2_QUICK_REFERENCE.md` - This file

---

## ✅ Verification Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Enable HTTPS only (no HTTP)
- [ ] Configure CORS for your frontend domain
- [ ] Set up monitoring alerts
- [ ] Test token rotation flow
- [ ] Test CSRF protection
- [ ] Test rate limiting
- [ ] Test account lockout
- [ ] Review audit logs setup
- [ ] Test security breach response
- [ ] Backup database before deployment

---

**الحالة**: ✅ **جاهز للإنتاج**  
**التاريخ**: 9 ديسمبر 2025
