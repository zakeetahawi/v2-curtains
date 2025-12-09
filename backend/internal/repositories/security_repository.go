package repositories

import (
	"erp-system/internal/domain"
	"time"

	"gorm.io/gorm"
)

// LoginAttemptRepository handles login attempt tracking
type LoginAttemptRepository struct {
	db *gorm.DB
}

// NewLoginAttemptRepository creates a new login attempt repository
func NewLoginAttemptRepository(db *gorm.DB) *LoginAttemptRepository {
	return &LoginAttemptRepository{db: db}
}

// RecordAttempt records a login attempt
func (r *LoginAttemptRepository) RecordAttempt(email, ipAddress, userAgent string, success bool, failReason string) error {
	attempt := domain.LoginAttempt{
		Email:       email,
		IPAddress:   ipAddress,
		Success:     success,
		FailReason:  failReason,
		UserAgent:   userAgent,
		AttemptedAt: time.Now(),
	}

	return r.db.Create(&attempt).Error
}

// GetRecentFailedAttempts returns failed login attempts for an email in the last N minutes
func (r *LoginAttemptRepository) GetRecentFailedAttempts(email string, minutes int) (int64, error) {
	var count int64
	cutoffTime := time.Now().Add(-time.Duration(minutes) * time.Minute)

	err := r.db.Model(&domain.LoginAttempt{}).
		Where("email = ? AND success = ? AND attempted_at > ?", email, false, cutoffTime).
		Count(&count).Error

	return count, err
}

// GetRecentFailedAttemptsByIP returns failed attempts from an IP in the last N minutes
func (r *LoginAttemptRepository) GetRecentFailedAttemptsByIP(ipAddress string, minutes int) (int64, error) {
	var count int64
	cutoffTime := time.Now().Add(-time.Duration(minutes) * time.Minute)

	err := r.db.Model(&domain.LoginAttempt{}).
		Where("ip_address = ? AND success = ? AND attempted_at > ?", ipAddress, false, cutoffTime).
		Count(&count).Error

	return count, err
}

// AccountLockoutRepository handles account lockout management
type AccountLockoutRepository struct {
	db *gorm.DB
}

// NewAccountLockoutRepository creates a new account lockout repository
func NewAccountLockoutRepository(db *gorm.DB) *AccountLockoutRepository {
	return &AccountLockoutRepository{db: db}
}

// LockAccount locks a user account
func (r *AccountLockoutRepository) LockAccount(userID uint, email, reason string, failedCount int) error {
	lockout := domain.AccountLockout{
		UserID:      userID,
		Email:       email,
		LockedAt:    time.Now(),
		FailedCount: failedCount,
		LockReason:  reason,
		IsActive:    true,
	}

	return r.db.Create(&lockout).Error
}

// IsAccountLocked checks if an account is currently locked
func (r *AccountLockoutRepository) IsAccountLocked(email string) (bool, error) {
	var count int64
	err := r.db.Model(&domain.AccountLockout{}).
		Where("email = ? AND is_active = ? AND (unlocked_at IS NULL OR unlocked_at > ?)",
			email, true, time.Now()).
		Count(&count).Error

	return count > 0, err
}

// UnlockAccount unlocks a user account
func (r *AccountLockoutRepository) UnlockAccount(email string) error {
	now := time.Now()
	return r.db.Model(&domain.AccountLockout{}).
		Where("email = ? AND is_active = ?", email, true).
		Updates(map[string]interface{}{
			"is_active":   false,
			"unlocked_at": now,
		}).Error
}

// GetActiveLockout returns the active lockout for an email
func (r *AccountLockoutRepository) GetActiveLockout(email string) (*domain.AccountLockout, error) {
	var lockout domain.AccountLockout
	err := r.db.Where("email = ? AND is_active = ?", email, true).
		Order("locked_at DESC").
		First(&lockout).Error

	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}

	return &lockout, err
}

// AutoUnlockExpiredLockouts unlocks accounts after specified duration
func (r *AccountLockoutRepository) AutoUnlockExpiredLockouts(lockoutDuration time.Duration) error {
	cutoffTime := time.Now().Add(-lockoutDuration)
	now := time.Now()

	return r.db.Model(&domain.AccountLockout{}).
		Where("is_active = ? AND locked_at < ?", true, cutoffTime).
		Updates(map[string]interface{}{
			"is_active":   false,
			"unlocked_at": now,
		}).Error
}
