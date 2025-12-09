package repositories

import (
	"erp-system/internal/domain"
	"time"

	"gorm.io/gorm"
)

// RefreshTokenRepository handles refresh token database operations
type RefreshTokenRepository struct {
	db *gorm.DB
}

// NewRefreshTokenRepository creates a new refresh token repository
func NewRefreshTokenRepository(db *gorm.DB) *RefreshTokenRepository {
	return &RefreshTokenRepository{db: db}
}

// Create stores a new refresh token
func (r *RefreshTokenRepository) Create(token *domain.RefreshToken) error {
	return r.db.Create(token).Error
}

// FindByToken retrieves a refresh token by its value
func (r *RefreshTokenRepository) FindByToken(token string) (*domain.RefreshToken, error) {
	var refreshToken domain.RefreshToken
	err := r.db.Preload("User").Where("token = ?", token).First(&refreshToken).Error
	return &refreshToken, err
}

// IsValid checks if a token is valid (not revoked and not expired)
func (r *RefreshTokenRepository) IsValid(token string) (bool, error) {
	var refreshToken domain.RefreshToken
	err := r.db.Where("token = ? AND revoked = ? AND expires_at > ?", token, false, time.Now()).
		First(&refreshToken).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return false, nil
		}
		return false, err
	}

	return true, nil
}

// Revoke marks a token as revoked
func (r *RefreshTokenRepository) Revoke(token string, replacedBy *string) error {
	now := time.Now()
	updates := map[string]interface{}{
		"revoked":     true,
		"revoked_at":  &now,
		"replaced_by": replacedBy,
	}

	return r.db.Model(&domain.RefreshToken{}).
		Where("token = ?", token).
		Updates(updates).Error
}

// RevokeAllForUser revokes all tokens for a specific user
func (r *RefreshTokenRepository) RevokeAllForUser(userID uint) error {
	now := time.Now()
	return r.db.Model(&domain.RefreshToken{}).
		Where("user_id = ? AND revoked = ?", userID, false).
		Updates(map[string]interface{}{
			"revoked":    true,
			"revoked_at": &now,
		}).Error
}

// DeleteExpired removes expired tokens (cleanup job)
func (r *RefreshTokenRepository) DeleteExpired() error {
	return r.db.Where("expires_at < ?", time.Now()).
		Delete(&domain.RefreshToken{}).Error
}

// DeleteRevoked removes revoked tokens older than specified duration
func (r *RefreshTokenRepository) DeleteRevoked(olderThan time.Duration) error {
	cutoff := time.Now().Add(-olderThan)
	return r.db.Where("revoked = ? AND revoked_at < ?", true, cutoff).
		Delete(&domain.RefreshToken{}).Error
}

// CountActiveTokensForUser returns the number of active tokens for a user
func (r *RefreshTokenRepository) CountActiveTokensForUser(userID uint) (int64, error) {
	var count int64
	err := r.db.Model(&domain.RefreshToken{}).
		Where("user_id = ? AND revoked = ? AND expires_at > ?", userID, false, time.Now()).
		Count(&count).Error
	return count, err
}

// GetActiveTokensForUser retrieves all active tokens for a user
func (r *RefreshTokenRepository) GetActiveTokensForUser(userID uint) ([]domain.RefreshToken, error) {
	var tokens []domain.RefreshToken
	err := r.db.Where("user_id = ? AND revoked = ? AND expires_at > ?", userID, false, time.Now()).
		Order("created_at DESC").
		Find(&tokens).Error
	return tokens, err
}

// DetectTokenReuse checks if a revoked token is being reused (security breach)
func (r *RefreshTokenRepository) DetectTokenReuse(token string) (bool, *domain.RefreshToken, error) {
	var refreshToken domain.RefreshToken
	err := r.db.Where("token = ? AND revoked = ?", token, true).First(&refreshToken).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return false, nil, nil
		}
		return false, nil, err
	}

	// Token found and is revoked - this is reuse attempt
	return true, &refreshToken, nil
}
