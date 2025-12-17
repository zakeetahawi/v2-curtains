package repositories

import (
	"erp-system/internal/domain"

	"gorm.io/gorm"
)

// UserRepository interface
type UserRepository interface {
	FindByEmail(email string) (*domain.User, error)
	FindByID(id uint) (*domain.User, error)
	FindAll(offset, limit int) ([]domain.User, int64, error)
	Create(user *domain.User) error
	Update(user *domain.User) error
	Delete(id uint) error
}

type userRepository struct {
	db *gorm.DB
}

// NewUserRepository creates a new user repository
func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) FindByEmail(email string) (*domain.User, error) {
	var user domain.User
	err := r.db.Preload("Role").Preload("Branch").Where("email = ? AND deleted_at IS NULL", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindByID(id uint) (*domain.User, error) {
	var user domain.User
	err := r.db.Preload("Role").Preload("Branch").First(&user, id).Error
	return &user, err
}

func (r *userRepository) FindAll(offset, limit int) ([]domain.User, int64, error) {
	var users []domain.User
	var total int64

	if err := r.db.Model(&domain.User{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := r.db.Preload("Role").Preload("Branch").Offset(offset).Limit(limit).Find(&users).Error
	return users, total, err
}

func (r *userRepository) Create(user *domain.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) Update(user *domain.User) error {
	return r.db.Save(user).Error
}

func (r *userRepository) Delete(id uint) error {
	return r.db.Delete(&domain.User{}, id).Error
}
