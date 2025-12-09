package unit

import (
	"erp-system/internal/domain"
	"erp-system/internal/repositories"
	"erp-system/internal/usecases"
	"testing"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupAuthTestDB(t *testing.T) (*gorm.DB, func()) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to connect database: %v", err)
	}

	db.AutoMigrate(
		&domain.Role{}, &domain.User{}, &domain.RefreshToken{}, &domain.LoginAttempt{}, &domain.AccountLockout{},
	)

	cleanup := func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}

	return db, cleanup
}

func TestAuthUseCase_Login_Success(t *testing.T) {
	db, cleanup := setupAuthTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	loginRepo := repositories.NewLoginAttemptRepository(db)
	lockRepo := repositories.NewAccountLockoutRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	authUC := usecases.NewAuthUseCase(userRepo, loginRepo, lockRepo, refreshTokenRepo)

	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "test@example.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	response, err := authUC.Login("test@example.com", "password123", "192.168.1.1", "Agent")

	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}
	if response == nil || response.AccessToken == "" {
		t.Error("Expected valid response with token")
	}
}

func TestAuthUseCase_Login_InvalidEmail(t *testing.T) {
	db, cleanup := setupAuthTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	loginRepo := repositories.NewLoginAttemptRepository(db)
	lockRepo := repositories.NewAccountLockoutRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	authUC := usecases.NewAuthUseCase(userRepo, loginRepo, lockRepo, refreshTokenRepo)

	_, err := authUC.Login("nonexistent@example.com", "password123", "192.168.1.1", "Agent")

	if err == nil {
		t.Error("Expected error for invalid email")
	}
}

func TestAuthUseCase_Login_InvalidPassword(t *testing.T) {
	db, cleanup := setupAuthTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	loginRepo := repositories.NewLoginAttemptRepository(db)
	lockRepo := repositories.NewAccountLockoutRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	authUC := usecases.NewAuthUseCase(userRepo, loginRepo, lockRepo, refreshTokenRepo)

	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "test@example.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	_, err := authUC.Login("test@example.com", "wrongpassword", "192.168.1.1", "Agent")

	if err == nil {
		t.Error("Expected error for wrong password")
	}
}

func TestAuthUseCase_Login_InactiveUser(t *testing.T) {
	db, cleanup := setupAuthTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	loginRepo := repositories.NewLoginAttemptRepository(db)
	lockRepo := repositories.NewAccountLockoutRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	authUC := usecases.NewAuthUseCase(userRepo, loginRepo, lockRepo, refreshTokenRepo)

	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "inactive@example.com", PasswordHash: string(hash), RoleID: 1}
	db.Create(user)

	// Explicitly set IsActive to false after creation
	db.Model(&user).Update("is_active", false)

	_, err := authUC.Login("inactive@example.com", "password123", "192.168.1.1", "Agent")

	if err == nil {
		t.Error("Expected error for inactive user")
	}
}

func TestAuthUseCase_Login_LastLoginUpdate(t *testing.T) {
	db, cleanup := setupAuthTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	loginRepo := repositories.NewLoginAttemptRepository(db)
	lockRepo := repositories.NewAccountLockoutRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	authUC := usecases.NewAuthUseCase(userRepo, loginRepo, lockRepo, refreshTokenRepo)

	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "test@example.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	authUC.Login("test@example.com", "password123", "192.168.1.1", "Agent")

	var updatedUser domain.User
	db.Where("email = ?", "test@example.com").First(&updatedUser)

	if updatedUser.LastLoginAt == nil {
		t.Error("Expected last_login_at to be updated")
	}
}

func TestLoginAttempt_SuccessRecorded(t *testing.T) {
	db, cleanup := setupAuthTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	loginRepo := repositories.NewLoginAttemptRepository(db)
	lockRepo := repositories.NewAccountLockoutRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	authUC := usecases.NewAuthUseCase(userRepo, loginRepo, lockRepo, refreshTokenRepo)

	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "security@test.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	_, err := authUC.Login("security@test.com", "password123", "192.168.1.1", "Test Agent")
	if err != nil {
		t.Errorf("Expected successful login, got error: %v", err)
	}

	var count int64
	db.Model(&domain.LoginAttempt{}).Where("email = ? AND success = ?", "security@test.com", true).Count(&count)
	if count != 1 {
		t.Errorf("Expected 1 successful login attempt, got %d", count)
	}
}

func TestLoginAttempt_FailureRecorded(t *testing.T) {
	db, cleanup := setupAuthTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	loginRepo := repositories.NewLoginAttemptRepository(db)
	lockRepo := repositories.NewAccountLockoutRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	authUC := usecases.NewAuthUseCase(userRepo, loginRepo, lockRepo, refreshTokenRepo)

	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "security@test.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	_, err := authUC.Login("security@test.com", "wrongpassword", "192.168.1.1", "Test Agent")
	if err == nil {
		t.Error("Expected login to fail")
	}

	var count int64
	db.Model(&domain.LoginAttempt{}).Where("email = ? AND success = ?", "security@test.com", false).Count(&count)
	if count != 1 {
		t.Errorf("Expected 1 failed login attempt, got %d", count)
	}
}

func TestAccountLockout_After5Failures(t *testing.T) {
	db, cleanup := setupAuthTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	loginRepo := repositories.NewLoginAttemptRepository(db)
	lockRepo := repositories.NewAccountLockoutRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	authUC := usecases.NewAuthUseCase(userRepo, loginRepo, lockRepo, refreshTokenRepo)

	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "security@test.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	for i := 0; i < 5; i++ {
		authUC.Login("security@test.com", "wrongpassword", "192.168.1.100", "Test Agent")
		time.Sleep(1 * time.Millisecond)
	}

	_, err := authUC.Login("security@test.com", "wrongpassword", "192.168.1.100", "Test Agent")
	if err == nil {
		t.Error("Expected account to be locked")
	}

	var lockoutCount int64
	db.Model(&domain.AccountLockout{}).Where("email = ? AND is_active = ?", "security@test.com", true).Count(&lockoutCount)
	if lockoutCount != 1 {
		t.Errorf("Expected 1 active lockout, got %d", lockoutCount)
	}
}

func TestLockedAccount_PreventLogin(t *testing.T) {
	db, cleanup := setupAuthTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	loginRepo := repositories.NewLoginAttemptRepository(db)
	lockRepo := repositories.NewAccountLockoutRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	authUC := usecases.NewAuthUseCase(userRepo, loginRepo, lockRepo, refreshTokenRepo)

	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "security@test.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	lockRepo.LockAccount(user.ID, "security@test.com", "Test lockout", 5)

	_, err := authUC.Login("security@test.com", "password123", "192.168.1.1", "Test Agent")
	if err == nil {
		t.Error("Expected login to fail due to lockout")
	}
}

func TestLoginAttemptCounting_ByEmail(t *testing.T) {
	db, cleanup := setupAuthTestDB(t)
	defer cleanup()

	userRepo := repositories.NewUserRepository(db)
	loginRepo := repositories.NewLoginAttemptRepository(db)
	lockRepo := repositories.NewAccountLockoutRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)
	authUC := usecases.NewAuthUseCase(userRepo, loginRepo, lockRepo, refreshTokenRepo)

	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := &domain.User{Email: "security@test.com", PasswordHash: string(hash), RoleID: 1, IsActive: true}
	db.Create(user)

	for i := 0; i < 3; i++ {
		authUC.Login("security@test.com", "wrongpass", "192.168.1.1", "Test Agent")
		time.Sleep(1 * time.Millisecond)
	}

	count, _ := loginRepo.GetRecentFailedAttempts("security@test.com", 15)
	if count != 3 {
		t.Errorf("Expected 3 failed attempts, got %d", count)
	}
}
