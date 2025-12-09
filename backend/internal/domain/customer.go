package domain

import (
	"time"
)

// Customer represents a customer entity
type Customer struct {
	ID                uint               `json:"id" gorm:"primarykey"`
	Code              string             `json:"code" gorm:"unique;not null;index"`
	Name              string             `json:"name" gorm:"not null"`
	Email             string             `json:"email" gorm:"unique"`
	Phone             string             `json:"phone"`
	Mobile            string             `json:"mobile"`
	Address           string             `json:"address"`
	City              string             `json:"city"`
	Governorate       string             `json:"governorate"`
	Country           string             `json:"country"`
	PostalCode        string             `json:"postal_code"`
	TaxNumber         string             `json:"tax_number"`
	CreditLimit       float64            `json:"credit_limit" gorm:"default:0"`
	Balance           float64            `json:"balance" gorm:"default:0"`
	Type              string             `json:"type" gorm:"default:'regular'"`  // regular, vip, wholesale
	Status            string             `json:"status" gorm:"default:'active'"` // active, inactive
	IsWhatsAppEnabled bool               `json:"is_whatsapp_enabled" gorm:"default:true"`
	Activities        []CustomerActivity `json:"activities" gorm:"foreignKey:CustomerID"`
	Documents         []CustomerDocument `json:"documents" gorm:"foreignKey:CustomerID"`
	CreatedBy         uint               `json:"created_by"`
	CreatedAt         time.Time          `json:"created_at"`
	UpdatedAt         time.Time          `json:"updated_at"`
	DeletedAt         *time.Time         `json:"-" gorm:"index"`
}

// CreateCustomerRequest for creating a new customer
type CreateCustomerRequest struct {
	Name              string  `json:"name" binding:"required"`
	Email             string  `json:"email" binding:"omitempty,email"`
	Phone             string  `json:"phone"`
	Mobile            string  `json:"mobile"`
	Address           string  `json:"address"`
	City              string  `json:"city"`
	Governorate       string  `json:"governorate"`
	Country           string  `json:"country"`
	PostalCode        string  `json:"postal_code"`
	TaxNumber         string  `json:"tax_number"`
	CreditLimit       float64 `json:"credit_limit"`
	Type              string  `json:"type"`
	IsWhatsAppEnabled bool    `json:"is_whatsapp_enabled"`
}

// UpdateCustomerRequest for updating a customer
type UpdateCustomerRequest struct {
	Name              string  `json:"name"`
	Email             string  `json:"email" binding:"omitempty,email"`
	Phone             string  `json:"phone"`
	Mobile            string  `json:"mobile"`
	Address           string  `json:"address"`
	City              string  `json:"city"`
	Governorate       string  `json:"governorate"`
	Country           string  `json:"country"`
	PostalCode        string  `json:"postal_code"`
	TaxNumber         string  `json:"tax_number"`
	CreditLimit       float64 `json:"credit_limit"`
	Type              string  `json:"type"`
	Status            string  `json:"status"`
	IsWhatsAppEnabled bool    `json:"is_whatsapp_enabled"`
}

// CustomerActivity represents a CRM interaction (Note, Call, Meeting)
type CustomerActivity struct {
	ID           uint       `json:"id" gorm:"primarykey"`
	CustomerID   uint       `json:"customer_id" gorm:"index"`
	Customer     Customer   `json:"-" gorm:"foreignKey:CustomerID"` // Relation for Preload
	Type         string     `json:"type"`                           // note, call, meeting, alert
	Description  string     `json:"description"`
	ReminderDate *time.Time `json:"reminder_date"` // Optional reminder
	IsCompleted  bool       `json:"is_completed" gorm:"default:false"`
	CreatedBy    uint       `json:"created_by"`
	CreatedAt    time.Time  `json:"created_at"`
}

// CustomerDocument represents an uploaded file
type CustomerDocument struct {
	ID         uint      `json:"id" gorm:"primarykey"`
	CustomerID uint      `json:"customer_id" gorm:"index"`
	Title      string    `json:"title"`
	FilePath   string    `json:"file_path"`
	FileType   string    `json:"file_type"` // pdf, image, etc.
	UploadedAt time.Time `json:"uploaded_at" gorm:"autoCreateTime"`
}
