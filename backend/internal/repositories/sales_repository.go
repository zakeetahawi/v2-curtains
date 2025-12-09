package repositories

import (
	"erp-system/internal/domain"
	"erp-system/pkg/pagination"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type SalesRepository interface {
	Create(order *domain.SalesOrder) error
	FindAll(page, limit int, status string, customerID uint) ([]domain.SalesOrder, int64, error)
	FindAllPaginated(params *pagination.PaginationParams, status string, customerID uint) *pagination.PaginatedResponse
	FindByID(id uint) (*domain.SalesOrder, error)
	UpdateStatus(id uint, status string) error
	GenerateOrderNumber() (string, error)
}

type salesRepository struct {
	db *gorm.DB
}

func NewSalesRepository(db *gorm.DB) SalesRepository {
	return &salesRepository{db: db}
}

func (r *salesRepository) Create(order *domain.SalesOrder) error {
	return r.db.Create(order).Error
}

func (r *salesRepository) FindAll(page, limit int, status string, customerID uint) ([]domain.SalesOrder, int64, error) {
	var orders []domain.SalesOrder
	var total int64

	query := r.db.Model(&domain.SalesOrder{}).Preload("Customer")

	if status != "" {
		query = query.Where("status = ?", status)
	}
	if customerID > 0 {
		query = query.Where("customer_id = ?", customerID)
	}

	query.Count(&total)

	offset := (page - 1) * limit
	err := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&orders).Error

	return orders, total, err
}

func (r *salesRepository) FindAllPaginated(params *pagination.PaginationParams, status string, customerID uint) *pagination.PaginatedResponse {
	var orders []domain.SalesOrder

	query := r.db.Model(&domain.SalesOrder{}).Preload("Customer").Where("deleted_at IS NULL")

	if status != "" {
		query = query.Where("status = ?", status)
	}
	if customerID > 0 {
		query = query.Where("customer_id = ?", customerID)
	}

	query = query.Order("created_at DESC")

	return pagination.PaginateAndRespond(query, params, &orders)
}

func (r *salesRepository) FindByID(id uint) (*domain.SalesOrder, error) {
	var order domain.SalesOrder
	err := r.db.Preload("Customer").Preload("Items").First(&order, id).Error
	return &order, err
}

func (r *salesRepository) UpdateStatus(id uint, status string) error {
	return r.db.Model(&domain.SalesOrder{}).Where("id = ?", id).Update("status", status).Error
}

func (r *salesRepository) GenerateOrderNumber() (string, error) {
	var count int64
	r.db.Model(&domain.SalesOrder{}).Count(&count)
	year := time.Now().Format("2006")
	return fmt.Sprintf("SO-%s-%05d", year, count+1), nil
}
