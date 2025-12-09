# 🚀 ERP System Development - Enhanced Master Prompt

## 📌 Executive Summary

أنشئ نظام ERP (Enterprise Resource Planning) متكامل، احترافي، وقابل للتوسعة باستخدام **Go** للـ Backend و **TailwindCSS 5** للـ Frontend، مع التركيز على الأداء العالي، الأمان المتقدم، والمعمارية النظيفة.

**الهدف الأساسي**: بناء نظام إدارة موارد المؤسسات يشمل 4 موديلات أساسية قابلة للتوسع لتشمل 20+ موديول مستقبلاً.

---

## 🎯 Core Vision & Objectives

### Primary Goals
1. **نظام قابل للتوسعة Infinitely Scalable**: إضافة موديولات جديدة دون تعديل الكود الأساسي
2. **أداء عالي High Performance**: استجابة < 200ms للعمليات القياسية
3. **أمان متقدم Enterprise-Grade Security**: JWT, RBAC, Audit Logging
4. **واجهة مستخدم حديثة Modern UI/UX**: تجربة مستخدم سلسة واحترافية
5. **جودة كود عالية Clean Code**: >80% test coverage, documented

### Success Metrics
- ⚡ Response time: < 200ms (average)
- 🔒 Zero critical security vulnerabilities
- ✅ Test coverage: > 80%
- 📱 100% responsive design
- 🌍 Full RTL support (Arabic + English)
- 🚀 Can handle 10,000+ concurrent users

---

## 🏗️ Architecture Overview

### Technology Stack

#### Backend (Go 1.21+)
```
Core Framework: Gin (HTTP Router)
ORM: GORM
Database: SQLite (dev) → PostgreSQL (production)
Authentication: JWT (golang-jwt/jwt)
Validation: go-playground/validator
Password Hashing: bcrypt (cost factor: 12)
Environment Management: godotenv
Testing: testify
API Documentation: Swagger/OpenAPI
```

#### Frontend (Modern Web)
```
Build Tool: Vite
Styling: TailwindCSS 5
HTTP Client: Axios
Routing: React Router DOM (if using React) or Vanilla JS Router
Charts: Chart.js / Recharts
Icons: Heroicons / Lucide Icons
Internationalization: i18next
State Management: Context API / Zustand (if needed)
```

#### Database
```
Development: SQLite 3
Production: PostgreSQL 15+
Migration Tool: Custom Go-based migrator
Backup: Automated daily backups
```

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │Customers │  │  Sales   │  │Inventory │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       └─────────────┴─────────────┴─────────────┘           │
│                       │ HTTP/REST API                       │
└───────────────────────┼─────────────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────────────┐
│                   API Gateway / Router                      │
│                 (Gin Framework + Middleware)                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │Customers │  │  Sales   │  │Inventory │   │
│  │ Handlers │  │ Handlers │  │ Handlers │  │ Handlers │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │         │
│  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐   │
│  │   Auth   │  │Customers │  │  Sales   │  │Inventory │   │
│  │ Use Cases│  │Use Cases │  │Use Cases │  │Use Cases │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │         │
│  ┌────┴─────────────┴──────────────┴─────────────┴─────┐   │
│  │              Repository Layer (GORM)               │   │
│  └────────────────────────┬────────────────────────────┘   │
└───────────────────────────┼─────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                      Database Layer                         │
│                  SQLite / PostgreSQL                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Core Modules (Phase 1)

### 1. إدارة العملاء (Customer Management) 👥

**الوصف**: إدارة شاملة لقاعدة بيانات العملاء

**المميزات الأساسية**:
- ✅ إضافة/تعديل/حذف/عرض العملاء (Full CRUD)
- ✅ تصنيف العملاء (عادي، VIP، جملة)
- ✅ إدارة معلومات الاتصال (Contacts)
- ✅ حد ائتماني (Credit Limit)
- ✅ تتبع الرصيد (Balance Tracking)
- ✅ Search & Filter capabilities
- ✅ Export to CSV/Excel/PDF

**الجداول المطلوبة**:
```sql
customers (
  id, code, name, email, phone, mobile,
  address, city, country, postal_code,
  tax_number, credit_limit, balance,
  customer_type, status, created_by,
  created_at, updated_at, deleted_at
)

customer_contacts (
  id, customer_id, name, title,
  email, phone, is_primary,
  created_at, updated_at
)
```

**API Endpoints**:
```
GET    /api/v1/customers           - List customers (with pagination)
POST   /api/v1/customers           - Create customer
GET    /api/v1/customers/:id       - Get customer details
PUT    /api/v1/customers/:id       - Update customer
DELETE /api/v1/customers/:id       - Delete customer (soft delete)
GET    /api/v1/customers/search    - Search customers
POST   /api/v1/customers/:id/contacts - Add contact
```

**UI Components**:
- Customer List (Table with search/filter)
- Customer Form (Add/Edit modal)
- Customer Detail View
- Contact Management
- Customer Statistics Widget

---

### 2. إدارة المبيعات (Sales Management) 💰

**الوصف**: نظام كامل لإدارة طلبات المبيعات والفواتير

**المميزات الأساسية**:
- ✅ إنشاء طلبات البيع (Sales Orders)
- ✅ إصدار الفواتير (Invoices)
- ✅ تتبع حالة الطلب (Status Tracking)
- ✅ حساب الضرائب والخصومات
- ✅ ربط مع العملاء والمنتجات
- ✅ تقارير المبيعات
- ✅ Payment tracking

**الجداول المطلوبة**:
```sql
sales_orders (
  id, order_number, customer_id,
  order_date, delivery_date, status,
  total_amount, tax_amount, discount_amount,
  net_amount, notes, created_by, approved_by,
  created_at, updated_at, deleted_at
)

sales_order_items (
  id, order_id, product_id, quantity,
  unit_price, discount, tax_rate, total,
  created_at, updated_at
)

invoices (
  id, invoice_number, order_id, customer_id,
  invoice_date, due_date, total_amount,
  paid_amount, status, payment_method,
  created_at, updated_at
)

payments (
  id, invoice_id, payment_date, amount,
  payment_method, reference_number, notes,
  created_by, created_at
)
```

**API Endpoints**:
```
GET    /api/v1/sales/orders          - List sales orders
POST   /api/v1/sales/orders          - Create order
GET    /api/v1/sales/orders/:id      - Get order details
PUT    /api/v1/sales/orders/:id      - Update order
DELETE /api/v1/sales/orders/:id      - Cancel order
POST   /api/v1/sales/orders/:id/approve - Approve order
GET    /api/v1/sales/invoices        - List invoices
POST   /api/v1/sales/invoices        - Create invoice
POST   /api/v1/sales/payments        - Record payment
```

**UI Components**:
- Sales Dashboard (Charts & KPIs)
- Order List & Management
- Invoice Generator
- Payment Recording Form
- Sales Reports

---

### 3. إدارة المخزون (Inventory Management) 📦

**الوصف**: نظام شامل لإدارة المخزون وحركة المنتجات

**المميزات الأساسية**:
- ✅ إدارة المنتجات (Products)
- ✅ تصنيفات المنتجات (Categories)
- ✅ تتبع حركة المخزون (Stock Movements)
- ✅ المخازن المتعددة (Multi-Warehouse)
- ✅ مستويات إعادة الطلب (Reorder Levels)
- ✅ تنبيهات المخزون المنخفض
- ✅ Barcode/SKU management
- ✅ Inventory valuation

**الجداول المطلوبة**:
```sql
products (
  id, sku, barcode, name, description,
  category_id, unit_id, cost_price,
  selling_price, reorder_level, max_stock_level,
  current_stock, is_active, image_url,
  created_at, updated_at, deleted_at
)

categories (
  id, name, parent_id, description,
  is_active, created_at, updated_at
)

units (
  id, name, symbol, description,
  created_at, updated_at
)

warehouses (
  id, code, name, address, manager_id,
  is_active, created_at, updated_at
)

stock_movements (
  id, product_id, warehouse_id,
  movement_type, quantity, cost_per_unit,
  from_location_id, to_location_id,
  reference_type, reference_id, notes,
  created_by, created_at
)

stock_levels (
  id, product_id, warehouse_id, quantity,
  updated_at
)
```

**API Endpoints**:
```
GET    /api/v1/inventory/products       - List products
POST   /api/v1/inventory/products       - Create product
GET    /api/v1/inventory/products/:id   - Get product
PUT    /api/v1/inventory/products/:id   - Update product
DELETE /api/v1/inventory/products/:id   - Delete product
GET    /api/v1/inventory/categories     - List categories
POST   /api/v1/inventory/stock-movement - Record movement
GET    /api/v1/inventory/stock-levels   - Get stock levels
GET    /api/v1/inventory/low-stock      - Low stock alert
```

**UI Components**:
- Product Catalog
- Stock Level Dashboard
- Stock Movement History
- Low Stock Alerts
- Category Management
- Warehouse Management

---

### 4. إدارة الإنتاج (Production Management) 🏭

**الوصف**: نظام لإدارة أوامر الإنتاج وتتبع العمليات

**المميزات الأساسية**:
- ✅ أوامر الإنتاج (Production Orders)
- ✅ قوائم المكونات (Bill of Materials - BOM)
- ✅ تتبع الدفعات (Batch Tracking)
- ✅ تكلفة الإنتاج (Production Costing)
- ✅ جدولة الإنتاج
- ✅ تقارير الإنتاج
- ✅ Waste tracking

**الجداول المطلوبة**:
```sql
production_orders (
  id, order_number, product_id, quantity,
  start_date, end_date, planned_start,
  planned_end, status, actual_quantity,
  waste_quantity, notes, created_by,
  approved_by, created_at, updated_at, deleted_at
)

bill_of_materials (
  id, product_id, component_id, quantity,
  unit_id, waste_percentage, cost,
  is_active, created_at, updated_at
)

production_batches (
  id, production_order_id, batch_number,
  quantity, status, start_time, end_time,
  supervisor_id, notes, created_at, updated_at
)

production_costs (
  id, production_order_id, cost_type,
  amount, description, created_at
)
```

**API Endpoints**:
```
GET    /api/v1/production/orders         - List production orders
POST   /api/v1/production/orders         - Create order
GET    /api/v1/production/orders/:id     - Get order details
PUT    /api/v1/production/orders/:id     - Update order
POST   /api/v1/production/orders/:id/start - Start production
POST   /api/v1/production/orders/:id/complete - Complete order
GET    /api/v1/production/bom            - List BOMs
POST   /api/v1/production/bom            - Create BOM
```

**UI Components**:
- Production Dashboard
- Production Order Management
- BOM Builder
- Batch Tracking
- Production Cost Analysis
- Production Schedule (Calendar View)

---

## 🔐 Authentication & Authorization System

### Authentication Flow

```
┌────────────┐        ┌──────────────┐        ┌──────────────┐
│   Client   │        │   Backend    │        │   Database   │
└─────┬──────┘        └──────┬───────┘        └──────┬───────┘
      │                      │                        │
      │  POST /login         │                        │
      │ {email, password}    │                        │
      ├─────────────────────>│                        │
      │                      │  Find user by email    │
      │                      ├───────────────────────>│
      │                      │                        │
      │                      │<───────────────────────┤
      │                      │  User data             │
      │                      │                        │
      │                      │  Verify password       │
      │                      │  (bcrypt compare)      │
      │                      │                        │
      │                      │  Generate JWT tokens   │
      │                      │  - Access (15min)      │
      │                      │  - Refresh (7 days)    │
      │                      │                        │
      │                      │  Create session        │
      │                      ├───────────────────────>│
      │                      │                        │
      │  Response:           │                        │
      │  {user, tokens}      │                        │
      │<─────────────────────┤                        │
      │                      │                        │
      │  Store tokens        │                        │
      │  in localStorage     │                        │
      │                      │                        │
```

### RBAC (Role-Based Access Control)

**Roles**:
1. **Super Admin** (سوبر أدمن)
   - جميع الصلاحيات
   - إدارة المستخدمين والأدوار
   - تكوين النظام

2. **Admin** (مدير النظام)
   - معظم الصلاحيات
   - لا يمكنه حذف المستخدمين الآخرين

3. **Manager** (مدير)
   - صلاحيات القراءة والكتابة والتعديل
   - لا يمكنه الحذف النهائي

4. **User** (مستخدم عادي)
   - صلاحيات القراءة والكتابة فقط
   - لا يمكنه الحذف

5. **Guest** (ضيف)
   - صلاحيات قراءة فقط

**Permissions Matrix**:
```
Action          | Super Admin | Admin | Manager | User | Guest
----------------|-------------|-------|---------|------|-------
Create          |     ✓       |   ✓   |    ✓    |  ✓   |   ✗
Read            |     ✓       |   ✓   |    ✓    |  ✓   |   ✓
Update          |     ✓       |   ✓   |    ✓    |  ✓   |   ✗
Delete (Soft)   |     ✓       |   ✓   |    ✓    |  ✗   |   ✗
Delete (Hard)   |     ✓       |   ✗   |    ✗    |  ✗   |   ✗
Manage Users    |     ✓       |   ✓   |    ✗    |  ✗   |   ✗
System Config   |     ✓       |   ✗   |    ✗    |  ✗   |   ✗
```

### Security Features

1. **Password Policy**:
   - Minimum 8 characters
   - Must contain: uppercase, lowercase, number, special character
   - Password history (prevent reuse of last 5 passwords)
   - Bcrypt hashing with cost factor 12

2. **Session Management**:
   - Access token expiry: 15 minutes
   - Refresh token expiry: 7 days
   - Automatic token refresh
   - Concurrent session limit: 3 devices
   - Force logout on password change

3. **Security Mechanisms**:
   - Rate limiting: 100 requests/minute
   - Brute-force protection: 5 failed attempts = 15min lockout
   - IP whitelisting/blacklisting
   - CORS configuration
   - XSS protection
   - SQL injection prevention (prepared statements)
   - CSRF protection

4. **Audit Logging**:
   ```sql
   audit_logs (
     id, user_id, action, resource_type,
     resource_id, old_values, new_values,
     ip_address, user_agent, created_at
   )
   ```

---

## 🎨 UI/UX Design Guidelines

### Color Scheme

**Primary Colors** (Dark Blue Spectrum):
```css
--primary-50:  #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;  /* Main Primary */
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;  /* Darkest Blue */
```

**Secondary Colors** (Light Silver Spectrum):
```css
--silver-50:  #f9fafb;
--silver-100: #f3f4f6;  /* Main Silver */
--silver-200: #e5e7eb;
--silver-300: #d1d5db;
--silver-400: #9ca3af;
--silver-500: #6b7280;
```

**Accent & Status Colors**:
```css
--accent:   #60a5fa;  /* Electric Blue */
--success:  #10b981;  /* Emerald */
--warning:  #f59e0b;  /* Amber */
--error:    #ef4444;  /* Red */
--info:     #06b6d4;  /* Cyan */
```

### Typography

**Font Family**:
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

**Font Sizes**:
```css
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
--text-4xl:  2.25rem;   /* 36px */
```

### Spacing System
```css
--space-1:  0.25rem;  /* 4px */
--space-2:  0.5rem;   /* 8px */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px */
--space-6:  1.5rem;   /* 24px */
--space-8:  2rem;     /* 32px */
--space-12: 3rem;     /* 48px */
```

### Component Library

**Buttons**:
```html
<!-- Primary Button -->
<button class="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
  Primary Action
</button>

<!-- Secondary Button -->
<button class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
  Secondary Action
</button>

<!-- Danger Button -->
<button class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
  Delete
</button>
```

**Input Fields**:
```html
<div class="mb-4">
  <label class="block text-sm font-medium text-gray-700 mb-2">
    Field Label
  </label>
  <input 
    type="text" 
    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
    placeholder="Enter value..."
  />
</div>
```

**Cards**:
```html
<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
  <!-- Card content -->
</div>
```

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header (Logo, Search, Notifications, User Profile)        │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│          │  Dashboard Overview                              │
│          │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│          │  │Stats │ │Stats │ │Stats │ │Stats │           │
│  Sidebar │  │Widget│ │Widget│ │Widget│ │Widget│           │
│          │  └──────┘ └──────┘ └──────┘ └──────┘           │
│  - Home  │                                                  │
│  - Sales │  Recent Activities Chart                        │
│  - Inv.  │  ┌────────────────────────────────────┐         │
│  - Prod. │  │                                    │         │
│  - Cust. │  │      Sales Chart (Line/Bar)        │         │
│          │  │                                    │         │
│          │  └────────────────────────────────────┘         │
│          │                                                  │
│          │  Quick Actions & Recent Items                   │
│          │  ┌────────────────┬───────────────────┐         │
│          │  │ Recent Orders  │ Recent Customers  │         │
│          │  │                │                   │         │
│          │  └────────────────┴───────────────────┘         │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

### Animations & Transitions

**Hover Effects**:
```css
.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.02);
}
```

**Loading States**:
```html
<!-- Skeleton Loader -->
<div class="animate-pulse">
  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
</div>

<!-- Spinner -->
<svg class="animate-spin h-5 w-5 text-primary-600" viewBox="0 0 24 24">
  <!-- spinner SVG path -->
</svg>
```

---

## 📊 Dashboard Requirements

### Main Dashboard Widgets

1. **Key Performance Indicators (KPIs)**:
   - Total Sales (Today, This Week, This Month)
   - Total Orders (Pending, In Progress, Completed)
   - Low Stock Items Count
   - Active Production Orders
   - Customer Count (Total, New This Month)

2. **Charts**:
   - Sales Trend (Line Chart - Last 30 days)
   - Top Products (Bar Chart - Top 10)
   - Sales by Category (Pie Chart)
   - Monthly Revenue Comparison (Column Chart)

3. **Recent Activities**:
   - Latest Sales Orders (Last 10)
   - Recent Customer Registrations
   - Low Stock Alerts
   - Production Orders Due Soon

4. **Quick Actions**:
   - Create New Order
   - Add Customer
   - Record Stock Movement
   - Generate Report

### Widget Example Implementation

```javascript
// Sales KPI Widget
function SalesKPIWidget({ title, value, change, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className={`flex items-center mt-2 text-sm ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
          {icon}
        </div>
      </div>
    </div>
  );
}
```

---

## 🗄️ Database Design Best Practices

### Naming Conventions

- **Tables**: lowercase, plural, snake_case (e.g., `sales_orders`)
- **Columns**: lowercase, snake_case (e.g., `order_date`)
- **Indexes**: `idx_table_column` (e.g., `idx_customers_email`)
- **Foreign Keys**: `fk_table_referenced_table` (e.g., `fk_orders_customers`)

### Standard Fields

Every table should include:
```sql
id INT PRIMARY KEY AUTOINCREMENT
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
deleted_at DATETIME (for soft deletes)
```

### Relationships

**One-to-Many**:
```sql
-- Customer has many Orders
CREATE TABLE customers (id, name, ...);
CREATE TABLE orders (id, customer_id REFERENCES customers(id), ...);
```

**Many-to-Many**:
```sql
-- Orders have many Products through order_items
CREATE TABLE orders (id, ...);
CREATE TABLE products (id, ...);
CREATE TABLE order_items (
  id,
  order_id REFERENCES orders(id),
  product_id REFERENCES products(id),
  ...
);
```

### Indexing Strategy

1. **Always Index**:
   - Primary keys (automatic)
   - Foreign keys
   - Columns used in WHERE clauses frequently
   - Columns used in JOIN operations

2. **Consider Indexing**:
   - Columns used in ORDER BY
   - Columns used in GROUP BY
   - Unique constraints

3. **Composite Indexes**:
   ```sql
   CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);
   ```

---

## 🚀 Deployment & DevOps

### Environment Configuration

**Development**:
```env
APP_ENV=development
DB_TYPE=sqlite
DB_PATH=./dev.db
APP_DEBUG=true
LOG_LEVEL=debug
```

**Staging**:
```env
APP_ENV=staging
DB_TYPE=postgres
DB_HOST=staging-db.internal
APP_DEBUG=false
LOG_LEVEL=info
```

**Production**:
```env
APP_ENV=production
DB_TYPE=postgres
DB_HOST=prod-db.internal
APP_DEBUG=false
LOG_LEVEL=error
ENABLE_METRICS=true
```

### Docker Deployment

**Multi-stage Build** for optimized images:
```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-w -s" -o bin/server cmd/server/main.go

# Final stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/bin/server .
EXPOSE 8080
CMD ["./server"]
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-go@v4
        with:
          go-version: '1.21'
      - run: go test -v -cover ./...
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: docker build -t erp-system:${{ github.sha }} .
      - run: docker push erp-system:${{ github.sha }}
  
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: kubectl set image deployment/erp-system erp-system=erp-system:${{ github.sha }}
```

---

## 📈 Future Expansion Modules

### Phase 2 Modules (Next 6 months)

1. **إدارة المشتريات (Procurement)**
   - Purchase Orders
   - Supplier Management
   - Purchase Invoices
   - Payment Management

2. **المحاسبة (Accounting)**
   - General Ledger
   - Accounts Payable/Receivable
   - Financial Statements
   - Budget Management

3. **إدارة الموارد البشرية (HR)**
   - Employee Management
   - Attendance & Leave
   - Payroll
   - Performance Reviews

### Phase 3 Modules (6-12 months)

4. **إدارة المشاريع (Project Management)**
   - Project Tracking
   - Task Management
   - Time Tracking
   - Gantt Charts

5. **التقارير والتحليلات (Reporting & BI)**
   - Custom Report Builder
   - Executive Dashboard
   - Data Export
   - Scheduled Reports

6. **الذكاء الاصطناعي (AI/ML Features)**
   - Sales Forecasting
   - Demand Prediction
   - Smart Recommendations
   - Anomaly Detection

---

## ✅ Implementation Checklist

### Backend Tasks

- [ ] Setup Go project structure (cmd, internal, pkg)
- [ ] Initialize Go modules and dependencies
- [ ] Create .env configuration
- [ ] Implement domain models (User, Customer, Product, Order, etc.)
- [ ] Create repositories (interfaces + implementations)
- [ ] Implement use cases/business logic
- [ ] Build HTTP handlers with Gin
- [ ] Setup middleware (Auth, CORS, Recovery, Logging)
- [ ] Implement JWT authentication system
- [ ] Create RBAC system
- [ ] Setup database migrations
- [ ] Write unit tests (>80% coverage)
- [ ] Generate Swagger API documentation
- [ ] Implement rate limiting
- [ ] Add audit logging
- [ ] Setup error handling
- [ ] Create health check endpoint

### Frontend Tasks

- [ ] Initialize Vite project
- [ ] Install and configure TailwindCSS 5
- [ ] Setup routing system
- [ ] Create design system (colors, typography, components)
- [ ] Build reusable UI components (Button, Input, Card, etc.)
- [ ] Implement authentication pages (Login, Register)
- [ ] Create main Dashboard layout
- [ ] Build Customer module UI
- [ ] Build Sales module UI
- [ ] Build Inventory module UI
- [ ] Build Production module UI
- [ ] Implement charts and data visualization
- [ ] Add responsive design for mobile
- [ ] Setup internationalization (i18n) for Arabic & English
- [ ] Implement RTL support
- [ ] Add loading states and error handling
- [ ] Create search and filter functionality
- [ ] Add export features (CSV, PDF)
- [ ] Optimize performance (lazy loading, code splitting)

### Database Tasks

- [ ] Design database schema
- [ ] Create migration files
- [ ] Setup SQLite for development
- [ ] Configure PostgreSQL for production
- [ ] Create indexes
- [ ] Setup foreign key constraints
- [ ] Implement soft delete
- [ ] Add audit logging table
- [ ] Create seed data for testing

### DevOps Tasks

- [ ] Create Dockerfile (backend)
- [ ] Create Dockerfile (frontend)
- [ ] Setup docker-compose.yml
- [ ] Configure CI/CD pipeline
- [ ] Setup automated testing
- [ ] Configure monitoring and logging
- [ ] Implement backup strategy
- [ ] Setup SSL certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Setup production environment

### Documentation Tasks

- [ ] Write README.md
- [ ] Create API documentation (Swagger)
- [ ] Write developer guide
- [ ] Create user manual
- [ ] Document deployment process
- [ ] Create architecture diagrams
- [ ] Write contribution guidelines

---

## 🎓 Code Quality Standards

### Go Code Standards

```go
// ✅ Good: Clear naming, documentation, error handling
// GetCustomerByID retrieves a customer by their unique identifier
func (s *CustomerService) GetCustomerByID(id uint) (*domain.Customer, error) {
    if id == 0 {
        return nil, errors.New("invalid customer ID")
    }
    
    customer, err := s.repo.FindByID(id)
    if err != nil {
        return nil, fmt.Errorf("failed to find customer: %w", err)
    }
    
    return customer, nil
}

// ❌ Bad: No documentation, poor error handling
func (s *CustomerService) Get(i uint) (*domain.Customer, error) {
    c, _ := s.repo.FindByID(i)
    return c, nil
}
```

### Frontend Code Standards

```javascript
// ✅ Good: Descriptive naming, proper error handling
async function fetchCustomers() {
    try {
        setLoading(true);
        const response = await api.get('/customers');
        setCustomers(response.data.data.customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        showNotification('Failed to load customers', 'error');
    } finally {
        setLoading(false);
    }
}

// ❌ Bad: Poor naming, no error handling
async function get() {
    const r = await api.get('/customers');
    setData(r.data);
}
```

---

## 🎯 Performance Targets

### Backend Performance

- **API Response Time**: < 200ms (average)
- **Database Query Time**: < 50ms (average)
- **Concurrent Users**: 10,000+
- **Requests per Second**: 1,000+
- **Memory Usage**: < 512MB (idle)

### Frontend Performance

- **First Contentful Paint (FCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

### Database Performance

- **Connection Pool**: 25-50 connections
- **Query Cache**: Enabled
- **Index Usage**: > 95% of queries

---

## 📞 Support & Maintenance

### Monitoring

- **Application Metrics**: Prometheus + Grafana
- **Error Tracking**: Sentry
- **Log Aggregation**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Uptime Monitoring**: UptimeRobot or Pingdom
- **Performance Monitoring**: New Relic or DataDog

### Backup Strategy

**Automated Backups**:
- **Database**: Full backup daily at 2 AM, incremental every hour
- **Files**: Daily backup of uploaded files
- **Retention**: 30 days
- **Off-site Storage**: AWS S3 or Google Cloud Storage

**Disaster Recovery**:
- **RTO (Recovery Time Objective)**: < 4 hours
- **RPO (Recovery Point Objective)**: < 1 hour
- **Regular DR drills**: Quarterly

---

## 🏁 Success Criteria

### Technical Success

- ✅ All core modules (4) fully functional
- ✅ >80% test coverage
- ✅ <200ms average API response time
- ✅ Zero critical security vulnerabilities
- ✅ Complete API documentation
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ RTL support for Arabic
- ✅ WCAG 2.1 Level AA accessibility

### Business Success

- ✅ User-friendly interface (User acceptance testing passed)
- ✅ Reliable system (99.9% uptime)
- ✅ Scalable architecture (handles growth)
- ✅ Easy to maintain (clean code, good documentation)
- ✅ Cost-effective (optimized resource usage)

---

## 📝 Usage Instructions

### For AI/LLM:

عند استخدام هذا البرومبت، يجب عليك:

1. **البدء بالهيكل**: إنشاء هيكل المشروع الكامل أولاً
2. **التسلسل المنطقي**: 
   - Database → Backend → Frontend → Integration
3. **الالتزام بالمعايير**: اتباع جميع القواعد المذكورة في `.agent/erp_system_rules.md`
4. **الكود الكامل**: كتابة كود كامل وجاهز للتنفيذ، وليس أمثلة فقط
5. **التوثيق**: إضافة تعليقات واضحة في الكود
6. **الاختبار**: كتابة اختبارات لكل وظيفة رئيسية
7. **التحقق**: التأكد من عمل كل جزء قبل الانتقال للتالي

### الناتج المتوقع:

```
erp-system/
├── backend/          # Go application (ready to run)
├── frontend/         # Web application (ready to deploy)
├── docs/             # Complete documentation
├── docker-compose.yml
└── README.md
```

**الأمر لتشغيل المشروع**:
```bash
# Clone and setup
git clone <repo>
cd erp-system

# Start with Docker
docker-compose up -d

# Or manually
cd backend && go run cmd/server/main.go &
cd frontend && npm run dev
```

الوصول إلى التطبيق: `http://localhost:3000`

---

**Prompt Version**: 2.0.0  
**Last Updated**: 2025-12-08  
**Maintained By**: Development Team  
**License**: Proprietary

---

## 🎉 Quick Start Example

لإنشاء مشروع ERP جديد باستخدام هذا البرومبت:

```
أنشئ نظام ERP كامل باتباع جميع المواصفات المذكورة في هذا البرومبت.
ابدأ بإنشاء هيكل المشروع، ثم قاعدة البيانات، ثم الـ Backend، ثم الـ Frontend.
تأكد من:
1. استخدام Go للـ Backend
2. استخدام TailwindCSS 5 للـ Frontend
3. تطبيق جميع قواعد الأمان والأداء
4. إنشاء الموديلات الأربعة الأساسية: Customers, Sales, Inventory, Production
5. واجهة مستخدم حديثة بالألوان المحددة (Blue & Silver)
6. نظام تسجيل دخول كامل مع JWT
7. Dashboard احترافية مع Widgets وCharts

ابدأ الآن!
```

---

**End of Enhanced Master Prompt** 🚀
