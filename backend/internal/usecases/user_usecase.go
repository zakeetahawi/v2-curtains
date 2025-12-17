package usecases

import (
	"erp-system/internal/domain"
	"erp-system/internal/repositories"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type UserUseCase struct {
	userRepo repositories.UserRepository
}

// NewUserUseCase creates a new user use case
func NewUserUseCase(ur repositories.UserRepository) *UserUseCase {
	return &UserUseCase{
		userRepo: ur,
	}
}

// GetUsers retrieves all users with pagination
func (uc *UserUseCase) GetUsers(page, limit int) ([]domain.User, int64, error) {
	offset := (page - 1) * limit
	return uc.userRepo.FindAll(offset, limit)
}

// GetUser retrieves a single user by ID
func (uc *UserUseCase) GetUser(id uint) (*domain.User, error) {
	return uc.userRepo.FindByID(id)
}

// CreateUser creates a new user
func (uc *UserUseCase) CreateUser(req domain.CreateUserRequest) (*domain.User, error) {
	// Check if email already exists
	existing, _ := uc.userRepo.FindByEmail(req.Email)
	if existing != nil {
		return nil, errors.New("email already exists")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		RoleID:       req.RoleID,
		BranchID:     req.BranchID,
		IsActive:     req.IsActive,
	}

	if err := uc.userRepo.Create(user); err != nil {
		return nil, err
	}

	// Load relations
	user, _ = uc.userRepo.FindByID(user.ID)
	return user, nil
}

// UpdateUser updates an existing user
func (uc *UserUseCase) UpdateUser(id uint, req domain.UpdateUserRequest) error {
	user, err := uc.userRepo.FindByID(id)
	if err != nil {
		return err
	}

	// Update fields
	if req.Username != "" {
		user.Username = req.Username
	}
	if req.Email != "" {
		user.Email = req.Email
	}
	if req.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		user.PasswordHash = string(hashedPassword)
	}
	if req.RoleID != 0 {
		user.RoleID = req.RoleID
	}
	user.BranchID = req.BranchID
	user.IsActive = req.IsActive

	return uc.userRepo.Update(user)
}

// DeleteUser deletes a user
func (uc *UserUseCase) DeleteUser(id uint) error {
	return uc.userRepo.Delete(id)
}
