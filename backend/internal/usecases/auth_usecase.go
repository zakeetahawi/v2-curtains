package usecases

import (
	"erp-system/internal/domain"
	"erp-system/internal/repositories"
	"erp-system/pkg/auth"
	"errors"
	"fmt"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// AuthUseCase handles authentication logic
type AuthUseCase struct {
	userRepo         repositories.UserRepository
	loginAttemptRepo *repositories.LoginAttemptRepository
	lockoutRepo      *repositories.AccountLockoutRepository
	refreshTokenRepo *repositories.RefreshTokenRepository
}

// NewAuthUseCase creates a new auth use case
func NewAuthUseCase(
	ur repositories.UserRepository,
	lar *repositories.LoginAttemptRepository,
	lor *repositories.AccountLockoutRepository,
	rtr *repositories.RefreshTokenRepository,
) *AuthUseCase {
	return &AuthUseCase{
		userRepo:         ur,
		loginAttemptRepo: lar,
		lockoutRepo:      lor,
		refreshTokenRepo: rtr,
	}
}

// Login authenticates a user with security tracking
func (uc *AuthUseCase) Login(email, password, ipAddress, userAgent string) (*domain.LoginResponse, error) {
	// Check if account is locked
	isLocked, _ := uc.lockoutRepo.IsAccountLocked(email)
	if isLocked {
		lockout, _ := uc.lockoutRepo.GetActiveLockout(email)
		if lockout != nil && lockout.UnlockedAt != nil {
			remainingTime := time.Until(*lockout.UnlockedAt)
			return nil, fmt.Errorf("الحساب مغلق مؤقتاً. يرجى المحاولة بعد %d دقيقة", int(remainingTime.Minutes())+1)
		} else if lockout != nil {
			return nil, errors.New("الحساب مغلق مؤقتاً. يرجى المحاولة لاحقاً")
		}
	}

	// Find user by email
	user, err := uc.userRepo.FindByEmail(email)
	if err != nil {
		// Record failed attempt - user not found
		uc.loginAttemptRepo.RecordAttempt(email, ipAddress, userAgent, false, "البريد الإلكتروني غير موجود")
		return nil, errors.New("بيانات الدخول غير صحيحة")
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		// Record failed attempt - wrong password
		uc.loginAttemptRepo.RecordAttempt(email, ipAddress, userAgent, false, "كلمة المرور غير صحيحة")

		// Check if we should lock the account (5 failures in 15 minutes)
		failedCount, _ := uc.loginAttemptRepo.GetRecentFailedAttempts(email, 15)
		if failedCount >= 5 {
			uc.lockoutRepo.LockAccount(user.ID, email, "محاولات دخول فاشلة متعددة", int(failedCount))
			return nil, errors.New("تم إغلاق الحساب مؤقتاً بسبب محاولات دخول فاشلة متعددة. يرجى المحاولة بعد 30 دقيقة")
		}

		return nil, errors.New("بيانات الدخول غير صحيحة")
	}

	// Check if user is active
	if !user.IsActive {
		uc.loginAttemptRepo.RecordAttempt(email, ipAddress, userAgent, false, "الحساب غير مفعل")
		return nil, errors.New("الحساب غير مفعل")
	}

	// Login successful - record attempt
	uc.loginAttemptRepo.RecordAttempt(email, ipAddress, userAgent, true, "")

	// Unlock account if it was previously locked
	uc.lockoutRepo.UnlockAccount(email)

	// Generate tokens
	accessToken, err := auth.GenerateAccessToken(user.ID, user.Email, user.RoleID)
	if err != nil {
		return nil, errors.New("فشل في إنشاء رمز الدخول")
	}

	refreshToken, err := auth.GenerateRefreshToken(user.ID)
	if err != nil {
		return nil, errors.New("فشل في إنشاء رمز التحديث")
	}

	// Store refresh token in database for rotation
	refreshTokenRecord := &domain.RefreshToken{
		Token:     refreshToken,
		UserID:    user.ID,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour), // 7 days
		IPAddress: ipAddress,
		UserAgent: userAgent,
	}
	if err := uc.refreshTokenRepo.Create(refreshTokenRecord); err != nil {
		// Log error but don't fail login
		// In production, you might want to handle this differently
	}

	// Update last login time
	now := time.Now()
	user.LastLoginAt = &now
	uc.userRepo.Update(user)

	// Clear password hash from response
	user.PasswordHash = ""

	return &domain.LoginResponse{
		User:         user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}
