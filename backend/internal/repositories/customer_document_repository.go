package repositories

import (
	"erp-system/internal/domain"

	"gorm.io/gorm"
)

type CustomerDocumentRepository interface {
	Create(doc *domain.CustomerDocument) error
	FindByCustomerID(customerID uint) ([]domain.CustomerDocument, error)
	Delete(id uint) error
}

type customerDocumentRepository struct {
	db *gorm.DB
}

func NewCustomerDocumentRepository(db *gorm.DB) CustomerDocumentRepository {
	return &customerDocumentRepository{db: db}
}

func (r *customerDocumentRepository) Create(doc *domain.CustomerDocument) error {
	return r.db.Create(doc).Error
}

func (r *customerDocumentRepository) FindByCustomerID(customerID uint) ([]domain.CustomerDocument, error) {
	var docs []domain.CustomerDocument
	err := r.db.Where("customer_id = ?", customerID).Order("uploaded_at DESC").Find(&docs).Error
	return docs, err
}

func (r *customerDocumentRepository) Delete(id uint) error {
	return r.db.Delete(&domain.CustomerDocument{}, id).Error
}
