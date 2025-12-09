package routes

import (
	"erp-system/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupProductionRoutes(router *gin.Engine, productionHandler *handlers.ProductionHandler) {
	v1 := router.Group("/api/v1")
	{
		production := v1.Group("/production")
		{
			production.GET("/orders", productionHandler.GetOrders)
			production.POST("/orders", productionHandler.CreateOrder)
			production.GET("/orders/:id", productionHandler.GetOrder)
			production.GET("/bom/:productId", productionHandler.GetBOM)
		}
	}
}
