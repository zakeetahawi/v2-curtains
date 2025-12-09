package usecases

import (
	"errors"
	"time"

	"erp-system/internal/domain"
	"erp-system/internal/repositories"
	"erp-system/pkg/auth"
)

// TokenUseCase handles token refresh and rotation
type TokenUseCase struct {
	userRepo         repositories.UserRepository
	refreshTokenRepo *repositories.RefreshTokenRepository
}

// NewTokenUseCase creates a new token use case
func NewTokenUseCase(
	userRepo repositories.UserRepository,
	refreshTokenRepo *repositories.RefreshTokenRepository,
) *TokenUseCase {
	return &TokenUseCase{
		userRepo:         userRepo,
		refreshTokenRepo: refreshTokenRepo,
	}
}

// RefreshAccessToken creates new access token and rotates refresh token
func (uc *TokenUseCase) RefreshAccessToken(oldRefreshToken, ipAddress, userAgent string) (*domain.LoginResponse, error) {
	// Check for token reuse (security breach detection)
	isReused, revokedToken, err := uc.refreshTokenRepo.DetectTokenReuse(oldRefreshToken)
	if err != nil {
		return nil, errors.New("فشل في التحقق من رمز التحديث")
	}

	if isReused {
		// Security breach detected - revoke all tokens for this user
		if revokedToken != nil {
			uc.refreshTokenRepo.RevokeAllForUser(revokedToken.UserID)
		}
		return nil, errors.New("تم اكتشاف محاولة إعادة استخدام رمز ملغي. تم إلغاء جميع الجلسات لأسباب أمنية")
	}

	// Validate token is not revoked and not expired
	isValid, err := uc.refreshTokenRepo.IsValid(oldRefreshToken)
	if err != nil {
		return nil, errors.New("فشل في التحقق من رمز التحديث")
	}

	if !isValid {
		return nil, errors.New("رمز التحديث غير صالح أو منتهي الصلاحية")
	}

	// Get token from database
	tokenRecord, err := uc.refreshTokenRepo.FindByToken(oldRefreshToken)
	if err != nil {
		return nil, errors.New("رمز التحديث غير موجود")
	}

	// Get user
	user, err := uc.userRepo.FindByID(tokenRecord.UserID)
	if err != nil {
		return nil, errors.New("المستخدم غير موجود")
	}

	// Check if user is still active
	if !user.IsActive {
		return nil, errors.New("الحساب غير مفعل")
	}

	// Generate new access token
	accessToken, err := auth.GenerateAccessToken(user.ID, user.Email, user.RoleID)
	if err != nil {
		return nil, errors.New("فشل في إنشاء رمز الدخول")
	}

	// Generate new refresh token
	newRefreshTokenStr, err := auth.GenerateRefreshToken(user.ID)
	if err != nil {
		return nil, errors.New("فشل في إنشاء رمز التحديث")
	}

	// Store new refresh token
	newRefreshToken := &domain.RefreshToken{
		Token:     newRefreshTokenStr,
		UserID:    user.ID,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour), // 7 days
		IPAddress: ipAddress,
		UserAgent: userAgent,
	}

	if err := uc.refreshTokenRepo.Create(newRefreshToken); err != nil {
		return nil, errors.New("فشل في حفظ رمز التحديث")
	}

	// Revoke old token (rotation)
	if err := uc.refreshTokenRepo.Revoke(oldRefreshToken, &newRefreshTokenStr); err != nil {
		return nil, errors.New("فشل في إلغاء رمز التحديث القديم")
	}

	// Return response
	return &domain.LoginResponse{
		User:         user,
		AccessToken:  accessToken,
		RefreshToken: newRefreshTokenStr,
	}, nil
}

// RevokeToken manually revokes a refresh token (logout)
func (uc *TokenUseCase) RevokeToken(refreshToken string) error {
	return uc.refreshTokenRepo.Revoke(refreshToken, nil)
}

// RevokeAllUserTokens revokes all tokens for a user (logout all devices)
func (uc *TokenUseCase) RevokeAllUserTokens(userID uint) error {
	return uc.refreshTokenRepo.RevokeAllForUser(userID)
}

// CleanupExpiredTokens removes expired tokens (scheduled job)
func (uc *TokenUseCase) CleanupExpiredTokens() error {
	// Delete expired tokens
	if err := uc.refreshTokenRepo.DeleteExpired(); err != nil {
		return err
	}

	// Delete revoked tokens older than 30 days
	return uc.refreshTokenRepo.DeleteRevoked(30 * 24 * time.Hour)
}

// GetActiveTokensCount returns number of active sessions for a user
func (uc *TokenUseCase) GetActiveTokensCount(userID uint) (int64, error) {
	return uc.refreshTokenRepo.CountActiveTokensForUser(userID)
}
