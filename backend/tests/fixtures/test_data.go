package fixtures

import (
	"erp-system/internal/domain"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// TestUsers returns a set of test users for testing
func TestUsers() []*domain.User {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)

	return []*domain.User{
		{
			ID:           1,
			Username:     "admin",
			Email:        "admin@erp.local",
			PasswordHash: string(hashedPassword),
			RoleID:       1,
			IsActive:     true,
		},
		{
			ID:           2,
			Username:     "manager",
			Email:        "manager@erp.local",
			PasswordHash: string(hashedPassword),
			RoleID:       2,
			IsActive:     true,
		},
		{
			ID:           3,
			Username:     "inactive_user",
			Email:        "inactive@erp.local",
			PasswordHash: string(hashedPassword),
			RoleID:       3,
			IsActive:     false,
		},
	}
}

// TestCustomers returns a set of test customers for testing
func TestCustomers() []*domain.Customer {
	now := time.Now()

	return []*domain.Customer{
		{
			ID:                1,
			Code:              "CUST-00001",
			Name:              "أحمد محمد",
			Email:             "ahmed@example.com",
			Phone:             "01012345678",
			Mobile:            "01012345678",
			Address:           "123 شارع النصر",
			City:              "Cairo",
			Governorate:       "Cairo",
			Country:           "Egypt",
			PostalCode:        "11511",
			TaxNumber:         "123-456-789",
			CreditLimit:       50000,
			Balance:           0,
			Type:              "vip",
			Status:            "active",
			IsWhatsAppEnabled: true,
			CreatedBy:         1,
			CreatedAt:         now,
			UpdatedAt:         now,
		},
		{
			ID:                2,
			Code:              "CUST-00002",
			Name:              "فاطمة علي",
			Email:             "fatima@example.com",
			Phone:             "01098765432",
			Mobile:            "01098765432",
			Address:           "456 شارع الجمهورية",
			City:              "Alexandria",
			Governorate:       "Alexandria",
			Country:           "Egypt",
			PostalCode:        "21500",
			TaxNumber:         "987-654-321",
			CreditLimit:       30000,
			Balance:           0,
			Type:              "regular",
			Status:            "active",
			IsWhatsAppEnabled: false,
			CreatedBy:         1,
			CreatedAt:         now,
			UpdatedAt:         now,
		},
		{
			ID:                3,
			Code:              "CUST-00003",
			Name:              "محمود حسن",
			Email:             "mahmoud@example.com",
			Phone:             "01155443322",
			Mobile:            "01155443322",
			Address:           "789 شارع السلام",
			City:              "Giza",
			Governorate:       "Giza",
			Country:           "Egypt",
			Type:              "wholesale",
			Status:            "inactive",
			IsWhatsAppEnabled: true,
			CreatedBy:         1,
			CreatedAt:         now,
			UpdatedAt:         now,
		},
	}
}

// TestActivities returns a set of test customer activities
func TestActivities() []*domain.CustomerActivity {
	now := time.Now()
	futureDate := now.Add(24 * time.Hour)
	pastDate := now.Add(-24 * time.Hour)

	return []*domain.CustomerActivity{
		{
			ID:          1,
			CustomerID:  1,
			Type:        "note",
			Description: "العميل مهتم بالمنتجات الجديدة",
			CreatedBy:   1,
			CreatedAt:   now,
		},
		{
			ID:          2,
			CustomerID:  1,
			Type:        "call",
			Description: "تم الاتصال بالعميل لمتابعة الطلب",
			CreatedBy:   1,
			CreatedAt:   now.Add(-2 * time.Hour),
		},
		{
			ID:          3,
			CustomerID:  1,
			Type:        "meeting",
			Description: "اجتماع مع العميل لمناقشة العقد",
			CreatedBy:   1,
			CreatedAt:   now.Add(-48 * time.Hour),
		},
		{
			ID:           4,
			CustomerID:   1,
			Type:         "reminder",
			Description:  "متابعة مع العميل بعد أسبوع",
			ReminderDate: &futureDate,
			IsCompleted:  false,
			CreatedBy:    1,
			CreatedAt:    now,
		},
		{
			ID:           5,
			CustomerID:   2,
			Type:         "reminder",
			Description:  "تذكير منتهي - يجب معالجته",
			ReminderDate: &pastDate,
			IsCompleted:  false,
			CreatedBy:    1,
			CreatedAt:    now.Add(-48 * time.Hour),
		},
		{
			ID:          6,
			CustomerID:  2,
			Type:        "alert",
			Description: "تنبيه: العميل طلب خصم خاص",
			CreatedBy:   1,
			CreatedAt:   now,
		},
	}
}

// TestDocuments returns a set of test customer documents
func TestDocuments() []*domain.CustomerDocument {
	now := time.Now()

	return []*domain.CustomerDocument{
		{
			ID:         1,
			CustomerID: 1,
			Title:      "عقد التعاون",
			FilePath:   "/uploads/documents/contract_001.pdf",
			UploadedAt: now,
		},
		{
			ID:         2,
			CustomerID: 1,
			Title:      "السجل التجاري",
			FilePath:   "/uploads/documents/cr_001.pdf",
			UploadedAt: now.Add(-7 * 24 * time.Hour),
		},
		{
			ID:         3,
			CustomerID: 2,
			Title:      "البطاقة الضريبية",
			FilePath:   "/uploads/documents/tax_002.pdf",
			UploadedAt: now.Add(-14 * 24 * time.Hour),
		},
	}
}

// TestNotifications returns a set of test notifications
func TestNotifications() []*domain.Notification {
	now := time.Now()

	return []*domain.Notification{
		{
			ID:        1,
			Message:   "تذكير: متابعة مع العميل أحمد محمد",
			Type:      "reminder",
			IsRead:    false,
			CreatedAt: now,
		},
		{
			ID:        2,
			Message:   "عميل جديد تم إضافته: فاطمة علي",
			Type:      "info",
			IsRead:    true,
			CreatedAt: now.Add(-2 * time.Hour),
		},
		{
			ID:        3,
			Message:   "تنبيه: عميل طلب خصم خاص",
			Type:      "alert",
			IsRead:    false,
			CreatedAt: now.Add(-1 * time.Hour),
		},
	}
}

// CleanTestData provides empty slices for cleanup
func CleanTestData() {
	// This would be used to clean up test database
	// Implementation depends on database setup
}
