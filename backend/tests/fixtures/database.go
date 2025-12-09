package fixtures

import (
	"erp-system/internal/domain"
	"testing"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// SetupTestDB creates an in-memory SQLite database for testing
func SetupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to create test database: %v", err)
	}

	// Auto-migrate all tables
	err = db.AutoMigrate(
		&domain.User{},
		&domain.Customer{},
		&domain.CustomerActivity{},
		&domain.CustomerDocument{},
		&domain.Notification{},
		&domain.SalesOrder{},
		&domain.Product{},
		&domain.ProductionOrder{},
	)
	if err != nil {
		t.Fatalf("Failed to migrate test database: %v", err)
	}

	return db
}

// SeedTestDB populates the test database with fixture data
func SeedTestDB(t *testing.T, db *gorm.DB) {
	// Insert test users
	for _, user := range TestUsers() {
		if err := db.Create(user).Error; err != nil {
			t.Logf("Warning: Failed to seed user: %v", err)
		}
	}

	// Insert test customers
	for _, customer := range TestCustomers() {
		if err := db.Create(customer).Error; err != nil {
			t.Logf("Warning: Failed to seed customer: %v", err)
		}
	}

	// Insert test activities
	for _, activity := range TestActivities() {
		if err := db.Create(activity).Error; err != nil {
			t.Logf("Warning: Failed to seed activity: %v", err)
		}
	}

	// Insert test documents
	for _, doc := range TestDocuments() {
		if err := db.Create(doc).Error; err != nil {
			t.Logf("Warning: Failed to seed document: %v", err)
		}
	}

	// Insert test notifications
	for _, notif := range TestNotifications() {
		if err := db.Create(notif).Error; err != nil {
			t.Logf("Warning: Failed to seed notification: %v", err)
		}
	}
}

// TeardownTestDB closes and cleans up the test database
func TeardownTestDB(db *gorm.DB) {
	sqlDB, err := db.DB()
	if err == nil {
		sqlDB.Close()
	}
}
