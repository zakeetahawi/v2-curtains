package domain

import (
	"time"
)

// Product represents a product in inventory
type Product struct {
	ID            uint       `json:"id" gorm:"primarykey"`
	SKU           string     `json:"sku" gorm:"unique;not null;index"`
	Name          string     `json:"name" gorm:"not null"`
	Description   string     `json:"description"`
	CategoryID    uint       `json:"category_id"`
	Category      Category   `json:"category" gorm:"foreignKey:CategoryID"`
	UnitID        uint       `json:"unit_id"`
	CostPrice     float64    `json:"cost_price" gorm:"default:0"`
	SellingPrice  float64    `json:"selling_price" gorm:"default:0"`
	ReorderLevel  int        `json:"reorder_level" gorm:"default:10"`
	MaxStockLevel int        `json:"max_stock_level"`
	IsActive      bool       `json:"is_active" gorm:"default:true"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
	DeletedAt     *time.Time `json:"-" gorm:"index"`
}

// Category represents a product category
type Category struct {
	ID          uint      `json:"id" gorm:"primarykey"`
	Name        string    `json:"name" gorm:"not null"`
	ParentID    *uint     `json:"parent_id"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Warehouse represents a storage location
type Warehouse struct {
	ID        uint      `json:"id" gorm:"primarykey"`
	Code      string    `json:"code" gorm:"unique;not null"`
	Name      string    `json:"name" gorm:"not null"`
	Address   string    `json:"address"`
	ManagerID uint      `json:"manager_id"`
	IsActive  bool      `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// CreateProductRequest
type CreateProductRequest struct {
	SKU           string  `json:"sku" binding:"required"`
	Name          string  `json:"name" binding:"required"`
	Description   string  `json:"description"`
	CategoryID    uint    `json:"category_id"`
	CostPrice     float64 `json:"cost_price" binding:"gte=0"`
	SellingPrice  float64 `json:"selling_price" binding:"gte=0"`
	ReorderLevel  int     `json:"reorder_level"`
	MaxStockLevel int     `json:"max_stock_level"`
}

// UpdateProductRequest
type UpdateProductRequest struct {
	Name          string  `json:"name"`
	Description   string  `json:"description"`
	CategoryID    uint    `json:"category_id"`
	CostPrice     float64 `json:"cost_price"`
	SellingPrice  float64 `json:"selling_price"`
	ReorderLevel  int     `json:"reorder_level"`
	MaxStockLevel int     `json:"max_stock_level"`
	IsActive      *bool   `json:"is_active"`
}
