package repositories

import (
	"erp-system/internal/domain"
	"erp-system/pkg/pagination"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type ProductionRepository interface {
	CreateOrder(order *domain.ProductionOrder) error
	FindAllOrders(page, limit int, status string) ([]domain.ProductionOrder, int64, error)
	FindAllOrdersPaginated(params *pagination.PaginationParams, status string) *pagination.PaginatedResponse
	FindOrderByID(id uint) (*domain.ProductionOrder, error)
	UpdateOrderStatus(id uint, status string) error
	GenerateOrderNumber() (string, error)

	CreateBOM(bom *domain.BillOfMaterials) error
	FindBOMByProductID(productID uint) ([]domain.BillOfMaterials, error)
}

type productionRepository struct {
	db *gorm.DB
}

func NewProductionRepository(db *gorm.DB) ProductionRepository {
	return &productionRepository{db: db}
}

// Order Methods
func (r *productionRepository) CreateOrder(order *domain.ProductionOrder) error {
	return r.db.Create(order).Error
}

func (r *productionRepository) FindAllOrders(page, limit int, status string) ([]domain.ProductionOrder, int64, error) {
	var orders []domain.ProductionOrder
	var total int64

	query := r.db.Model(&domain.ProductionOrder{}).Preload("Product")

	if status != "" {
		query = query.Where("status = ?", status)
	}

	query.Count(&total)

	offset := (page - 1) * limit
	err := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&orders).Error

	return orders, total, err
}

func (r *productionRepository) FindAllOrdersPaginated(params *pagination.PaginationParams, status string) *pagination.PaginatedResponse {
	var orders []domain.ProductionOrder

	query := r.db.Model(&domain.ProductionOrder{}).Preload("Product").Where("deleted_at IS NULL")

	if status != "" {
		query = query.Where("status = ?", status)
	}

	query = query.Order("created_at DESC")

	return pagination.PaginateAndRespond(query, params, &orders)
}

func (r *productionRepository) FindOrderByID(id uint) (*domain.ProductionOrder, error) {
	var order domain.ProductionOrder
	err := r.db.Preload("Product").Preload("Batches").First(&order, id).Error
	return &order, err
}

func (r *productionRepository) UpdateOrderStatus(id uint, status string) error {
	return r.db.Model(&domain.ProductionOrder{}).Where("id = ?", id).Update("status", status).Error
}

func (r *productionRepository) GenerateOrderNumber() (string, error) {
	var count int64
	r.db.Model(&domain.ProductionOrder{}).Count(&count)
	year := time.Now().Format("2006")
	return fmt.Sprintf("PO-%s-%05d", year, count+1), nil
}

// BOM Methods
func (r *productionRepository) CreateBOM(bom *domain.BillOfMaterials) error {
	return r.db.Create(bom).Error
}

func (r *productionRepository) FindBOMByProductID(productID uint) ([]domain.BillOfMaterials, error) {
	var boms []domain.BillOfMaterials
	err := r.db.Where("product_id = ?", productID).Preload("Component").Find(&boms).Error
	return boms, err
}
