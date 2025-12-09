package routes

import (
	"erp-system/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupSalesRoutes(router *gin.Engine, salesHandler *handlers.SalesHandler) {
	v1 := router.Group("/api/v1")
	{
		sales := v1.Group("/sales")
		{
			sales.GET("", salesHandler.GetOrders)
			sales.POST("", salesHandler.CreateOrder)
			sales.GET("/:id", salesHandler.GetOrder)
		}
	}
}
