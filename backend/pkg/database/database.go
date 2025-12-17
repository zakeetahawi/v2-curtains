package database

import (
	"erp-system/internal/domain"
	"log"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Connect initializes database connection with optimized connection pooling
func Connect(dbPath string) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
		// PrepareStmt caches prepared statements for better performance
		PrepareStmt: true,
		// NowFunc allows custom time function
		NowFunc: func() time.Time {
			return time.Now().UTC()
		},
	})

	if err != nil {
		return nil, err
	}

	// Get underlying SQL database
	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}

	// ============================================================================
	// CONNECTION POOL CONFIGURATION
	// ============================================================================

	// SetMaxIdleConns sets the maximum number of connections in the idle connection pool
	// Recommended: 10-25 for most applications
	// Higher values = more memory usage, but faster connection reuse
	sqlDB.SetMaxIdleConns(10)

	// SetMaxOpenConns sets the maximum number of open connections to the database
	// Recommended: 25-100 depending on expected concurrent users
	// SQLite limitation: Not truly concurrent, but GORM handles queueing
	// For production with PostgreSQL, this would be critical
	sqlDB.SetMaxOpenConns(25)

	// SetConnMaxLifetime sets the maximum amount of time a connection may be reused
	// Recommended: 5-15 minutes
	// Prevents stale connections and ensures periodic refresh
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	// SetConnMaxIdleTime sets the maximum amount of time a connection may be idle
	// Recommended: 2-5 minutes
	// Closes idle connections to free resources
	sqlDB.SetConnMaxIdleTime(2 * time.Minute)

	log.Println("✅ Connection pool configured:")
	log.Println("   - Max Idle Connections: 10")
	log.Println("   - Max Open Connections: 25")
	log.Println("   - Connection Max Lifetime: 5 minutes")
	log.Println("   - Connection Max Idle Time: 2 minutes")

	// Auto migrate tables
	if err := db.AutoMigrate(
		&domain.Role{},
		&domain.User{},
		&domain.RefreshToken{},
		&domain.LoginAttempt{},
		&domain.AccountLockout{},
		&domain.AuditLog{},
		&domain.Branch{},
		&domain.Permission{},
		&domain.RolePermission{},
		&domain.Customer{},
		&domain.SalesOrder{},
		&domain.SalesOrderItem{},
		&domain.Product{},
		&domain.Category{},
		&domain.Warehouse{},
		&domain.ProductionOrder{},
		&domain.BillOfMaterials{},
		&domain.ProductionBatch{},
		&domain.CustomerActivity{},
		&domain.CustomerDocument{},
		&domain.SystemSetting{},
		&domain.Notification{},
	); err != nil {
		return nil, err
	}

	// Seed default data
	seedDefaultData(db)

	log.Println("✅ Database connected and migrated successfully")
	return db, nil
}

func seedDefaultData(db *gorm.DB) {
	// Check if roles exist
	var count int64
	db.Model(&domain.Role{}).Count(&count)

	if count == 0 {
		// Create default roles
		roles := []domain.Role{
			{Name: "Admin", Description: "System Administrator", Permissions: `{"all": true}`},
			{Name: "Manager", Description: "Manager", Permissions: `{"read": true, "write": true, "update": true}`},
			{Name: "User", Description: "Regular User", Permissions: `{"read": true, "write": true}`},
			{Name: "Guest", Description: "Guest User", Permissions: `{"read": true}`},
		}
		db.Create(&roles)
		log.Println("✅ Default roles created")

		// Create default admin user (password: admin123)
		adminUser := domain.User{
			Username:     "admin",
			Email:        "admin@erp.local",
			PasswordHash: "$2a$12$KzGDw2oh9ylo00.nvPgw7.HuYL4wIjoxfPK0jTgyb7d7QQprTpQm6",
			RoleID:       1, // Admin role
			IsActive:     true,
		}
		db.Create(&adminUser)
		log.Println("✅ Default admin user created (email: admin@erp.local, password: admin123)")
	}
}
