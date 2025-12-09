package routes

import (
	"erp-system/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupReportsRoutes(router *gin.Engine, reportsHandler *handlers.ReportsHandler) {
	v1 := router.Group("/api/v1")
	{
		reports := v1.Group("/reports")
		{
			reports.GET("/sales", reportsHandler.GetSalesReports)
			reports.GET("/inventory", reportsHandler.GetInventoryReports)
		}
	}
}
