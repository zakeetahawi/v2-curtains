package domain

import "time"

// Branch represents a company branch/location
type Branch struct {
	ID        uint      `json:"id" gorm:"primarykey"`
	Code      string    `json:"code" gorm:"unique;not null;index"`
	Name      string    `json:"name" gorm:"not null"`
	NameEn    string    `json:"name_en"`
	Address   string    `json:"address"`
	City      string    `json:"city"`
	Phone     string    `json:"phone"`
	Email     string    `json:"email"`
	IsMain    bool      `json:"is_main" gorm:"default:false"` // Main branch flag
	IsActive  bool      `json:"is_active" gorm:"default:true"`
	ManagerID *uint     `json:"manager_id"` // Branch manager user ID
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Permission represents a system permission
type Permission struct {
	ID          uint   `json:"id" gorm:"primarykey"`
	Code        string `json:"code" gorm:"unique;not null"` // e.g., "customers.create"
	Name        string `json:"name" gorm:"not null"`
	Module      string `json:"module"` // e.g., "customers", "sales", "inventory"
	Description string `json:"description"`
}

// RolePermission links roles to permissions
type RolePermission struct {
	RoleID       uint `json:"role_id" gorm:"primaryKey"`
	PermissionID uint `json:"permission_id" gorm:"primaryKey"`
}

// GenerateBranchCode generates a unique branch code
func GenerateBranchCode(id uint) string {
	return "BR-" + padLeft(id, 4)
}

func padLeft(n uint, width int) string {
	s := ""
	for i := 0; i < width; i++ {
		s = "0" + s
	}
	return s[:width-len(string(rune(n)))] + string(rune(n))
}
