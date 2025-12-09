// ==================== TRANSLATIONS ====================
const translations = {
    en: {
        // Login Page
        login: {
            title: 'ERP System',
            subtitle: 'Enterprise Resource Planning Platform',
            welcome: 'Welcome back!',
            email: 'Email Address',
            password: 'Password',
            forgotPassword: 'Forgot Password?',
            loginButton: 'Login',
            loggingIn: 'Logging in...',
            demoCredentials: 'Demo Credentials',
            demoEmail: 'admin@erp.local',
            demoPassword: 'admin123',
            orSignUp: 'or sign up',
            features: {
                title: 'System Features',
                customers: 'Customers & Sales Management',
                inventory: 'Integrated Inventory System',
                reports: 'Smart Reports & Analytics',
                security: 'High-Level Security'
            }
        },
        // Dashboard
        dashboard: {
            welcome: 'Welcome',
            overview: 'Here\'s an overview of your system activity today',
            stats: {
                totalSales: 'Total Sales',
                newCustomers: 'New Customers',
                activeOrders: 'Active Orders',
                totalRevenue: 'Total Revenue'
            },
            charts: {
                salesStats: 'Sales Statistics',
                productDistribution: 'Product Distribution',
                products: 'Products',
                active: 'Active',
                limited: 'Limited'
            },
            activities: {
                title: 'Recent Activities',
                newCustomer: 'New customer added',
                customerJoined: 'joined the system',
                newOrder: 'New order',
                orderCreated: 'Order created with value',
                inventoryUpdate: 'Inventory updated',
                productsUpdated: 'products updated',
                invoicePaid: 'Invoice paid',
                paymentReceived: 'Payment received'
            },
            timeAgo: {
                minutesAgo: 'minutes ago',
                hourAgo: 'hour ago',
                hoursAgo: 'hours ago'
            }
        },
        // Navigation
        nav: {
            home: 'Home',
            customers: 'Customers',
            sales: 'Sales',
            inventory: 'Inventory',
            production: 'Production',
            reports: 'Reports',
            logout: 'Logout'
        },
        // Days
        days: {
            saturday: 'Sat',
            sunday: 'Sun',
            monday: 'Mon',
            tuesday: 'Tue',
            wednesday: 'Wed',
            thursday: 'Thu',
            friday: 'Fri'
        },
        // Customers
        customers: {
            title: 'Customers',
            addNew: 'Add New Customer',
            search: 'Search customers...',
            code: 'Code',
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            address: 'Address',
            governorate: 'Governorate',
            city: 'City / Region',
            location: 'Location',
            type: 'Type',
            status: 'Status',
            balance: 'Balance',
            actions: 'Actions',
            edit: 'Edit',
            delete: 'Delete',
            view: 'View',
            noData: 'No customers found',
            types: {
                regular: 'Regular',
                vip: 'VIP',
                wholesale: 'Wholesale'
            },
            statuses: {
                active: 'Active',
                inactive: 'Inactive'
            },
            form: {
                title: 'Customer Information',
                name: 'Full Name',
                email: 'Email Address',
                phone: 'Phone Number',
                mobile: 'Mobile Number',
                address: 'Address',
                city: 'City',
                country: 'Country',
                postalCode: 'Postal Code',
                taxNumber: 'Tax Number',
                creditLimit: 'Credit Limit',
                type: 'Customer Type',
                save: 'Save',
                cancel: 'Cancel',
                creating: 'Creating...',
                updating: 'Updating...'
            },
            deleteConfirm: {
                title: 'Delete Customer',
                message: 'Are you sure you want to delete this customer?',
                confirm: 'Yes, Delete',
                cancel: 'Cancel'
            }
        },
        // Sales
        sales: {
            title: 'Sales Orders',
            addNew: 'New Order',
            search: 'Search orders...',
            orderNumber: 'Order #',
            customer: 'Customer',
            date: 'Date',
            status: 'Status',
            total: 'Total',
            actions: 'Actions',
            noData: 'No orders found'
        },
        // Inventory
        inventory: {
            title: 'Inventory',
            addNew: 'Add Product',
            search: 'Search products...',
            sku: 'SKU',
            name: 'Product Name',
            category: 'Category',
            price: 'Price',
            stock: 'Stock',
            status: 'Status',
            actions: 'Actions',
            noData: 'No products found'
        },
        // Production
        production: {
            title: 'Production Orders',
            addNew: 'New Order',
            search: 'Search orders...',
            orderNumber: 'Order #',
            product: 'Product',
            quantity: 'Quantity',
            startDate: 'Start Date',
            status: 'Status',
            actions: 'Actions',
            noData: 'No production orders found'
        },
        // Reports
        reports: {
            title: 'Reports & Analytics',
            totalSales: 'Total Sales',
            totalOrders: 'Total Orders',
            inventoryValue: 'Inventory Value',
            salesTrend: 'Sales Trend',
            stockDistribution: 'Stock Distribution'
        },
        // Settings
        settings: {
            title: 'System Settings',
            general: 'General',
            notifications: 'Notifications',
            security: 'Security',
            language: 'Language',
            currency: 'Currency',
            save: 'Save Changes',
            saving: 'Saving...',
            selectLanguage: 'Select Language',
            selectCurrency: 'Select Currency',
            english: 'English',
            arabic: 'Arabic',
            notificationSettings: 'Notification Settings',
            emailNotifications: 'Email Notifications',
            smsNotifications: 'SMS Notifications',
            reminderNotifications: 'Reminder Notifications',
            systemAlerts: 'System Alerts'
        },
        // Notifications
        notifications: {
            title: 'Notifications',
            markAllRead: 'Mark All as Read',
            noNotifications: 'No notifications',
            new: 'New',
            unread: 'Unread',
            read: 'Read',
            all: 'All',
            today: 'Today',
            yesterday: 'Yesterday',
            thisWeek: 'This Week'
        },
        // CRM (Customer Profile)
        crm: {
            customerProfile: 'Customer Profile',
            overview: 'Overview',
            activities: 'Activities',
            documents: 'Documents',
            addActivity: 'Add Activity',
            activityHelp: 'Track calls, meetings, notes, and reminders',
            activityHistory: 'Activity History',
            activityTypes: {
                note: 'Note',
                call: 'Call',
                meeting: 'Meeting',
                alert: 'Alert',
                reminder: 'Reminder'
            },
            description: 'Description',
            descriptionPlaceholder: 'Enter details...',
            descriptionRequired: 'Please enter a description',
            reminderDate: 'Reminder Date & Time',
            reminderDateRequired: 'Please select reminder date and time',
            reminderHelp: 'Select date and time for reminder notification',
            completed: 'Completed',
            noActivities: 'No activities recorded yet',
            uploadDocument: 'Upload Document',
            documentTitle: 'Document Title',
            documentTitlePlaceholder: 'e.g. Contract, CR, ID',
            file: 'File',
            upload: 'Upload',
            noDocuments: 'No documents uploaded yet',
            viewDocument: 'View',
            totalOrders: 'Total Orders',
            totalPurchases: 'Total Purchases',
            lastContact: 'Last Contact',
            memberSince: 'Member Since',
            contactInfo: 'Contact Information',
            businessInfo: 'Business Information'
        },
        // Common Actions
        common: {
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            view: 'View',
            search: 'Search',
            filter: 'Filter',
            export: 'Export',
            print: 'Print',
            refresh: 'Refresh',
            loading: 'Loading...',
            saving: 'Saving...',
            error: 'An error occurred',
            success: 'Operation successful',
            confirm: 'Confirm',
            close: 'Close',
            clear: 'Clear',
            back: 'Back',
            next: 'Next',
            previous: 'Previous',
            submit: 'Submit',
            reset: 'Reset'
        }
    },
    ar: {
        // Login Page
        login: {
            title: 'نظام ERP',
            subtitle: 'منصة إدارة موارد المؤسسات',
            welcome: 'مرحباً بعودتك!',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            forgotPassword: 'نسيت كلمة المرور؟',
            loginButton: 'تسجيل الدخول',
            loggingIn: 'جاري التحقق...',
            demoCredentials: 'بيانات الدخول',
            demoEmail: 'admin@erp.local',
            demoPassword: 'admin123',
            orSignUp: 'أو سجل حساب جديد',
            features: {
                title: 'مميزات النظام',
                customers: 'إدارة العملاء والمبيعات',
                inventory: 'نظام مخزون متكامل',
                reports: 'تقارير وتحليلات ذكية',
                security: 'أمان عالي المستوى'
            }
        },
        // Dashboard
        dashboard: {
            welcome: 'مرحباً',
            overview: 'إليك نظرة عامة على نشاط نظامك اليوم',
            stats: {
                totalSales: 'إجمالي المبيعات',
                newCustomers: 'العملاء الجدد',
                activeOrders: 'الطلبات النشطة',
                totalRevenue: 'إجمالي الإيرادات'
            },
            charts: {
                salesStats: 'إحصائيات المبيعات',
                productDistribution: 'توزيع المنتجات',
                products: 'منتج',
                active: 'نشط',
                limited: 'محدود'
            },
            activities: {
                title: 'النشاطات الأخيرة',
                newCustomer: 'تم إضافة عميل جديد',
                customerJoined: 'انضم للنظام',
                newOrder: 'طلب جديد',
                orderCreated: 'تم إنشاء طلب بقيمة',
                inventoryUpdate: 'تحديث المخزون',
                productsUpdated: 'منتج تم تحديثهم',
                invoicePaid: 'فاتورة مدفوعة',
                paymentReceived: 'تم استلام دفعة بقيمة'
            },
            timeAgo: {
                minutesAgo: 'منذ',
                hourAgo: 'منذ ساعة',
                hoursAgo: 'منذ ساعتين'
            }
        },
        // Navigation
        nav: {
            home: 'الرئيسية',
            customers: 'العملاء',
            sales: 'المبيعات',
            inventory: 'المخزون',
            production: 'الإنتاج',
            reports: 'التقارير',
            logout: 'تسجيل الخروج'
        },
        // Days
        days: {
            saturday: 'السبت',
            sunday: 'الأحد',
            monday: 'الاثنين',
            tuesday: 'الثلاثاء',
            wednesday: 'الأربعاء',
            thursday: 'الخميس',
            friday: 'الجمعة'
        },
        // Customers
        customers: {
            title: 'العملاء',
            addNew: 'إضافة عميل جديد',
            search: 'بحث عن عملاء...',
            code: 'الكود',
            name: 'الاسم',
            email: 'البريد الإلكتروني',
            phone: 'الهاتف',
            address: 'العنوان',
            governorate: 'المحافظة',
            city: 'المدينة / المنطقة',
            location: 'الموقع',
            type: 'النوع',
            status: 'الحالة',
            balance: 'الرصيد',
            actions: 'الإجراءات',
            edit: 'تعديل',
            delete: 'حذف',
            view: 'عرض',
            noData: 'لا يوجد عملاء',
            types: {
                regular: 'عادي',
                vip: 'مميز',
                wholesale: 'جملة'
            },
            statuses: {
                active: 'نشط',
                inactive: 'غير نشط'
            },
            form: {
                title: 'بيانات العميل',
                name: 'الاسم الكامل',
                email: 'البريد الإلكتروني',
                phone: 'رقم الهاتف',
                mobile: 'رقم الجوال',
                address: 'العنوان',
                city: 'المدينة',
                country: 'الدولة',
                postalCode: 'الرمز البريدي',
                taxNumber: 'الرقم الضريبي',
                creditLimit: 'الحد الائتماني',
                type: 'نوع العميل',
                save: 'حفظ',
                cancel: 'إلغاء',
                creating: 'جاري الإنشاء...',
                updating: 'جاري التحديث...'
            },
            deleteConfirm: {
                title: 'حذف عميل',
                message: 'هل أنت متأكد من حذف هذا العميل؟',
                confirm: 'نعم، احذف',
                cancel: 'إلغاء'
            }
        },
        // Sales
        sales: {
            title: 'طلبات المبيعات',
            addNew: 'طلب جديد',
            search: 'بحث في الطلبات...',
            orderNumber: 'رقم الطلب',
            customer: 'العميل',
            date: 'التاريخ',
            status: 'الحالة',
            total: 'الإجمالي',
            actions: 'الإجراءات',
            noData: 'لا توجد طلبات'
        },
        // Inventory
        inventory: {
            title: 'المخزون',
            addNew: 'إضافة منتج',
            search: 'بحث عن منتجات...',
            sku: 'SKU',
            name: 'اسم المنتج',
            category: 'التصنيف',
            price: 'السعر',
            stock: 'المخزون',
            status: 'الحالة',
            actions: 'الإجراءات',
            noData: 'لا توجد منتجات'
        },
        // Production
        production: {
            title: 'أوامر الإنتاج',
            addNew: 'أمر جديد',
            search: 'بحث في الأوامر...',
            orderNumber: 'رقم الأمر',
            product: 'المنتج',
            quantity: 'الكمية',
            startDate: 'تاريخ البدء',
            status: 'الحالة',
            actions: 'الإجراءات',
            noData: 'لا توجد أوامر إنتاج'
        },
        // Reports
        reports: {
            title: 'التقارير والتحليلات',
            totalSales: 'إجمالي المبيعات',
            totalOrders: 'إجمالي الطلبات',
            inventoryValue: 'قيمة المخزون',
            salesTrend: 'اتجاه المبيعات',
            stockDistribution: 'توزيع المخزون'
        },
        // Settings
        settings: {
            title: 'إعدادات النظام',
            general: 'عام',
            notifications: 'الإشعارات',
            security: 'الأمان',
            language: 'اللغة',
            currency: 'العملة',
            save: 'حفظ التغييرات',
            saving: 'جاري الحفظ...',
            selectLanguage: 'اختر اللغة',
            selectCurrency: 'اختر العملة',
            english: 'الإنجليزية',
            arabic: 'العربية',
            notificationSettings: 'إعدادات الإشعارات',
            emailNotifications: 'إشعارات البريد الإلكتروني',
            smsNotifications: 'إشعارات الرسائل النصية',
            reminderNotifications: 'إشعارات التذكير',
            systemAlerts: 'تنبيهات النظام'
        },
        // Notifications
        notifications: {
            title: 'الإشعارات',
            markAllRead: 'تعليم الكل كمقروء',
            noNotifications: 'لا توجد إشعارات',
            new: 'جديد',
            unread: 'غير مقروء',
            read: 'مقروء',
            all: 'الكل',
            today: 'اليوم',
            yesterday: 'الأمس',
            thisWeek: 'هذا الأسبوع'
        },
        // CRM (Customer Profile)
        crm: {
            customerProfile: 'ملف العميل',
            overview: 'نظرة عامة',
            activities: 'النشاطات',
            documents: 'المستندات',
            addActivity: 'إضافة نشاط',
            activityHelp: 'تتبع المكالمات والاجتماعات والملاحظات والتذكيرات',
            activityHistory: 'سجل النشاطات',
            activityTypes: {
                note: 'ملاحظة',
                call: 'مكالمة',
                meeting: 'اجتماع',
                alert: 'تنبيه',
                reminder: 'تذكير'
            },
            description: 'الوصف',
            descriptionPlaceholder: 'أدخل التفاصيل...',
            descriptionRequired: 'الرجاء إدخال الوصف',
            reminderDate: 'تاريخ ووقت التذكير',
            reminderDateRequired: 'الرجاء تحديد تاريخ ووقت التذكير',
            reminderHelp: 'اختر التاريخ والوقت لإشعار التذكير',
            completed: 'مكتمل',
            noActivities: 'لم يتم تسجيل أي نشاطات بعد',
            uploadDocument: 'رفع مستند',
            documentTitle: 'عنوان المستند',
            documentTitlePlaceholder: 'مثل: عقد، سجل تجاري، هوية',
            file: 'الملف',
            upload: 'رفع',
            noDocuments: 'لم يتم رفع أي مستندات بعد',
            viewDocument: 'عرض',
            totalOrders: 'إجمالي الطلبات',
            totalPurchases: 'إجمالي المشتريات',
            lastContact: 'آخر اتصال',
            memberSince: 'عضو منذ',
            contactInfo: 'معلومات الاتصال',
            businessInfo: 'المعلومات التجارية'
        },
        // Common Actions
        common: {
            save: 'حفظ',
            cancel: 'إلغاء',
            delete: 'حذف',
            edit: 'تعديل',
            view: 'عرض',
            search: 'بحث',
            filter: 'تصفية',
            export: 'تصدير',
            print: 'طباعة',
            refresh: 'تحديث',
            loading: 'جاري التحميل...',
            saving: 'جاري الحفظ...',
            error: 'حدث خطأ',
            success: 'تمت العملية بنجاح',
            confirm: 'تأكيد',
            close: 'إغلاق',
            clear: 'مسح',
            back: 'رجوع',
            next: 'التالي',
            previous: 'السابق',
            submit: 'إرسال',
            reset: 'إعادة تعيين'
        }
    }
};

// ==================== CURRENCIES ====================
const currencies = {
    EGP: { symbol: 'ج.م', name: 'Egyptian Pound', decimals: 2 },
    USD: { symbol: '$', name: 'US Dollar', decimals: 2 },
    EUR: { symbol: '€', name: 'Euro', decimals: 2 },
    GBP: { symbol: '£', name: 'British Pound', decimals: 2 },
    SAR: { symbol: 'ر.س', name: 'Saudi Riyal', decimals: 2 },
    AED: { symbol: 'د.إ', name: 'UAE Dirham', decimals: 2 },
};

// ==================== CONFIG ====================
const AppConfig = {
    defaultLanguage: 'en',
    defaultCurrency: 'EGP',
    supportedLanguages: ['en', 'ar'],
    supportedCurrencies: Object.keys(currencies),
};

// ==================== HELPER FUNCTIONS ====================
function getLanguage() {
    return localStorage.getItem('language') || AppConfig.defaultLanguage;
}

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
}

function getCurrency() {
    return localStorage.getItem('currency') || AppConfig.defaultCurrency;
}

function setCurrency(curr) {
    localStorage.setItem('currency', curr);
}

function t(key) {
    const lang = getLanguage();
    const keys = key.split('.');
    let value = translations[lang];

    for (const k of keys) {
        value = value?.[k];
    }

    return value || key;
}

function formatCurrency(amount) {
    const curr = getCurrency();
    const currencyInfo = currencies[curr];
    const formatted = amount.toLocaleString('en-US', {
        minimumFractionDigits: currencyInfo.decimals,
        maximumFractionDigits: currencyInfo.decimals
    });

    return `${formatted} ${currencyInfo.symbol}`;
}

// Initialize language and currency on page load
setLanguage(getLanguage());
setCurrency(getCurrency());

export { translations, currencies, AppConfig, getLanguage, setLanguage, getCurrency, setCurrency, t, formatCurrency };
