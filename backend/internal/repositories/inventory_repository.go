package repositories

import (
	"erp-system/internal/domain"
	"erp-system/pkg/pagination"

	"gorm.io/gorm"
)

type InventoryRepository interface {
	CreateProduct(product *domain.Product) error
	UpdateProduct(product *domain.Product) error
	DeleteProduct(id uint) error
	FindProductByID(id uint) (*domain.Product, error)
	FindAllProducts(page, limit int, search string, categoryID uint) ([]domain.Product, int64, error)
	FindAllProductsPaginated(params *pagination.PaginationParams, search string, categoryID uint) *pagination.PaginatedResponse

	CreateCategory(category *domain.Category) error
	FindAllCategories() ([]domain.Category, error)
}

type inventoryRepository struct {
	db *gorm.DB
}

func NewInventoryRepository(db *gorm.DB) InventoryRepository {
	return &inventoryRepository{db: db}
}

// Product Methods
func (r *inventoryRepository) CreateProduct(product *domain.Product) error {
	return r.db.Create(product).Error
}

func (r *inventoryRepository) UpdateProduct(product *domain.Product) error {
	return r.db.Save(product).Error
}

func (r *inventoryRepository) DeleteProduct(id uint) error {
	return r.db.Delete(&domain.Product{}, id).Error
}

func (r *inventoryRepository) FindProductByID(id uint) (*domain.Product, error) {
	var product domain.Product
	err := r.db.Preload("Category").First(&product, id).Error
	return &product, err
}

func (r *inventoryRepository) FindAllProducts(page, limit int, search string, categoryID uint) ([]domain.Product, int64, error) {
	var products []domain.Product
	var total int64

	query := r.db.Model(&domain.Product{}).Preload("Category")

	if search != "" {
		query = query.Where("name LIKE ? OR sku LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	if categoryID > 0 {
		query = query.Where("category_id = ?", categoryID)
	}

	query.Count(&total)

	offset := (page - 1) * limit
	err := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&products).Error

	return products, total, err
}

func (r *inventoryRepository) FindAllProductsPaginated(params *pagination.PaginationParams, search string, categoryID uint) *pagination.PaginatedResponse {
	var products []domain.Product

	query := r.db.Model(&domain.Product{}).Preload("Category").Where("deleted_at IS NULL")

	if search != "" {
		query = query.Where("name LIKE ? OR sku LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	if categoryID > 0 {
		query = query.Where("category_id = ?", categoryID)
	}

	query = query.Order("created_at DESC")

	return pagination.PaginateAndRespond(query, params, &products)
}

// Category Methods
func (r *inventoryRepository) CreateCategory(category *domain.Category) error {
	return r.db.Create(category).Error
}

func (r *inventoryRepository) FindAllCategories() ([]domain.Category, error) {
	var categories []domain.Category
	err := r.db.Find(&categories).Error
	return categories, err
}
