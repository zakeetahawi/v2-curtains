package repositories

import (
	"erp-system/internal/domain"
	"erp-system/pkg/pagination"

	"gorm.io/gorm"
)

// CustomerRepository interface
type CustomerRepository interface {
	Create(customer *domain.Customer) error
	Update(customer *domain.Customer) error
	Delete(id uint) error
	FindByID(id uint) (*domain.Customer, error)
	FindAll(page, limit int, search string) ([]domain.Customer, int64, error)
	FindAllPaginated(params *pagination.PaginationParams, search string) *pagination.PaginatedResponse
	GenerateCode() (string, error)
}

type customerRepository struct {
	db *gorm.DB
}

// NewCustomerRepository creates a new customer repository
func NewCustomerRepository(db *gorm.DB) CustomerRepository {
	return &customerRepository{db: db}
}

func (r *customerRepository) Create(customer *domain.Customer) error {
	return r.db.Create(customer).Error
}

func (r *customerRepository) Update(customer *domain.Customer) error {
	return r.db.Save(customer).Error
}

func (r *customerRepository) Delete(id uint) error {
	return r.db.Delete(&domain.Customer{}, id).Error
}

func (r *customerRepository) FindByID(id uint) (*domain.Customer, error) {
	var customer domain.Customer
	err := r.db.First(&customer, id).Error
	return &customer, err
}

func (r *customerRepository) FindAll(page, limit int, search string) ([]domain.Customer, int64, error) {
	var customers []domain.Customer
	var total int64

	query := r.db.Model(&domain.Customer{})

	// Search filter
	if search != "" {
		query = query.Where("name LIKE ? OR email LIKE ? OR phone LIKE ? OR code LIKE ?",
			"%"+search+"%", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	// Get total count
	query.Count(&total)

	// Get paginated results
	offset := (page - 1) * limit
	err := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&customers).Error

	return customers, total, err
}

// FindAllPaginated returns paginated customers with search
func (r *customerRepository) FindAllPaginated(params *pagination.PaginationParams, search string) *pagination.PaginatedResponse {
	var customers []domain.Customer

	query := r.db.Model(&domain.Customer{}).Where("deleted_at IS NULL")

	// Search filter
	if search != "" {
		query = query.Where("name LIKE ? OR email LIKE ? OR phone LIKE ? OR code LIKE ?",
			"%"+search+"%", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	// Order by created_at DESC
	query = query.Order("created_at DESC")

	// Apply pagination and get response
	return pagination.PaginateAndRespond(query, params, &customers)
}

func (r *customerRepository) GenerateCode() (string, error) {
	var count int64
	r.db.Model(&domain.Customer{}).Count(&count)
	code := "CUST" + padLeft(int(count+1), 5)
	return code, nil
}

func padLeft(n, width int) string {
	s := ""
	for i := 0; i < width; i++ {
		s = "0" + s
	}
	// Convert n to string and replace leading zeros
	ns := ""
	for n > 0 {
		ns = string(rune('0'+n%10)) + ns
		n /= 10
	}
	if len(ns) >= width {
		return ns
	}
	return s[:width-len(ns)] + ns
}
