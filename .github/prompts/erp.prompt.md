---
agent: agent
---
Define the task to achieve, including specific requirements, constraints, and success criteria.
# ERP System - Quick Reference Rules

## 🎯 Overview
هذه قواعد سريعة للرجوع إليها أثناء تطوير نظام ERP. للتفاصيل الكاملة، راجع `erp_system_rules.md`

---

## 🚀 Quick Rules

### Backend (Go)
- ✅ استخدم Clean Architecture (domain, usecases, repositories, handlers)
- ✅ Gin Framework للـ HTTP routing
- ✅ GORM للـ ORM
- ✅ JWT للـ Authentication (15min access, 7 days refresh)
- ✅ Bcrypt للـ password hashing (cost: 12)
- ✅ RESTful API design مع `/api/v1/` prefix
- ✅ Validation على جميع المدخلات
- ✅ Error handling شامل
- ✅ Structured logging
- ✅ >80% test coverage

### Frontend (TailwindCSS)
- ✅ Vite كـ build tool
- ✅ TailwindCSS 5 للتصميم
- ✅ Axios للـ HTTP requests
- ✅ Inter font من Google Fonts
- ✅ Colors: Primary (Dark Blue #1e3a8a), Secondary (Silver #f3f4f6)
- ✅ Responsive design إلزامي
- ✅ RTL support للعربية
- ✅ Loading states + Error states + Empty states
- ✅ Smooth animations (200-300ms transitions)

### Database
- ✅ SQLite في Development
- ✅ PostgreSQL في Production
- ✅ Migrations منظمة ومرقمة
- ✅ Foreign keys + Indexes على الحقول المهمة
- ✅ Soft delete (deleted_at column)
- ✅ Timestamps (created_at, updated_at) في كل جدول
- ✅ Naming: lowercase, snake_case, plural

### Security
- ✅ JWT tokens (Access 15min, Refresh 7 days)
- ✅ RBAC (Super Admin, Admin, Manager, User, Guest)
- ✅ Rate limiting (100 req/min)
- ✅ CORS configuration
- ✅ Input sanitization
- ✅ SQL injection protection (prepared statements)
- ✅ Audit logging للعمليات الحساسة

### API Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "errors": []
}
```

### Standard HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

## 📁 Project Structure

```
erp-system/
├── backend/
│   ├── cmd/
│   │   ├── server/main.go
│   │   └── migrate/main.go
│   ├── internal/
│   │   ├── domain/
│   │   ├── usecases/
│   │   ├── repositories/
│   │   ├── handlers/
│   │   └── middleware/
│   ├── api/
│   ├── pkg/
│   ├── migrations/
│   ├── configs/
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── assets/
│   │   ├── styles/
│   │   └── locales/
│   └── public/
└── docs/
```

---

## 🗄️ Core Tables

### Users & Auth
- users (id, username, email, password_hash, role_id, is_active, last_login_at, ...)
- roles (id, name, description, permissions)
- sessions (id, user_id, access_token, refresh_token, expires_at, ...)

### Customers
- customers (id, code, name, email, phone, address, customer_type, status, ...)
- customer_contacts (id, customer_id, name, email, phone, is_primary, ...)

### Sales
- sales_orders (id, order_number, customer_id, order_date, total_amount, status, ...)
- sales_order_items (id, order_id, product_id, quantity, unit_price, ...)
- invoices (id, invoice_number, order_id, customer_id, total_amount, paid_amount, ...)

### Inventory
- products (id, sku, name, category_id, cost_price, selling_price, ...)
- categories (id, name, parent_id, description, ...)
- stock_movements (id, product_id, movement_type, quantity, ...)
- warehouses (id, code, name, address, manager_id, ...)

### Production
- production_orders (id, order_number, product_id, quantity, status, ...)
- bill_of_materials (id, product_id, component_id, quantity, ...)
- production_batches (id, production_order_id, batch_number, status, ...)

---

## 🎨 UI Components

### Button
```html
<button class="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
  Click Me
</button>
```

### Input
```html
<input 
  type="text" 
  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
  placeholder="Enter text..."
/>
```

### Card
```html
<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <!-- Content -->
</div>
```

---

## 🔥 Common Commands

### Backend
```bash
# Run server
go run cmd/server/main.go

# Run migrations
go run cmd/migrate/main.go

# Run tests
go test -v -cover ./...

# Build
go build -o bin/server cmd/server/main.go
```

### Frontend
```bash
# Install dependencies
npm install

# Dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

## ✅ Quick Checklist

### Before Starting
- [ ] Read full documentation in `erp_system_rules.md`
- [ ] Review workflow in `.agent/workflows/erp-development.md`
- [ ] Setup development environment

### During Development
- [ ] Follow clean architecture
- [ ] Write tests as you go
- [ ] Add comments for complex logic
- [ ] Validate all inputs
- [ ] Handle all errors properly
- [ ] Use consistent naming

### Before Committing
- [ ] Run tests (all passing)
- [ ] Run linter (no errors)
- [ ] Format code
- [ ] Update documentation if needed
- [ ] Check for security issues

### Before Deployment
- [ ] All tests passing
- [ ] No console.log or debug code
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates installed
- [ ] Backup strategy in place

---

## 🎯 Performance Targets

- **API Response**: < 200ms
- **Database Query**: < 50ms
- **Page Load**: < 2s
- **Test Coverage**: > 80%
- **Uptime**: > 99.9%

---

## 📚 References

- **Full Rules**: `.agent/erp_system_rules.md`
- **Workflow**: `.agent/workflows/erp-development.md`
- **Master Prompt**: `ERP_MASTER_PROMPT.md`

---

**Quick Reference Version**: 1.0.0  
**Last Updated**: 2025-12-08
