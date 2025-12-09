---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.
# ERP System Development Rules

## 🎯 Overview
هذه القواعد تحدد المعايير والمبادئ الأساسية لتطوير نظام ERP متكامل وقابل للتوسعة، مع التركيز على الأداء والأمان وأفضل الممارسات الهندسية.

---

## 📋 Core Principles

### 1. Clean Architecture
- **اتباع معمارية نظيفة** في جميع طبقات التطبيق
- **فصل واضح** بين Business Logic و Data Access و Presentation
- **Dependency Injection** لتسهيل الاختبار والصيانة
- **Single Responsibility Principle** لكل Module و Component

### 2. Modularity & Scalability
- كل Module يجب أن يكون **مستقل ومعزول**
- **إمكانية إضافة Modules جديدة** دون تعديل الكود الأساسي
- **Plugin Architecture** للتوسعات المستقبلية
- **Microservices Ready** - قابل للتحويل لـ Microservices لاحقاً

### 3. Performance First
- **تحسين الأداء** يجب أن يكون أولوية في كل مرحلة
- **Caching Strategy** محددة وواضحة
- **Database Indexing** مدروس
- **Lazy Loading** للموارد الثقيلة
- **Code Splitting** في Frontend

---

## 🔧 Backend Rules (Go)

### Architecture Structure
```
project/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── domain/          # Business entities
│   ├── usecases/        # Business logic
│   ├── repositories/    # Data access
│   ├── handlers/        # HTTP handlers
│   └── middleware/      # Middleware
├── api/
│   ├── routes/
│   └── validators/
├── pkg/
│   ├── auth/
│   ├── database/
│   ├── logger/
│   └── utils/
├── migrations/
├── configs/
└── tests/
```

### API Standards
- **RESTful Design** مع اتباع HTTP Methods بشكل صحيح
  - GET: للقراءة
  - POST: للإنشاء
  - PUT: للتحديث الكامل
  - PATCH: للتحديث الجزئي
  - DELETE: للحذف
- **Versioning**: استخدام `/api/v1/` في جميع الـ endpoints
- **Status Codes** واضحة ومناسبة:
  - 200: Success
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found
  - 500: Internal Server Error
- **Response Format** موحد:
```json
{
  "success": true/false,
  "data": {},
  "message": "string",
  "errors": []
}
```

### Authentication & Security
- **JWT Authentication** مع Access Token (15 دقيقة) و Refresh Token (7 أيام)
- **Password Hashing** باستخدام bcrypt (cost factor: 12)
- **RBAC (Role-Based Access Control)** شامل
  - Roles: Admin, Manager, User, Guest
  - Permissions: Read, Write, Update, Delete
- **Rate Limiting**: 100 requests/minute للمستخدم العادي
- **CORS Configuration** محددة ومقيدة
- **SQL Injection Protection** باستخدام Prepared Statements
- **XSS Protection** في جميع المدخلات
- **CSRF Protection** للعمليات الحساسة
- **Audit Logging** لجميع العمليات الحرجة

### Validation Rules
- **Input Validation** إلزامية على جميع المدخلات
- استخدام مكتبة validation مثل `validator.v10`
- **Custom Validators** للقواعد المعقدة
- **Sanitization** للمدخلات النصية
- **Error Messages** واضحة وباللغتين (عربي/إنجليزي)

### Database Rules
- **SQLite** في مرحلة التطوير
- **PostgreSQL Ready** - الكود يجب أن يكون جاهز للانتقال
- **Migrations System** منظم:
  - تسمية واضحة: `YYYYMMDD_HHMMSS_description.sql`
  - Up/Down migrations لكل تغيير
  - Version Control للـ migrations
- **Normalization** حتى 3NF على الأقل
- **Indexes** على:
  - Foreign Keys
  - Columns used in WHERE clauses
  - Columns used in JOIN operations
- **Soft Delete** بدلاً من Hard Delete حيث ممكن
- **Timestamps**: created_at, updated_at, deleted_at

### Error Handling
- **Panic Recovery Middleware** في جميع الـ handlers
- **Structured Logging** مع levels (DEBUG, INFO, WARN, ERROR, FATAL)
- **Error Wrapping** للحفاظ على السياق
- **Stack Traces** في بيئة Development فقط
- **Graceful Shutdown** عند إيقاف الخادم

### Testing Requirements
- **Unit Tests** لجميع Use Cases (Coverage > 80%)
- **Integration Tests** للـ API endpoints
- **Mock Repositories** للاختبارات
- **Test Database** منفصلة
- **Benchmarking** للعمليات الحرجة

---

## 🎨 Frontend Rules (TailwindCSS 5)

### Design System
- **Color Palette**:
  - Primary: Dark Blue (#1e3a8a → #3b82f6)
  - Secondary: Light Silver (#e5e7eb → #f3f4f6)
  - Accent: Electric Blue (#60a5fa)
  - Success: Emerald (#10b981)
  - Warning: Amber (#f59e0b)
  - Error: Red (#ef4444)
  - Text: Slate (#1e293b → #64748b)

- **Typography**:
  - Font Family: 'Inter' (Google Fonts)
  - Headings: Font Weight 700
  - Body: Font Weight 400
  - Line Height: 1.6
  - RTL Support: كامل للعربية

- **Spacing System**:
  - استخدام Tailwind's spacing scale
  - Consistent margins/paddings
  - Grid system واضح

### Component Standards
- **Reusable Components** فقط
- **Props Validation** إلزامية
- **TypeScript** (إذا تم استخدامه) مع strict mode
- **Naming Convention**: PascalCase للـ Components
- **File Structure**:
```
components/
├── common/
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   └── index.js
│   └── Input/
├── modules/
│   ├── Customers/
│   ├── Sales/
│   ├── Inventory/
│   └── Production/
└── layouts/
```

### UI/UX Guidelines
- **Responsive Design** إلزامي:
  - Mobile First Approach
  - Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Loading States** لجميع العمليات الغير متزامنة
- **Error States** واضحة وودودة
- **Empty States** تحفز المستخدم على الإجراء
- **Animations**:
  - Smooth transitions (200-300ms)
  - Hover effects على العناصر التفاعلية
  - Skeleton loading للبيانات
- **Accessibility**:
  - ARIA labels
  - Keyboard navigation
  - Color contrast ratio > 4.5:1
  - Focus indicators واضحة

### Dashboard Requirements
- **Widgets System** مرنة وقابلة للتخصيص
- **Real-time Updates** حيث ممكن
- **Charts & Graphs** باستخدام مكتبة مثل Chart.js أو Recharts
- **Filters & Search** في جميع القوائم
- **Export Data** (CSV, PDF, Excel)
- **Bulk Actions** للعمليات المتعددة

### Performance Optimization
- **Code Splitting** بـ Dynamic Imports
- **Lazy Loading** للصور والمكونات
- **Minification** في Production
- **Tree Shaking** لإزالة الكود غير المستخدم
- **CDN** للـ Assets الثابتة
- **Service Workers** للـ PWA capabilities

---

## 🗄️ Database Schema Rules

### Core Tables

#### 1. Users & Authentication
```sql
users (
  id, username, email, password_hash,
  role_id, is_active, last_login_at,
  created_at, updated_at, deleted_at
)

roles (
  id, name, description, permissions (JSON),
  created_at, updated_at
)

sessions (
  id, user_id, access_token, refresh_token,
  expires_at, ip_address, user_agent,
  created_at
)
```

#### 2. Customers Module
```sql
customers (
  id, code, name, email, phone, mobile,
  address, city, country, postal_code,
  tax_number, credit_limit, balance,
  customer_type, status,
  created_by, created_at, updated_at, deleted_at
)

customer_contacts (
  id, customer_id, name, title, email, phone,
  is_primary, created_at, updated_at
)
```

#### 3. Sales Module
```sql
sales_orders (
  id, order_number, customer_id, order_date,
  delivery_date, status, total_amount,
  tax_amount, discount_amount, net_amount,
  notes, created_by, approved_by,
  created_at, updated_at, deleted_at
)

sales_order_items (
  id, order_id, product_id, quantity,
  unit_price, discount, tax_rate,
  total, created_at, updated_at
)

invoices (
  id, invoice_number, order_id, customer_id,
  invoice_date, due_date, total_amount,
  paid_amount, status, payment_method,
  created_at, updated_at
)
```

#### 4. Inventory Module
```sql
products (
  id, sku, name, description, category_id,
  unit_id, cost_price, selling_price,
  reorder_level, max_stock_level,
  is_active, created_at, updated_at, deleted_at
)

categories (
  id, name, parent_id, description,
  created_at, updated_at
)

stock_movements (
  id, product_id, movement_type, quantity,
  from_location_id, to_location_id,
  reference_type, reference_id,
  cost_per_unit, notes, created_by,
  created_at
)

warehouses (
  id, code, name, address, manager_id,
  is_active, created_at, updated_at
)
```

#### 5. Production Module
```sql
production_orders (
  id, order_number, product_id, quantity,
  start_date, end_date, status,
  actual_quantity, notes, created_by,
  created_at, updated_at, deleted_at
)

bill_of_materials (
  id, product_id, component_id, quantity,
  unit_id, waste_percentage,
  created_at, updated_at
)

production_batches (
  id, production_order_id, batch_number,
  quantity, status, start_time, end_time,
  created_at, updated_at
)
```

### Indexing Strategy
```sql
-- Primary Keys: Auto-indexed
-- Foreign Keys: Always indexed
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_orders_customer_date ON sales_orders(customer_id, order_date);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_stock_product_date ON stock_movements(product_id, created_at);
```

### Constraints
- **Foreign Keys** مع ON DELETE CASCADE/RESTRICT حسب الحاجة
- **Unique Constraints** على الحقول الفريدة (email, sku, order_number)
- **Check Constraints** للتحقق من صحة البيانات

---

## 🔐 Security Checklist

- [ ] **Environment Variables** لجميع البيانات الحساسة
- [ ] **No Hardcoded Secrets** في الكود
- [ ] **HTTPS Only** في Production
- [ ] **Security Headers**:
  - X-Frame-Options
  - X-Content-Type-Options
  - Strict-Transport-Security
  - Content-Security-Policy
- [ ] **Input Sanitization** على جميع المستويات
- [ ] **Rate Limiting** على جميع الـ endpoints
- [ ] **Audit Logging** للعمليات الحساسة
- [ ] **Regular Security Updates** للـ dependencies
- [ ] **Vulnerability Scanning** دوري

---

## 📝 Documentation Requirements

### Code Documentation
- **Comments** بالعربية أو الإنجليزية حسب فريق العمل
- **Function Documentation**: Purpose, Parameters, Return values
- **Complex Logic** يجب أن يكون موثق بشكل واضح

### API Documentation
- **OpenAPI/Swagger** specification
- **Postman Collection** للاختبار
- **Example Requests/Responses**
- **Error Codes** documentation

### User Documentation
- **User Manual** شامل
- **Admin Guide** للإعدادات
- **Screenshots** للواجهات
- **Video Tutorials** للعمليات المعقدة

---

## 🚀 Deployment Rules

### Environment Separation
- **Development**: SQLite, Debug logging, Hot reload
- **Staging**: PostgreSQL, Info logging, Similar to production
- **Production**: PostgreSQL, Error logging, Optimized build

### CI/CD Pipeline
- **Automated Testing** قبل كل Deploy
- **Code Quality Checks** (linting, formatting)
- **Security Scanning**
- **Automated Backups** قبل التحديثات
- **Rollback Strategy** واضحة

### Backup Strategy
- **Database**: Daily full backup + hourly incremental
- **Files**: Daily backup
- **Retention**: 30 days
- **Off-site Storage** للنسخ الاحتياطية

---

## 📊 Monitoring & Logging

### Application Monitoring
- **Health Checks** endpoint: `/health`
- **Metrics Collection**: CPU, Memory, Response Time
- **Error Tracking**: Sentry أو مشابه
- **Performance Monitoring**: APM tool

### Logging Standards
```go
// Log Format
{
  "timestamp": "2024-01-01T12:00:00Z",
  "level": "INFO",
  "service": "erp-api",
  "message": "Order created successfully",
  "user_id": 123,
  "order_id": 456,
  "ip": "192.168.1.1"
}
```

---

## 🌍 Internationalization (i18n)

- **Multi-language Support**: عربي وإنجليزي كحد أدنى
- **RTL Support** كامل للعربية
- **Date/Time Formatting** حسب اللغة
- **Currency Formatting** حسب المنطقة
- **Translation Files** منظمة:
```
locales/
├── ar/
│   ├── common.json
│   ├── customers.json
│   └── sales.json
└── en/
    ├── common.json
    ├── customers.json
    └── sales.json
```

---

## ✅ Quality Assurance

### Code Quality
- **Linting**: golangci-lint للـ Go, ESLint للـ JavaScript
- **Formatting**: gofmt, Prettier
- **Code Review** إلزامي قبل Merge
- **Performance Profiling** للعمليات البطيئة

### Testing Requirements
- **Unit Tests**: >80% coverage
- **Integration Tests**: Critical paths
- **E2E Tests**: User journeys
- **Load Testing**: للتأكد من الأداء تحت الضغط

---

## 🔄 Version Control

### Git Workflow
- **Branch Strategy**: Git Flow
  - main: Production code
  - develop: Development code
  - feature/*: New features
  - hotfix/*: Urgent fixes
- **Commit Messages**: Conventional Commits format
```
feat: add customer export functionality
fix: resolve inventory calculation bug
docs: update API documentation
```
- **Pull Request Template** إلزامي
- **Code Review** from at least one team member

---

## 📈 Future Scalability Considerations

### Ready for Growth
- **Microservices**: الكود جاهز للتقسيم
- **Horizontal Scaling**: Stateless design
- **Message Queues**: RabbitMQ/Kafka ready
- **Caching Layer**: Redis integration ready
- **Search Engine**: Elasticsearch integration ready
- **File Storage**: S3-compatible storage ready
- **Multi-tenancy**: Database per tenant or shared schema

### Module Expansion Path
1. **Financial Management** (Accounting, Budget)
2. **HR Management** (Employees, Payroll, Attendance)
3. **Project Management** (Tasks, Time tracking)
4. **Procurement** (Purchase orders, Suppliers)
5. **Quality Control** (Inspections, Standards)
6. **Reporting & Analytics** (BI, Dashboards)
7. **AI/ML Integration** (Forecasting, Recommendations)

---

## 🎓 Development Best Practices

### Daily Development Workflow
1. **Pull latest changes** من develop
2. **Create feature branch**
3. **Write tests first** (TDD when possible)
4. **Implement feature**
5. **Run tests & linting**
6. **Commit with clear message**
7. **Push and create PR**
8. **Address review comments**
9. **Merge after approval**

### Code Review Checklist
- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance impact considered
- [ ] Error handling is proper
- [ ] Logging is appropriate

---

## 📞 Support & Maintenance

### Issue Tracking
- **Bug Reports**: Clear reproduction steps
- **Feature Requests**: Business justification
- **Priority Levels**: Critical, High, Medium, Low
- **Response Times**: Based on priority

### Update Schedule
- **Security Patches**: Immediate
- **Bug Fixes**: Weekly
- **Features**: BiWeekly sprints
- **Major Releases**: Quarterly

---

## 🏁 Project Success Criteria

### Technical Criteria
- ✅ All core modules functional
- ✅ >80% test coverage
- ✅ <200ms average response time
- ✅ Zero critical security issues
- ✅ Full documentation
- ✅ Accessible (WCAG 2.1 Level AA)

### Business Criteria
- ✅ User-friendly interface
- ✅ Reliable and stable
- ✅ Scalable architecture
- ✅ Easy to maintain
- ✅ Cost-effective

---

**Version**: 1.0.0  
**Last Updated**: 2025-12-08  
**Maintained By**: Development Team
