package routes

import (
	"erp-system/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupDashboardRoutes(router *gin.Engine, dashboardHandler *handlers.DashboardHandler) {
	v1 := router.Group("/api/v1")
	{
		dashboard := v1.Group("/dashboard")
		{
			dashboard.GET("/stats", dashboardHandler.GetDashboardStats)
		}
	}
}
