package repositories

import (
	"erp-system/internal/domain"

	"gorm.io/gorm"
)

type BranchRepository interface {
	Create(branch *domain.Branch) error
	FindByID(id uint) (*domain.Branch, error)
	FindAll() ([]domain.Branch, error)
	Update(branch *domain.Branch) error
	Delete(id uint) error
	FindMainBranch() (*domain.Branch, error)
	FindByCode(code string) (*domain.Branch, error)
}

type branchRepository struct {
	db *gorm.DB
}

func NewBranchRepository(db *gorm.DB) BranchRepository {
	return &branchRepository{db: db}
}

func (r *branchRepository) Create(branch *domain.Branch) error {
	return r.db.Create(branch).Error
}

func (r *branchRepository) FindByID(id uint) (*domain.Branch, error) {
	var branch domain.Branch
	err := r.db.First(&branch, id).Error
	return &branch, err
}

func (r *branchRepository) FindAll() ([]domain.Branch, error) {
	var branches []domain.Branch
	err := r.db.Order("is_main DESC, created_at DESC").Find(&branches).Error
	return branches, err
}

func (r *branchRepository) Update(branch *domain.Branch) error {
	return r.db.Save(branch).Error
}

func (r *branchRepository) Delete(id uint) error {
	return r.db.Delete(&domain.Branch{}, id).Error
}

func (r *branchRepository) FindMainBranch() (*domain.Branch, error) {
	var branch domain.Branch
	err := r.db.Where("is_main = ?", true).First(&branch).Error
	return &branch, err
}

func (r *branchRepository) FindByCode(code string) (*domain.Branch, error) {
	var branch domain.Branch
	err := r.db.Where("code = ?", code).First(&branch).Error
	return &branch, err
}
