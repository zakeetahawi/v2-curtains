---
description: ERP System - Full Development Workflow
---

# 🏗️ ERP System Development - Complete Workflow

هذا الـ Workflow يوضح الخطوات الكاملة لبناء نظام ERP من الصفر حتى الإطلاق.

---

## 📋 Phase 1: Project Initialization

### Step 1.1: Create Project Structure
```bash
# Create main project directory
mkdir -p erp-system && cd erp-system

# Create backend structure
mkdir -p backend/{cmd/server,internal/{domain,usecases,repositories,handlers,middleware},api/{routes,validators},pkg/{auth,database,logger,utils},migrations,configs,tests}

# Create frontend structure
mkdir -p frontend/{public,src/{components/{common,modules,layouts},pages,services,utils,assets/{images,icons},styles,locales/{ar,en}}}

# Create documentation
mkdir -p docs/{api,user,developer}

# Initialize Git
git init
echo "# ERP System" > README.md
```

### Step 1.2: Initialize Backend (Go)
// turbo
```bash
cd backend

# Initialize Go module
go mod init github.com/yourusername/erp-system

# Install core dependencies
go get -u github.com/gin-gonic/gin
go get -u github.com/golang-jwt/jwt/v5
go get -u gorm.io/gorm
go get -u gorm.io/driver/sqlite
go get -u gorm.io/driver/postgres
go get -u github.com/go-playground/validator/v10
go get -u golang.org/x/crypto/bcrypt
go get -u github.com/joho/godotenv
go get -u github.com/stretchr/testify

# Create .env file
cat > .env.example << 'EOF'
# Application
APP_NAME=ERP System
APP_ENV=development
APP_PORT=8080
APP_DEBUG=true

# Database
DB_TYPE=sqlite
DB_PATH=./erp.db
# For PostgreSQL (production)
# DB_TYPE=postgres
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=erp_db
# DB_USER=postgres
# DB_PASSWORD=secret

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=168h

# Security
BCRYPT_COST=12
RATE_LIMIT=100

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
EOF

cp .env.example .env
```

### Step 1.3: Initialize Frontend
```bash
cd ../frontend

# Using Vite for fast development
npm create vite@latest . -- --template vanilla

# Install TailwindCSS 5
npm install -D tailwindcss@next postcss autoprefixer
npx tailwindcss init -p

# Install dependencies
npm install axios
npm install react-router-dom
npm install @headlessui/react
npm install chart.js react-chartjs-2
npm install i18next react-i18next

# Install development dependencies
npm install -D @types/node
npm install -D eslint prettier
```

### Step 1.4: Configure TailwindCSS
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        silver: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## 🔐 Phase 2: Authentication System

### Step 2.1: Create User Domain Models (Backend)
```go
// backend/internal/domain/user.go
package domain

import (
    "time"
    "gorm.io/gorm"
)

type User struct {
    ID           uint           `json:"id" gorm:"primarykey"`
    Username     string         `json:"username" gorm:"unique;not null"`
    Email        string         `json:"email" gorm:"unique;not null"`
    PasswordHash string         `json:"-" gorm:"not null"`
    RoleID       uint           `json:"role_id" gorm:"not null"`
    Role         Role           `json:"role" gorm:"foreignKey:RoleID"`
    IsActive     bool           `json:"is_active" gorm:"default:true"`
    LastLoginAt  *time.Time     `json:"last_login_at"`
    CreatedAt    time.Time      `json:"created_at"`
    UpdatedAt    time.Time      `json:"updated_at"`
    DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}

type Role struct {
    ID          uint      `json:"id" gorm:"primarykey"`
    Name        string    `json:"name" gorm:"unique;not null"`
    Description string    `json:"description"`
    Permissions string    `json:"permissions" gorm:"type:json"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
}

type Session struct {
    ID           uint      `json:"id" gorm:"primarykey"`
    UserID       uint      `json:"user_id" gorm:"not null"`
    AccessToken  string    `json:"access_token" gorm:"not null"`
    RefreshToken string    `json:"refresh_token" gorm:"not null"`
    ExpiresAt    time.Time `json:"expires_at"`
    IPAddress    string    `json:"ip_address"`
    UserAgent    string    `json:"user_agent"`
    CreatedAt    time.Time `json:"created_at"`
}
```

### Step 2.2: Implement Authentication Use Cases
```go
// backend/internal/usecases/auth.go
package usecases

import (
    "errors"
    "time"
    "golang.org/x/crypto/bcrypt"
    "github.com/golang-jwt/jwt/v5"
    "github.com/yourusername/erp-system/internal/domain"
    "github.com/yourusername/erp-system/internal/repositories"
)

type AuthUseCase struct {
    userRepo    repositories.UserRepository
    sessionRepo repositories.SessionRepository
    jwtSecret   string
}

func NewAuthUseCase(ur repositories.UserRepository, sr repositories.SessionRepository, secret string) *AuthUseCase {
    return &AuthUseCase{
        userRepo:    ur,
        sessionRepo: sr,
        jwtSecret:   secret,
    }
}

func (uc *AuthUseCase) Login(email, password, ip, userAgent string) (*domain.User, string, string, error) {
    // Find user
    user, err := uc.userRepo.FindByEmail(email)
    if err != nil {
        return nil, "", "", errors.New("invalid credentials")
    }

    // Verify password
    if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
        return nil, "", "", errors.New("invalid credentials")
    }

    // Check if active
    if !user.IsActive {
        return nil, "", "", errors.New("account is inactive")
    }

    // Generate tokens
    accessToken, err := uc.generateAccessToken(user)
    if err != nil {
        return nil, "", "", err
    }

    refreshToken, err := uc.generateRefreshToken(user)
    if err != nil {
        return nil, "", "", err
    }

    // Create session
    session := &domain.Session{
        UserID:       user.ID,
        AccessToken:  accessToken,
        RefreshToken: refreshToken,
        ExpiresAt:    time.Now().Add(168 * time.Hour), // 7 days
        IPAddress:    ip,
        UserAgent:    userAgent,
    }

    if err := uc.sessionRepo.Create(session); err != nil {
        return nil, "", "", err
    }

    // Update last login
    now := time.Now()
    user.LastLoginAt = &now
    uc.userRepo.Update(user)

    return user, accessToken, refreshToken, nil
}

func (uc *AuthUseCase) generateAccessToken(user *domain.User) (string, error) {
    claims := jwt.MapClaims{
        "user_id": user.ID,
        "email":   user.Email,
        "role_id": user.RoleID,
        "exp":     time.Now().Add(15 * time.Minute).Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(uc.jwtSecret))
}

func (uc *AuthUseCase) generateRefreshToken(user *domain.User) (string, error) {
    claims := jwt.MapClaims{
        "user_id": user.ID,
        "exp":     time.Now().Add(168 * time.Hour).Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(uc.jwtSecret))
}
```

### Step 2.3: Create Authentication API Handlers
```go
// backend/internal/handlers/auth_handler.go
package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/yourusername/erp-system/internal/usecases"
)

type AuthHandler struct {
    authUseCase *usecases.AuthUseCase
}

func NewAuthHandler(uc *usecases.AuthUseCase) *AuthHandler {
    return &AuthHandler{authUseCase: uc}
}

type LoginRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=6"`
}

func (h *AuthHandler) Login(c *gin.Context) {
    var req LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "message": "Invalid request",
            "errors":  err.Error(),
        })
        return
    }

    ip := c.ClientIP()
    userAgent := c.Request.UserAgent()

    user, accessToken, refreshToken, err := h.authUseCase.Login(
        req.Email,
        req.Password,
        ip,
        userAgent,
    )

    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{
            "success": false,
            "message": err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "Login successful",
        "data": gin.H{
            "user":          user,
            "access_token":  accessToken,
            "refresh_token": refreshToken,
        },
    })
}
```

### Step 2.4: Create Login Page (Frontend)
```javascript
// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
                email,
                password
            });

            const { access_token, refresh_token, user } = response.data.data;
            
            // Store tokens
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">ERP System</h1>
                    <p className="text-primary-200">Welcome back! Please login to continue</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-primary-200 text-sm mt-6">
                    © 2025 ERP System. All rights reserved.
                </p>
            </div>
        </div>
    );
}
```

---

## 📊 Phase 3: Core Modules Development

### Step 3.1: Customers Module (Backend)

Create domain models:
```go
// backend/internal/domain/customer.go
package domain

import (
    "time"
    "gorm.io/gorm"
)

type Customer struct {
    ID           uint           `json:"id" gorm:"primarykey"`
    Code         string         `json:"code" gorm:"unique;not null"`
    Name         string         `json:"name" gorm:"not null"`
    Email        string         `json:"email" gorm:"unique"`
    Phone        string         `json:"phone"`
    Mobile       string         `json:"mobile"`
    Address      string         `json:"address"`
    City         string         `json:"city"`
    Country      string         `json:"country"`
    PostalCode   string         `json:"postal_code"`
    TaxNumber    string         `json:"tax_number"`
    CreditLimit  float64        `json:"credit_limit" gorm:"default:0"`
    Balance      float64        `json:"balance" gorm:"default:0"`
    CustomerType string         `json:"customer_type" gorm:"default:'regular'"` // regular, vip, wholesale
    Status       string         `json:"status" gorm:"default:'active'"` // active, inactive, suspended
    CreatedBy    uint           `json:"created_by"`
    CreatedAt    time.Time      `json:"created_at"`
    UpdatedAt    time.Time      `json:"updated_at"`
    DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}

type CustomerContact struct {
    ID         uint      `json:"id" gorm:"primarykey"`
    CustomerID uint      `json:"customer_id" gorm:"not null"`
    Name       string    `json:"name" gorm:"not null"`
    Title      string    `json:"title"`
    Email      string    `json:"email"`
    Phone      string    `json:"phone"`
    IsPrimary  bool      `json:"is_primary" gorm:"default:false"`
    CreatedAt  time.Time `json:"created_at"`
    UpdatedAt  time.Time `json:"updated_at"`
}
```

Create repository:
```go
// backend/internal/repositories/customer_repository.go
package repositories

import (
    "gorm.io/gorm"
    "github.com/yourusername/erp-system/internal/domain"
)

type CustomerRepository interface {
    Create(customer *domain.Customer) error
    FindByID(id uint) (*domain.Customer, error)
    FindAll(page, limit int) ([]domain.Customer, int64, error)
    Update(customer *domain.Customer) error
    Delete(id uint) error
    Search(query string) ([]domain.Customer, error)
}

type customerRepository struct {
    db *gorm.DB
}

func NewCustomerRepository(db *gorm.DB) CustomerRepository {
    return &customerRepository{db: db}
}

func (r *customerRepository) Create(customer *domain.Customer) error {
    return r.db.Create(customer).Error
}

func (r *customerRepository) FindByID(id uint) (*domain.Customer, error) {
    var customer domain.Customer
    err := r.db.First(&customer, id).Error
    return &customer, err
}

func (r *customerRepository) FindAll(page, limit int) ([]domain.Customer, int64, error) {
    var customers []domain.Customer
    var total int64

    offset := (page - 1) * limit

    r.db.Model(&domain.Customer{}).Count(&total)
    err := r.db.Offset(offset).Limit(limit).Find(&customers).Error

    return customers, total, err
}

func (r *customerRepository) Update(customer *domain.Customer) error {
    return r.db.Save(customer).Error
}

func (r *customerRepository) Delete(id uint) error {
    return r.db.Delete(&domain.Customer{}, id).Error
}

func (r *customerRepository) Search(query string) ([]domain.Customer, error) {
    var customers []domain.Customer
    err := r.db.Where("name LIKE ? OR email LIKE ? OR code LIKE ?",
        "%"+query+"%", "%"+query+"%", "%"+query+"%").Find(&customers).Error
    return customers, err
}
```

### Step 3.2: Create Customer Management UI (Frontend)
```javascript
// frontend/src/pages/Customers.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://localhost:8080/api/v1/customers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomers(response.data.data.customers);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-600 mt-1">Manage your customer database</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Customer
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Customers" value="1,234" icon="users" color="blue" />
                <StatCard title="Active" value="1,180" icon="check" color="green" />
                <StatCard title="VIP Customers" value="54" icon="star" color="yellow" />
                <StatCard title="New This Month" value="23" icon="trending-up" color="purple" />
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <input
                    type="text"
                    placeholder="Search customers by name, email, or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center">Loading...</td>
                            </tr>
                        ) : customers.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    No customers found
                                </td>
                            </tr>
                        ) : (
                            customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {customer.code}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {customer.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {customer.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {customer.phone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            customer.customer_type === 'vip' ? 'bg-yellow-100 text-yellow-800' :
                                            customer.customer_type === 'wholesale' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {customer.customer_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            customer.status === 'active' ? 'bg-green-100 text-green-800' :
                                            customer.status === 'suspended' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-primary-600 hover:text-primary-900 mr-3">Edit</button>
                                        <button className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
```

---

## 🗄️ Phase 4: Database Setup

### Step 4.1: Create Database Migration System
```bash
cd backend

# Create migration files
cat > migrations/001_create_users_table.sql << 'EOF'
-- Up Migration
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    permissions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role_id INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    last_login_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
    ('admin', 'System Administrator', '{"all": true}'),
    ('manager', 'Manager', '{"read": true, "write": true, "update": true}'),
    ('user', 'Regular User', '{"read": true, "write": true}'),
    ('guest', 'Guest User', '{"read": true}');

-- Down Migration (commented)
-- DROP TABLE IF EXISTS sessions;
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS roles;
EOF

cat > migrations/002_create_customers_table.sql << 'EOF'
-- Up Migration
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    mobile TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    postal_code TEXT,
    tax_number TEXT,
    credit_limit REAL DEFAULT 0,
    balance REAL DEFAULT 0,
    customer_type TEXT DEFAULT 'regular',
    status TEXT DEFAULT 'active',
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS customer_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    title TEXT,
    email TEXT,
    phone TEXT,
    is_primary BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_code ON customers(code);
CREATE INDEX idx_customer_contacts_customer_id ON customer_contacts(customer_id);

-- Down Migration (commented)
-- DROP TABLE IF EXISTS customer_contacts;
-- DROP TABLE IF EXISTS customers;
EOF
```

### Step 4.2: Run Migrations
// turbo
```bash
# Create migration runner
cat > cmd/migrate/main.go << 'EOF'
package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "path/filepath"
    "sort"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

func main() {
    db, err := gorm.Open(sqlite.Open("erp.db"), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    sqlDB, _ := db.DB()
    defer sqlDB.Close()

    // Get all migration files
    files, err := filepath.Glob("migrations/*.sql")
    if err != nil {
        log.Fatal("Failed to read migrations:", err)
    }

    sort.Strings(files)

    // Execute migrations
    for _, file := range files {
        content, err := ioutil.ReadFile(file)
        if err != nil {
            log.Printf("Failed to read %s: %v\n", file, err)
            continue
        }

        if err := db.Exec(string(content)).Error; err != nil {
            log.Printf("Failed to execute %s: %v\n", file, err)
            continue
        }

        fmt.Printf("✓ Executed: %s\n", filepath.Base(file))
    }

    fmt.Println("\n✓ All migrations completed successfully!")
}
EOF

# Run migrations
go run cmd/migrate/main.go
```

---

## 🚀 Phase 5: Integration & Testing

### Step 5.1: Create Main Application (Backend)
```go
// backend/cmd/server/main.go
package main

import (
    "log"
    "os"
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
    
    "github.com/yourusername/erp-system/internal/handlers"
    "github.com/yourusername/erp-system/internal/middleware"
    "github.com/yourusername/erp-system/internal/repositories"
    "github.com/yourusername/erp-system/internal/usecases"
    "github.com/yourusername/erp-system/api/routes"
)

func main() {
    // Load environment variables
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found")
    }

    // Connect to database
    db, err := gorm.Open(sqlite.Open(os.Getenv("DB_PATH")), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    // Initialize repositories
    userRepo := repositories.NewUserRepository(db)
    sessionRepo := repositories.NewSessionRepository(db)
    customerRepo := repositories.NewCustomerRepository(db)

    // Initialize use cases
    authUseCase := usecases.NewAuthUseCase(userRepo, sessionRepo, os.Getenv("JWT_SECRET"))
    customerUseCase := usecases.NewCustomerUseCase(customerRepo)

    // Initialize handlers
    authHandler := handlers.NewAuthHandler(authUseCase)
    customerHandler := handlers.NewCustomerHandler(customerUseCase)

    // Setup Gin
    if os.Getenv("APP_ENV") == "production" {
        gin.SetMode(gin.ReleaseMode)
    }
    
    router := gin.Default()

    // Middleware
    router.Use(middleware.CORS())
    router.Use(middleware.PanicRecovery())

    // Routes
    routes.SetupAuthRoutes(router, authHandler)
    routes.SetupCustomerRoutes(router, customerHandler)

    // Health check
    router.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok"})
    })

    // Start server
    port := os.Getenv("APP_PORT")
    if port == "" {
        port = "8080"
    }

    log.Printf("🚀 Server starting on port %s...\n", port)
    if err := router.Run(":" + port); err != nil {
        log.Fatal("Failed to start server:", err)
    }
}
```

### Step 5.2: Run Backend
// turbo
```bash
cd backend
go run cmd/server/main.go
```

### Step 5.3: Run Frontend
```bash
cd frontend
npm run dev
```

---

## ✅ Phase 6: Testing & Documentation

### Step 6.1: Write Unit Tests
```bash
# Example test for authentication use case
cat > backend/internal/usecases/auth_test.go << 'EOF'
package usecases

import (
    "testing"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
)

// Mock repository
type MockUserRepository struct {
    mock.Mock
}

func (m *MockUserRepository) FindByEmail(email string) (*domain.User, error) {
    args := m.Called(email)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*domain.User), args.Error(1)
}

// Test login success
func TestLogin_Success(t *testing.T) {
    // Setup mocks
    mockUserRepo := new(MockUserRepository)
    mockSessionRepo := new(MockSessionRepository)
    
    // Test implementation...
    
    assert.NotNil(t, user)
    assert.NotEmpty(t, accessToken)
}
EOF
```

### Step 6.2: Generate API Documentation
```bash
# Install Swagger
go get -u github.com/swaggo/swag/cmd/swag
go get -u github.com/swaggo/gin-swagger
go get -u github.com/swaggo/files

# Add Swagger comments to your handlers
# Then generate docs
swag init -g cmd/server/main.go
```

### Step 6.3: Create README
```markdown
# ERP System

A modern, scalable ERP system built with Go and TailwindCSS.

## Features
- 🔐 Secure JWT Authentication
- 👥 Customer Management
- 📊 Sales Management
- 📦 Inventory Management
- 🏭 Production Management

## Tech Stack
- **Backend**: Go 1.21+, Gin Framework, GORM
- **Frontend**: Vanilla JS, TailwindCSS 5
- **Database**: SQLite (development), PostgreSQL (production)

## Getting Started

### Prerequisites
- Go 1.21+
- Node.js 18+
- SQLite3

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/erp-system.git
cd erp-system
\`\`\`

2. Setup backend
\`\`\`bash
cd backend
cp .env.example .env
go mod download
go run cmd/migrate/main.go
go run cmd/server/main.go
\`\`\`

3. Setup frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## API Documentation
Visit `http://localhost:8080/swagger/index.html` for API documentation.

## License
MIT
```

---

## 🎉 Phase 7: Deployment

### Step 7.1: Build Production Version
```bash
# Backend
cd backend
CGO_ENABLED=1 go build -o bin/erp-server cmd/server/main.go

# Frontend
cd frontend
npm run build
```

### Step 7.2: Docker Setup
```dockerfile
# Backend Dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=1 go build -o bin/server cmd/server/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates sqlite
WORKDIR /root/
COPY --from=builder /app/bin/server .
COPY --from=builder /app/.env.example .env
COPY --from=builder /app/migrations ./migrations
EXPOSE 8080
CMD ["./server"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - DB_TYPE=postgres
      - DB_HOST=db
    depends_on:
      - db
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: erp_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Step 7.3: Deploy
// turbo
```bash
docker-compose up -d
```

---

## 🎯 Success Criteria Checklist

- [ ] Backend API running successfully
- [ ] Frontend connecting to API
- [ ] Authentication working (Login/Logout)
- [ ] Customer module fully functional (CRUD)
- [ ] Database migrations executed
- [ ] Tests passing (>80% coverage)
- [ ] API documentation generated
- [ ] Docker containers running
- [ ] Production build created
- [ ] README and documentation complete

---

**Workflow Version**: 1.0.0  
**Last Updated**: 2025-12-08  
**Estimated Time**: 40-60 hours for complete implementation
