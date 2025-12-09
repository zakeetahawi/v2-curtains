# ERP System - Scripts Documentation

## 📝 Overview
هذا المشروع يحتوي على مجموعة من السكريبتات لإدارة نظام ERP بسهولة وكفاءة.

## 🚀 Available Scripts

### 1. start.sh - بدء التشغيل
يقوم بتشغيل Backend و Frontend معاً.

**الميزات:**
- إغلاق جميع المنافذ القديمة تلقائياً قبل التشغيل
- التحقق من جاهزية الخدمات
- حفظ معرفات العمليات (PIDs) للمتابعة
- إنشاء ملفات السجلات (logs)

**الاستخدام:**
```bash
./start.sh
```

**المنافذ الافتراضية:**
- Backend: 8080
- Frontend: 5173

**تخصيص المنافذ:**
```bash
BACKEND_PORT=3000 FRONTEND_PORT=8080 ./start.sh
```

---

### 2. stop.sh - إيقاف التشغيل
يقوم بإيقاف جميع الخدمات بشكل آمن.

**الميزات:**
- إيقاف تدريجي (Graceful Shutdown)
- إيقاف قسري إذا لزم الأمر
- تنظيف جميع المنافذ
- خيار حذف ملفات السجلات

**الاستخدام:**
```bash
./stop.sh
```

---

### 3. restart.sh - إعادة التشغيل
يقوم بإعادة تشغيل النظام بالكامل.

**الاستخدام:**
```bash
./restart.sh
```

---

### 4. status.sh - فحص الحالة
يعرض حالة تشغيل النظام بالكامل.

**الميزات:**
- عرض حالة Backend و Frontend
- فحص المنافذ
- عرض معرفات العمليات
- حجم ملفات السجلات

**الاستخدام:**
```bash
./status.sh

# لعرض آخر 20 سطر من السجلات
./status.sh -l
# أو
./status.sh --logs
```

---

## 📂 File Structure

```
project/
├── start.sh           # سكريبت بدء التشغيل
├── stop.sh            # سكريبت إيقاف التشغيل
├── restart.sh         # سكريبت إعادة التشغيل
├── status.sh          # سكريبت فحص الحالة
├── .env.example       # مثال للمتغيرات البيئية
├── logs/              # مجلد السجلات
│   ├── backend.log    # سجل Backend
│   ├── frontend.log   # سجل Frontend
│   ├── backend.pid    # معرف عملية Backend
│   └── frontend.pid   # معرف عملية Frontend
├── backend/           # كود Backend (Go)
└── frontend/          # كود Frontend (Vite)
```

---

## 🔧 Configuration

### Environment Variables
انسخ ملف `.env.example` إلى `.env` وقم بتعديل القيم:

```bash
cp .env.example .env
```

**المتغيرات المتاحة:**
- `BACKEND_PORT`: منفذ Backend (default: 8080)
- `FRONTEND_PORT`: منفذ Frontend (default: 5173)
- `JWT_SECRET`: مفتاح JWT
- `DB_PATH`: مسار قاعدة البيانات
- `LOG_LEVEL`: مستوى السجلات (debug, info, warn, error)

---

## 📋 Requirements

### Backend Requirements
- Go 1.25.1 أو أحدث
- SQLite3

### Frontend Requirements
- Node.js 16+ و npm
- Vite

### System Requirements
- Linux/Unix system
- `lsof` command (لفحص المنافذ)
- `nc` (netcat) command (للتحقق من الاتصال)

---

## 🛠️ Installation

1. **تثبيت المتطلبات:**
```bash
# Go
# تأكد من تثبيت Go من: https://golang.org/

# Node.js
# تأكد من تثبيت Node.js من: https://nodejs.org/

# lsof و netcat (على Ubuntu/Debian)
sudo apt-get install lsof netcat
```

2. **إعداد Backend:**
```bash
cd backend
go mod download
```

3. **إعداد Frontend:**
```bash
cd frontend
npm install
```

4. **تشغيل النظام:**
```bash
./start.sh
```

---

## 📊 Monitoring Logs

### عرض السجلات في الوقت الفعلي:
```bash
# Backend logs
tail -f logs/backend.log

# Frontend logs
tail -f logs/frontend.log

# Both logs
tail -f logs/backend.log logs/frontend.log
```

### عرض آخر الأخطاء:
```bash
# Backend errors
grep -i error logs/backend.log | tail -20

# Frontend errors
grep -i error logs/frontend.log | tail -20
```

---

## 🔍 Troubleshooting

### المنفذ مشغول:
```bash
# فحص العملية المستخدمة للمنفذ
lsof -i :8080

# إغلاق العملية يدوياً
kill -9 $(lsof -ti :8080)

# أو استخدم stop.sh
./stop.sh
```

### Backend لا يعمل:
```bash
# فحص السجلات
cat logs/backend.log

# تشغيل Backend يدوياً للتشخيص
cd backend
go run cmd/server/main.go
```

### Frontend لا يعمل:
```bash
# فحص السجلات
cat logs/frontend.log

# تشغيل Frontend يدوياً للتشخيص
cd frontend
npm run dev
```

### تنظيف شامل:
```bash
# إيقاف كل شيء
./stop.sh

# حذف السجلات
rm -rf logs/*

# إعادة تثبيت dependencies
cd frontend && rm -rf node_modules && npm install

# إعادة التشغيل
./start.sh
```

---

## 🚨 Production Notes

### قبل النشر للإنتاج:

1. **تغيير JWT_SECRET:**
```bash
# في ملف .env
JWT_SECRET=your-very-secure-random-secret-key
```

2. **استخدام PostgreSQL بدلاً من SQLite:**
- تحديث إعدادات قاعدة البيانات
- تشغيل migrations

3. **تفعيل HTTPS:**
- استخدام reverse proxy (Nginx/Apache)
- تثبيت SSL certificates

4. **تحسين الأداء:**
- Build Frontend للإنتاج: `npm run build`
- تفعيل caching
- استخدام CDN للملفات الثابتة

5. **Monitoring:**
- إعداد log rotation
- استخدام monitoring tools (Prometheus, Grafana)
- إعداد alerts

---

## 📝 Examples

### مثال 1: بدء التشغيل العادي
```bash
./start.sh
```

### مثال 2: تخصيص المنافذ
```bash
BACKEND_PORT=3000 FRONTEND_PORT=8080 ./start.sh
```

### مثال 3: فحص الحالة ومتابعة السجلات
```bash
./status.sh -l
```

### مثال 4: إعادة تشغيل بعد تحديث الكود
```bash
git pull
./restart.sh
```

### مثال 5: إيقاف وتنظيف
```bash
./stop.sh
# ثم اختر y لحذف السجلات
```

---

## 🤝 Contributing
عند إضافة ميزات جديدة للسكريبتات:
1. حافظ على نفس أسلوب الكود
2. أضف تعليقات واضحة
3. حدّث هذا الملف
4. اختبر على بيئات مختلفة

---

## 📄 License
هذا المشروع تحت رخصة MIT

---

## 📞 Support
للدعم والمساعدة:
- راجع السجلات أولاً
- استخدم `./status.sh` للتشخيص
- تحقق من Troubleshooting section
