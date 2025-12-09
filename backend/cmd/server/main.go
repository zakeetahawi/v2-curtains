package main

import (
	"erp-system/api/routes"
	"erp-system/internal/handlers"
	"erp-system/internal/middleware"
	"erp-system/internal/repositories"
	"erp-system/internal/services"
	"erp-system/internal/usecases"
	"erp-system/internal/worker"
	"erp-system/pkg/database"
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to database
	db, err := database.Connect("erp.db")
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	log.Println("🚀 ERP System Backend Starting...")

	// Initialize repositories
	userRepo := repositories.NewUserRepository(db)
	customerRepo := repositories.NewCustomerRepository(db)
	salesRepo := repositories.NewSalesRepository(db)
	inventoryRepo := repositories.NewInventoryRepository(db)
	productionRepo := repositories.NewProductionRepository(db)
	reportsRepo := repositories.NewReportsRepository(db)
	activityRepo := repositories.NewCustomerActivityRepository(db)
	docRepo := repositories.NewCustomerDocumentRepository(db)
	settingsRepo := repositories.NewSettingsRepository(db)
	notifRepo := repositories.NewNotificationRepository(db)
	loginAttemptRepo := repositories.NewLoginAttemptRepository(db)
	lockoutRepo := repositories.NewAccountLockoutRepository(db)
	refreshTokenRepo := repositories.NewRefreshTokenRepository(db)

	// Services
	notifService := services.NewNotificationService(settingsRepo)

	// Initialize use cases
	authUseCase := usecases.NewAuthUseCase(userRepo, loginAttemptRepo, lockoutRepo, refreshTokenRepo)
	tokenUseCase := usecases.NewTokenUseCase(userRepo, refreshTokenRepo)
	customerUseCase := usecases.NewCustomerUseCase(customerRepo, activityRepo, docRepo, notifService)
	salesUseCase := usecases.NewSalesUseCase(salesRepo, customerRepo)
	inventoryUseCase := usecases.NewInventoryUseCase(inventoryRepo)
	productionUseCase := usecases.NewProductionUseCase(productionRepo)
	settingsUseCase := usecases.NewSettingsUseCase(settingsRepo)
	notifUseCase := usecases.NewNotificationUseCase(notifRepo)
	dashboardUseCase := usecases.NewDashboardUsecase(repositories.NewDashboardRepository(db))

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authUseCase)
	tokenHandler := handlers.NewTokenHandler(tokenUseCase)
	customerHandler := handlers.NewCustomerHandler(customerUseCase)
	salesHandler := handlers.NewSalesHandler(salesUseCase)
	inventoryHandler := handlers.NewInventoryHandler(inventoryUseCase)
	productionHandler := handlers.NewProductionHandler(productionUseCase)
	reportsHandler := handlers.NewReportsHandler(reportsRepo)
	settingsHandler := handlers.NewSettingsHandler(settingsUseCase)
	notifHandler := handlers.NewNotificationHandler(notifUseCase)
	dashboardHandler := handlers.NewDashboardHandler(dashboardUseCase)

	// Setup Gin
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	// Security Middleware
	router.Use(middleware.CORS())
	router.Use(middleware.SecurityHeaders())
	router.Use(middleware.Sanitizer())
	router.Use(middleware.AuditLogger(db))

	// Rate Limiting (100 requests per minute)
	rateLimiter := middleware.NewRateLimiter(100, 1*time.Minute)
	router.Use(rateLimiter.Middleware())

	router.Static("/uploads", "./uploads")

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Setup routes
	routes.SetupAuthRoutes(router, authHandler, tokenHandler)
	routes.SetupCustomerRoutes(router, customerHandler)
	routes.SetupSalesRoutes(router, salesHandler)
	routes.SetupInventoryRoutes(router, inventoryHandler)
	routes.SetupProductionRoutes(router, productionHandler)
	routes.SetupReportsRoutes(router, reportsHandler)
	routes.SetupSettingsRoutes(router, settingsHandler)
	routes.SetupNotificationRoutes(router, notifHandler)
	routes.SetupDashboardRoutes(router, dashboardHandler)

	// Start Background Workers
	worker.StartReminderWorker(db, notifService)

	// Start server
	port := "8080"
	log.Printf("✅ Server running on http://localhost:%s\n", port)
	log.Printf("📚 Health check: http://localhost:%s/health\n", port)
	log.Printf("🔐 Login endpoint: http://localhost:%s/api/v1/auth/login\n", port)

	if err := router.Run(":" + port); err != nil {
		log.Fatal("❌ Failed to start server:", err)
	}
}
