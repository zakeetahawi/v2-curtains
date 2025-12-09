package unit

import (
	"erp-system/internal/domain"
	"erp-system/internal/repositories"
	"erp-system/internal/usecases"
	"erp-system/pkg/auth"
	"testing"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTokenTestDB(t *testing.T) (*gorm.DB, func()) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to connect database: %v", err)
	}

	db.AutoMigrate(
		&domain.Role{}, &domain.User{}, &domain.RefreshToken{},
	)

	cleanup := func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}

	return db, cleanup
}

// Test 1: Refresh token successfully generates new tokens
func TestTokenUseCase_RefreshToken_Success(t *testing.T) {
	db, cleanup := setupTokenTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	tokenUC := usecases.NewTokenUseCase(userRepo, refreshTokenRepo)

	// Create test user
	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "token@test.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	// Generate initial refresh token
	expiresAt := time.Now().Add(7 * 24 * time.Hour)
	oldToken, _ := auth.GenerateRefreshTokenWithExpiry(user.ID, expiresAt)

	// Store in database
	refreshTokenRecord := &domain.RefreshToken{
		Token:     oldToken,
		UserID:    user.ID,
		ExpiresAt: expiresAt,
		IPAddress: "192.168.1.1",
		UserAgent: "Test Agent",
	}
	refreshTokenRepo.Create(refreshTokenRecord)

	// Test refresh
	response, err := tokenUC.RefreshAccessToken(oldToken, "192.168.1.1", "Test Agent")

	if err != nil {
		t.Fatalf("Expected successful refresh, got error: %v", err)
	}
	if response == nil {
		t.Fatal("Expected non-nil response")
	}
	if response.AccessToken == "" {
		t.Error("Expected new access token")
	}
	if response.RefreshToken == "" {
		t.Error("Expected new refresh token")
	}
	if response.RefreshToken == oldToken {
		t.Error("Expected different refresh token (rotation)")
	}

	// Verify old token is revoked
	valid, _ := refreshTokenRepo.IsValid(oldToken)
	if valid {
		t.Error("Expected old token to be revoked")
	}
}

// Test 2: Detect token reuse and revoke all user tokens
func TestTokenUseCase_DetectTokenReuse_SecurityBreach(t *testing.T) {
	db, cleanup := setupTokenTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	tokenUC := usecases.NewTokenUseCase(userRepo, refreshTokenRepo)

	// Create test user
	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "security@test.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	// Generate initial refresh token
	expiresAt := time.Now().Add(7 * 24 * time.Hour)
	oldToken, _ := auth.GenerateRefreshTokenWithExpiry(user.ID, expiresAt)

	refreshTokenRecord := &domain.RefreshToken{
		Token:     oldToken,
		UserID:    user.ID,
		ExpiresAt: expiresAt,
	}
	refreshTokenRepo.Create(refreshTokenRecord)

	// First refresh (should succeed)
	_, err := tokenUC.RefreshAccessToken(oldToken, "192.168.1.1", "Agent")
	if err != nil {
		t.Fatalf("First refresh should succeed, got error: %v", err)
	}

	// Try to reuse the same token (security breach)
	_, err = tokenUC.RefreshAccessToken(oldToken, "192.168.1.100", "Agent")
	if err == nil {
		t.Error("Expected error for token reuse")
	}

	// Verify all user tokens are revoked (security response)
	count, _ := refreshTokenRepo.CountActiveTokensForUser(user.ID)
	if count != 0 {
		t.Errorf("Expected all tokens revoked, got %d active tokens", count)
	}
}

// Test 3: Reject expired refresh token
func TestTokenUseCase_ExpiredToken_Rejected(t *testing.T) {
	db, cleanup := setupTokenTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	tokenUC := usecases.NewTokenUseCase(userRepo, refreshTokenRepo)

	// Create test user
	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "expired@test.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	// Generate expired refresh token (expired 1 hour ago)
	expiresAt := time.Now().Add(-1 * time.Hour)
	expiredToken, _ := auth.GenerateRefreshTokenWithExpiry(user.ID, expiresAt)

	refreshTokenRecord := &domain.RefreshToken{
		Token:     expiredToken,
		UserID:    user.ID,
		ExpiresAt: expiresAt,
	}
	refreshTokenRepo.Create(refreshTokenRecord)

	// Try to refresh with expired token
	_, err := tokenUC.RefreshAccessToken(expiredToken, "192.168.1.1", "Agent")

	if err == nil {
		t.Error("Expected error for expired token")
	}
}

// Test 4: Reject revoked refresh token
func TestTokenUseCase_RevokedToken_Rejected(t *testing.T) {
	db, cleanup := setupTokenTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	tokenUC := usecases.NewTokenUseCase(userRepo, refreshTokenRepo)

	// Create test user
	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "revoked@test.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	// Generate refresh token
	expiresAt := time.Now().Add(7 * 24 * time.Hour)
	token, _ := auth.GenerateRefreshTokenWithExpiry(user.ID, expiresAt)

	refreshTokenRecord := &domain.RefreshToken{
		Token:     token,
		UserID:    user.ID,
		ExpiresAt: expiresAt,
	}
	refreshTokenRepo.Create(refreshTokenRecord)

	// Revoke the token
	refreshTokenRepo.Revoke(token, nil)

	// Try to refresh with revoked token
	_, err := tokenUC.RefreshAccessToken(token, "192.168.1.1", "Agent")

	if err == nil {
		t.Error("Expected error for revoked token")
	}
}

// Test 5: RevokeToken successfully revokes single token
func TestTokenUseCase_RevokeToken_Success(t *testing.T) {
	db, cleanup := setupTokenTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	tokenUC := usecases.NewTokenUseCase(userRepo, refreshTokenRepo)

	// Create test user
	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "revoke@test.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	// Generate refresh token
	expiresAt := time.Now().Add(7 * 24 * time.Hour)
	token, _ := auth.GenerateRefreshTokenWithExpiry(user.ID, expiresAt)

	refreshTokenRecord := &domain.RefreshToken{
		Token:     token,
		UserID:    user.ID,
		ExpiresAt: expiresAt,
	}
	refreshTokenRepo.Create(refreshTokenRecord)

	// Revoke via use case
	err := tokenUC.RevokeToken(token)
	if err != nil {
		t.Fatalf("Expected successful revoke, got error: %v", err)
	}

	// Verify token is revoked
	valid, _ := refreshTokenRepo.IsValid(token)
	if valid {
		t.Error("Expected token to be revoked")
	}
}

// Test 6: RevokeAllUserTokens revokes all sessions
func TestTokenUseCase_RevokeAllUserTokens_Success(t *testing.T) {
	db, cleanup := setupTokenTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	tokenUC := usecases.NewTokenUseCase(userRepo, refreshTokenRepo)

	// Create test user
	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "revokeall@test.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	// Create multiple refresh tokens (simulate multiple devices)
	expiresAt := time.Now().Add(7 * 24 * time.Hour)
	for i := 0; i < 3; i++ {
		token, _ := auth.GenerateRefreshTokenWithExpiry(user.ID, expiresAt.Add(time.Duration(i)*time.Millisecond))
		refreshTokenRepo.Create(&domain.RefreshToken{
			Token:     token,
			UserID:    user.ID,
			ExpiresAt: expiresAt,
		})
	}

	// Verify 3 active tokens
	count, _ := refreshTokenRepo.CountActiveTokensForUser(user.ID)
	if count != 3 {
		t.Errorf("Expected 3 active tokens, got %d", count)
	}

	// Revoke all tokens
	err := tokenUC.RevokeAllUserTokens(user.ID)
	if err != nil {
		t.Fatalf("Expected successful revoke all, got error: %v", err)
	}

	// Verify all tokens revoked
	count, _ = refreshTokenRepo.CountActiveTokensForUser(user.ID)
	if count != 0 {
		t.Errorf("Expected 0 active tokens after revoke all, got %d", count)
	}
}

// Test 7: CleanupExpiredTokens removes old tokens
func TestTokenUseCase_CleanupExpiredTokens_Success(t *testing.T) {
	db, cleanup := setupTokenTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	tokenUC := usecases.NewTokenUseCase(userRepo, refreshTokenRepo)

	// Create test user
	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "cleanup@test.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	// Create expired token (expired 1 day ago)
	expiredToken, _ := auth.GenerateRefreshTokenWithExpiry(user.ID, time.Now().Add(-24*time.Hour))
	refreshTokenRepo.Create(&domain.RefreshToken{
		Token:     expiredToken,
		UserID:    user.ID,
		ExpiresAt: time.Now().Add(-24 * time.Hour),
	})

	// Create valid token
	validToken, _ := auth.GenerateRefreshTokenWithExpiry(user.ID, time.Now().Add(7*24*time.Hour))
	refreshTokenRepo.Create(&domain.RefreshToken{
		Token:     validToken,
		UserID:    user.ID,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	})

	// Run cleanup
	err := tokenUC.CleanupExpiredTokens()
	if err != nil {
		t.Fatalf("Expected successful cleanup, got error: %v", err)
	}

	// Verify expired token is removed
	var expiredCount int64
	db.Model(&domain.RefreshToken{}).Where("token = ?", expiredToken).Count(&expiredCount)
	if expiredCount != 0 {
		t.Error("Expected expired token to be deleted")
	}

	// Verify valid token still exists
	var validCount int64
	db.Model(&domain.RefreshToken{}).Where("token = ?", validToken).Count(&validCount)
	if validCount != 1 {
		t.Error("Expected valid token to remain")
	}
}

// Test 8: GetActiveTokensCount returns correct count
func TestTokenUseCase_GetActiveTokensCount_Accurate(t *testing.T) {
	db, cleanup := setupTokenTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	tokenUC := usecases.NewTokenUseCase(userRepo, refreshTokenRepo)

	// Create test user
	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "count@test.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	// Create 2 active tokens
	expiresAt := time.Now().Add(7 * 24 * time.Hour)
	for i := 0; i < 2; i++ {
		token, _ := auth.GenerateRefreshTokenWithExpiry(user.ID, expiresAt.Add(time.Duration(i)*time.Millisecond))
		refreshTokenRepo.Create(&domain.RefreshToken{
			Token:     token,
			UserID:    user.ID,
			ExpiresAt: expiresAt,
		})
	}

	// Create 1 revoked token
	revokedToken, _ := auth.GenerateRefreshTokenWithExpiry(user.ID, expiresAt.Add(2*time.Millisecond))
	refreshTokenRepo.Create(&domain.RefreshToken{
		Token:     revokedToken,
		UserID:    user.ID,
		ExpiresAt: expiresAt,
		Revoked:   true,
	})

	// Get active count
	count, err := tokenUC.GetActiveTokensCount(user.ID)
	if err != nil {
		t.Fatalf("Expected successful count, got error: %v", err)
	}

	if count != 2 {
		t.Errorf("Expected 2 active tokens, got %d", count)
	}
}

// Test 9: Refresh with inactive user is rejected
func TestTokenUseCase_InactiveUser_Rejected(t *testing.T) {
	db, cleanup := setupTokenTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	tokenUC := usecases.NewTokenUseCase(userRepo, refreshTokenRepo)

	// Create inactive user
	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "inactive@test.com", PasswordHash: string(hash), RoleID: 1}
	db.Create(user)

	// Explicitly set IsActive to false after creation
	db.Model(&user).Update("is_active", false)

	// Generate refresh token
	expiresAt := time.Now().Add(7 * 24 * time.Hour)
	token, _ := auth.GenerateRefreshTokenWithExpiry(user.ID, expiresAt)

	refreshTokenRepo.Create(&domain.RefreshToken{
		Token:     token,
		UserID:    user.ID,
		ExpiresAt: expiresAt,
	})

	// Try to refresh (should fail because user is inactive)
	_, err := tokenUC.RefreshAccessToken(token, "192.168.1.1", "Agent")

	if err == nil {
		t.Error("Expected error for inactive user")
	}
}

// Test 10: Token replacement chain tracking
func TestTokenUseCase_ReplacementChainTracking(t *testing.T) {
	db, cleanup := setupTokenTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	tokenUC := usecases.NewTokenUseCase(userRepo, refreshTokenRepo)

	// Create test user
	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "chain@test.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	// Generate initial token
	expiresAt := time.Now().Add(7 * 24 * time.Hour)
	oldToken, _ := auth.GenerateRefreshTokenWithExpiry(user.ID, expiresAt)

	refreshTokenRepo.Create(&domain.RefreshToken{
		Token:     oldToken,
		UserID:    user.ID,
		ExpiresAt: expiresAt,
	})

	// Refresh token (rotation)
	response, err := tokenUC.RefreshAccessToken(oldToken, "192.168.1.1", "Agent")
	if err != nil {
		t.Fatalf("Expected successful refresh, got error: %v", err)
	}

	newToken := response.RefreshToken

	// Verify old token has replaced_by field set
	var oldTokenRecord domain.RefreshToken
	db.Where("token = ?", oldToken).First(&oldTokenRecord)

	if oldTokenRecord.ReplacedBy == nil || *oldTokenRecord.ReplacedBy == "" {
		t.Error("Expected replaced_by field to be set")
	}
	if oldTokenRecord.ReplacedBy == nil || *oldTokenRecord.ReplacedBy != newToken {
		t.Error("Expected replaced_by to reference new token")
	}
}
