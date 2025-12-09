package domain

import (
	"time"
)

// ProductionOrder represents an order to produce goods
type ProductionOrder struct {
	ID             uint              `json:"id" gorm:"primarykey"`
	OrderNumber    string            `json:"order_number" gorm:"unique;not null;index"`
	ProductID      uint              `json:"product_id" gorm:"not null"`
	Product        Product           `json:"product" gorm:"foreignKey:ProductID"`
	Quantity       float64           `json:"quantity" gorm:"not null"`
	StartDate      time.Time         `json:"start_date"`
	EndDate        *time.Time        `json:"end_date"`
	Status         string            `json:"status" gorm:"default:'planned'"` // planned, in_progress, completed, cancelled
	ActualQuantity float64           `json:"actual_quantity"`
	Notes          string            `json:"notes"`
	CreatedBy      uint              `json:"created_by"`
	Batches        []ProductionBatch `json:"batches" gorm:"foreignKey:ProductionOrderID"`
	CreatedAt      time.Time         `json:"created_at"`
	UpdatedAt      time.Time         `json:"updated_at"`
	DeletedAt      *time.Time        `json:"-" gorm:"index"`
}

// BillOfMaterials represents the recipe for a product
type BillOfMaterials struct {
	ID              uint      `json:"id" gorm:"primarykey"`
	ProductID       uint      `json:"product_id" gorm:"not null;index"` // The finished good
	ComponentID     uint      `json:"component_id" gorm:"not null"`     // The raw material
	Component       Product   `json:"component" gorm:"foreignKey:ComponentID"`
	Quantity        float64   `json:"quantity" gorm:"not null"`
	UnitID          uint      `json:"unit_id"`
	WastePercentage float64   `json:"waste_percentage" gorm:"default:0"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// ProductionBatch represents a specific run of a production order
type ProductionBatch struct {
	ID                uint       `json:"id" gorm:"primarykey"`
	ProductionOrderID uint       `json:"production_order_id" gorm:"not null;index"`
	BatchNumber       string     `json:"batch_number" gorm:"unique;not null"`
	Quantity          float64    `json:"quantity" gorm:"not null"`
	Status            string     `json:"status" gorm:"default:'pending'"`
	StartTime         *time.Time `json:"start_time"`
	EndTime           *time.Time `json:"end_time"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`
}

// CreateProductionOrderRequest
type CreateProductionOrderRequest struct {
	ProductID uint      `json:"product_id" binding:"required"`
	Quantity  float64   `json:"quantity" binding:"required,gt=0"`
	StartDate time.Time `json:"start_date" binding:"required"`
	Notes     string    `json:"notes"`
}
