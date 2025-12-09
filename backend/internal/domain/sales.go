package domain

import (
	"time"
)

// SalesOrder represents a sales order
type SalesOrder struct {
	ID             uint             `json:"id" gorm:"primarykey"`
	OrderNumber    string           `json:"order_number" gorm:"unique;not null;index"`
	CustomerID     uint             `json:"customer_id" gorm:"not null;index"`
	Customer       Customer         `json:"customer" gorm:"foreignKey:CustomerID"`
	OrderDate      time.Time        `json:"order_date" gorm:"not null"`
	DeliveryDate   *time.Time       `json:"delivery_date"`
	Status         string           `json:"status" gorm:"default:'draft'"` // draft, confirmed, shipped, delivered, cancelled
	TotalAmount    float64          `json:"total_amount" gorm:"default:0"`
	TaxAmount      float64          `json:"tax_amount" gorm:"default:0"`
	DiscountAmount float64          `json:"discount_amount" gorm:"default:0"`
	NetAmount      float64          `json:"net_amount" gorm:"default:0"`
	Notes          string           `json:"notes"`
	CreatedBy      uint             `json:"created_by"`
	Items          []SalesOrderItem `json:"items" gorm:"foreignKey:OrderID"`
	CreatedAt      time.Time        `json:"created_at"`
	UpdatedAt      time.Time        `json:"updated_at"`
	DeletedAt      *time.Time       `json:"-" gorm:"index"`
}

// SalesOrderItem represents an item in a sales order
type SalesOrderItem struct {
	ID        uint       `json:"id" gorm:"primarykey"`
	OrderID   uint       `json:"order_id" gorm:"not null;index"`
	ProductID uint       `json:"product_id" gorm:"not null"`
	Quantity  float64    `json:"quantity" gorm:"not null"`
	UnitPrice float64    `json:"unit_price" gorm:"not null"`
	Discount  float64    `json:"discount" gorm:"default:0"`
	TaxRate   float64    `json:"tax_rate" gorm:"default:0"`
	Total     float64    `json:"total" gorm:"not null"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"-" gorm:"index"`
}

// CreateOrderRequest
type CreateOrderRequest struct {
	CustomerID   uint                     `json:"customer_id" binding:"required"`
	OrderDate    time.Time                `json:"order_date" binding:"required"`
	DeliveryDate *time.Time               `json:"delivery_date"`
	Notes        string                   `json:"notes"`
	Items        []CreateOrderItemRequest `json:"items" binding:"required,dive"`
}

type CreateOrderItemRequest struct {
	ProductID uint    `json:"product_id" binding:"required"`
	Quantity  float64 `json:"quantity" binding:"required,gt=0"`
	UnitPrice float64 `json:"unit_price" binding:"required,gte=0"`
	Discount  float64 `json:"discount"`
	TaxRate   float64 `json:"tax_rate"`
}
