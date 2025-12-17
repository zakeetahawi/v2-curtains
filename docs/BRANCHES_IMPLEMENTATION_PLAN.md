# 🏢 نظام الفروع والصلاحيات - خطة التنفيذ الشاملة

## 📊 نظرة عامة
تطوير نظام متكامل لإدارة الفروع المتعددة مع نظام صلاحيات متقدم

---

## ✅ ما تم إنجازه حتى الآن

### Backend - Domain Models
- ✅ إنشاء `Branch` model
- ✅ إنشاء `Permission` model  
- ✅ إنشاء `RolePermission` model
- ✅ تحديث `User` model (إضافة `BranchID`)
- ✅ تحديث `Customer` model (إضافة `BranchID`)

---

## 🔄 المطلوب تنفيذه

### المرحلة 1: Backend - الفروع (Branches)

#### 1.1 Repository Layer
```go
// backend/internal/repositories/branch_repository.go
- Create()
- FindByID()
- FindAll()
- Update()
- Delete()
- FindMainBranch()
- FindByCode()
```

#### 1.2 UseCase Layer
```go
// backend/internal/usecases/branch_usecase.go
- CreateBranch()
- GetBranch()
- GetAllBranches()
- UpdateBranch()
- DeleteBranch()
- SetMainBranch()
- GetBranchStats() // Dashboard data
```

#### 1.3 Handler Layer
```go
// backend/internal/handlers/branch_handler.go
- POST   /api/v1/branches
- GET    /api/v1/branches
- GET    /api/v1/branches/:id
- PUT    /api/v1/branches/:id
- DELETE /api/v1/branches/:id
- GET    /api/v1/branches/:id/dashboard
```

---

### المرحلة 2: Backend - الصلاحيات (Permissions)

#### 2.1 Permissions List
```
customers.view
customers.create
customers.edit
customers.delete

sales.view
sales.create
sales.edit
sales.delete

inventory.view
inventory.create
inventory.edit
inventory.delete

branches.view
branches.create
branches.edit
branches.delete

users.view
users.create
users.edit
users.delete

reports.view
settings.view
settings.edit
```

#### 2.2 Default Roles
```
1. Super Admin (كل الصلاحيات)
2. Branch Manager (صلاحيات الفرع)
3. Sales User (مبيعات فقط)
4. Viewer (عرض فقط)
```

#### 2.3 Middleware
```go
// backend/internal/middleware/permission.go
- RequirePermission(permission string)
- RequireBranch(branchID uint)
```

---

### المرحلة 3: Backend - تحديث الوحدات الحالية

#### 3.1 Customer UseCase
```go
// تحديث CreateCustomer
- الحصول على BranchID من المستخدم الحالي
- تعيين BranchID تلقائياً للعميل الجديد

// تحديث GetAllCustomers
- فلترة العملاء حسب فرع المستخدم
- Super Admin يرى كل العملاء
```

#### 3.2 Sales UseCase
```go
// ربط الطلبات بالفرع
- تعيين BranchID للطلب
- فلترة حسب الفرع
```

#### 3.3 Inventory UseCase
```go
// إدارة مخزون لكل فرع
- تعيين BranchID للمنتجات
- تقارير منفصلة لكل فرع
```

---

### المرحلة 4: Frontend - واجهات الفروع

#### 4.1 Types
```typescript
// frontend/src/types/index.ts
interface Branch {
  id: number;
  code: string;
  name: string;
  address: string;
  is_main: boolean;
  is_active: boolean;
}

interface Permission {
  code: string;
  name: string;
  module: string;
}
```

#### 4.2 Services
```typescript
// frontend/src/services/branch.service.ts
- getAll()
- getOne()
- create()
- update()
- delete()
- getDashboard()
```

#### 4.3 Pages
```
✅ BranchesPage - إدارة الفروع
✅ BranchDashboardPage - Dashboard خاص بكل فرع
✅ RolesPage - إدارة الأدوار
✅ PermissionsPage - إدارة الصلاحيات
```

---

### المرحلة 5: Frontend - تحديث الصفحات الحالية

#### 5.1 Dashboard
```
- عرض بيانات الفرع الحالي فقط
- Super Admin يرى كل الفروع
- إمكانية التبديل بين الفروع
```

#### 5.2 Customers
```
- عرض عملاء الفرع فقط
- عند الإضافة: تعيين BranchID تلقائياً
- عرض اسم الفرع في الجدول
```

#### 5.3 Sales
```
- طلبات الفرع فقط
- عرض اسم الفرع
```

---

### المرحلة 6: صفحات التفاصيل المحسّنة

#### 6.1 Customer Details
```
✅ معلومات كاملة
✅ سجل الأنشطة
✅ المستندات
✅ سجل الطلبات
✅ الإحصائيات
✅ أزرار إجراءات سريعة
```

#### 6.2 Order Details
```
✅ معلومات الطلب
✅ تفاصيل العميل
✅ الأصناف
✅ الحالة
✅ Timeline
```

---

## 🎯 الأولويات

### المرحلة الأولى (عاجل):
1. ✅ إنشاء Branch Repository
2. ✅ إنشاء Branch UseCase
3. ✅ إنشاء Branch Handler
4. ✅ إنشاء واجهة إدارة الفروع
5. ✅ تحديث Customer UseCase لربط العملاء بالفروع

### المرحلة الثانية:
1. ✅ نظام الصلاحيات الكامل
2. ✅ Middleware للتحقق من الصلاحيات
3. ✅ واجهة إدارة الأدوار

### المرحلة الثالثة:
1. ✅ Dashboard لكل فرع
2. ✅ تقارير منفصلة
3. ✅ صفحات التفاصيل المحسّنة

---

## 📝 ملاحظات مهمة

1. **الفرع الرئيسي:**
   - يجب إنشاء فرع رئيسي واحد عند أول تشغيل
   - لا يمكن حذف الفرع الرئيسي
   - يمكن نقل الفرع الرئيسي لفرع آخر

2. **ربط المستخدمين:**
   - كل مستخدم يجب أن يكون مرتبط بفرع
   - Super Admin يمكنه الوصول لكل الفروع
   - المستخدمون العاديون يرون بيانات فرعهم فقط

3. **تسجيل العملاء:**
   - يتم تعيين BranchID تلقائياً من المستخدم الحالي
   - لا يمكن تغيير فرع العميل إلا من Super Admin

4. **الصلاحيات:**
   - نظام صلاحيات دقيق (Granular)
   - يمكن تخصيص الأدوار
   - التحقق من الصلاحيات في Backend و Frontend

---

## 🚀 الخطوات التالية

هل تريد أن أبدأ بتنفيذ:
1. ✅ المرحلة الأولى كاملة (Branches CRUD + ربط العملاء)
2. ✅ نظام الصلاحيات
3. ✅ صفحات التفاصيل المحسّنة
4. ✅ كل ما سبق بالترتيب

**الوقت المتوقع:** 2-3 ساعات للتنفيذ الكامل

---

**تم الإنشاء:** 2025-12-17
**الحالة:** قيد التنفيذ
