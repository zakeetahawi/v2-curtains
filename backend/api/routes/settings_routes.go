package routes

import (
	"erp-system/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupSettingsRoutes(router *gin.Engine, handler *handlers.SettingsHandler) {
	// Public routes
	router.GET("/api/v1/settings/public", handler.GetPublicSettings)

	// Protected routes (TODO: Add Auth Middleware when ready)
	v1 := router.Group("/api/v1/settings")
	{
		v1.GET("", handler.GetSettings)
		v1.POST("", handler.UpdateSettings)
		v1.POST("/logo", handler.UploadLogo)
	}
}
