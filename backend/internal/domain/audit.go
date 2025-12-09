package domain

import "time"

// AuditLog represents a security audit log entry
type AuditLog struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	UserID    uint      `json:"user_id"`
	Action    string    `gorm:"size:50;not null" json:"action"`   // CREATE, UPDATE, DELETE, READ, LOGIN, LOGOUT
	Resource  string    `gorm:"size:100" json:"resource"`         // customers, orders, products, etc.
	Method    string    `gorm:"size:10" json:"method"`            // GET, POST, PUT, DELETE
	Path      string    `gorm:"size:255" json:"path"`             // API endpoint path
	IPAddress string    `gorm:"size:45" json:"ip_address"`        // IPv4 or IPv6
	UserAgent string    `gorm:"size:255" json:"user_agent"`       // Browser/client info
	RequestID string    `gorm:"size:100;index" json:"request_id"` // Unique request identifier
	Status    int       `json:"status"`                           // HTTP status code
	Details   string    `gorm:"type:text" json:"details"`         // JSON with additional details
	CreatedAt time.Time `gorm:"index" json:"created_at"`
}

// LoginAttempt tracks login attempts for security monitoring
type LoginAttempt struct {
	ID          uint      `gorm:"primarykey" json:"id"`
	Email       string    `gorm:"size:255;index" json:"email"`
	IPAddress   string    `gorm:"size:45;index" json:"ip_address"`
	Success     bool      `json:"success"`
	FailReason  string    `gorm:"size:255" json:"fail_reason"`
	UserAgent   string    `gorm:"size:255" json:"user_agent"`
	AttemptedAt time.Time `gorm:"index" json:"attempted_at"`
}

// AccountLockout tracks locked accounts due to failed login attempts
type AccountLockout struct {
	ID          uint       `gorm:"primarykey" json:"id"`
	UserID      uint       `gorm:"index" json:"user_id"`
	Email       string     `gorm:"size:255;index" json:"email"`
	LockedAt    time.Time  `json:"locked_at"`
	UnlockedAt  *time.Time `json:"unlocked_at"`
	FailedCount int        `json:"failed_count"`
	LockReason  string     `gorm:"size:255" json:"lock_reason"`
	IsActive    bool       `gorm:"default:true;index" json:"is_active"`
}
