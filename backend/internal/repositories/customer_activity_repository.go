package repositories

import (
	"erp-system/internal/domain"

	"gorm.io/gorm"
)

type CustomerActivityRepository interface {
	Create(activity *domain.CustomerActivity) error
	FindByCustomerID(customerID uint) ([]domain.CustomerActivity, error)
	Delete(id uint) error
}

type customerActivityRepository struct {
	db *gorm.DB
}

func NewCustomerActivityRepository(db *gorm.DB) CustomerActivityRepository {
	return &customerActivityRepository{db: db}
}

func (r *customerActivityRepository) Create(activity *domain.CustomerActivity) error {
	return r.db.Create(activity).Error
}

func (r *customerActivityRepository) FindByCustomerID(customerID uint) ([]domain.CustomerActivity, error) {
	var activities []domain.CustomerActivity
	err := r.db.Where("customer_id = ?", customerID).Order("created_at DESC").Find(&activities).Error
	return activities, err
}

func (r *customerActivityRepository) Delete(id uint) error {
	return r.db.Delete(&domain.CustomerActivity{}, id).Error
}
