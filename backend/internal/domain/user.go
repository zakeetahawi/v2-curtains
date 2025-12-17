package domain

import (
	"time"
)

// User represents a system user
type User struct {
	ID           uint       `json:"id" gorm:"primarykey"`
	Username     string     `json:"username" gorm:"unique;not null"`
	Email        string     `json:"email" gorm:"unique;not null"`
	PasswordHash string     `json:"-" gorm:"not null"`
	RoleID       uint       `json:"role_id" gorm:"not null;default:4"`
	Role         *Role      `json:"role,omitempty" gorm:"foreignKey:RoleID"`
	BranchID     *uint      `json:"branch_id"` // Branch assignment
	Branch       *Branch    `json:"branch,omitempty" gorm:"foreignKey:BranchID"`
	IsActive     bool       `json:"is_active" gorm:"default:true"`
	LastLoginAt  *time.Time `json:"last_login_at,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	DeletedAt    *time.Time `json:"-" gorm:"index"`
}

// RefreshToken represents a stored refresh token for rotation
type RefreshToken struct {
	ID         uint       `json:"id" gorm:"primarykey"`
	Token      string     `json:"token" gorm:"unique;not null"`
	UserID     uint       `json:"user_id" gorm:"not null"`
	User       *User      `json:"user,omitempty" gorm:"foreignKey:UserID"`
	ExpiresAt  time.Time  `json:"expires_at" gorm:"not null"`
	Revoked    bool       `json:"revoked" gorm:"default:false"`
	ReplacedBy *string    `json:"replaced_by,omitempty"`
	IPAddress  string     `json:"ip_address,omitempty" gorm:"size:45"`
	UserAgent  string     `json:"user_agent,omitempty" gorm:"size:255"`
	CreatedAt  time.Time  `json:"created_at"`
	RevokedAt  *time.Time `json:"revoked_at,omitempty"`
}

// Role represents user permissions
type Role struct {
	ID          uint      `json:"id" gorm:"primarykey"`
	Name        string    `json:"name" gorm:"unique;not null"`
	Description string    `json:"description"`
	Permissions string    `json:"permissions" gorm:"type:text"` // JSON string
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// LoginRequest represents login credentials
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginResponse represents login response
type LoginResponse struct {
	User         *User  `json:"user"`
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

// CreateUserRequest represents user creation request
type CreateUserRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	RoleID   uint   `json:"role_id" binding:"required"`
	BranchID *uint  `json:"branch_id"`
	IsActive bool   `json:"is_active"`
}

// UpdateUserRequest represents user update request
type UpdateUserRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password,omitempty"` // Optional
	RoleID   uint   `json:"role_id"`
	BranchID *uint  `json:"branch_id"`
	IsActive bool   `json:"is_active"`
}
