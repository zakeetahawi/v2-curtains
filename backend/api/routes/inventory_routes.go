package routes

import (
	"erp-system/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupInventoryRoutes(router *gin.Engine, inventoryHandler *handlers.InventoryHandler) {
	v1 := router.Group("/api/v1")
	{
		inventory := v1.Group("/inventory")
		{
			// Products
			inventory.GET("/products", inventoryHandler.GetProducts)
			inventory.GET("/products/:id", inventoryHandler.GetProduct)
			inventory.POST("/products", inventoryHandler.CreateProduct)
			inventory.PUT("/products/:id", inventoryHandler.UpdateProduct)
			inventory.DELETE("/products/:id", inventoryHandler.DeleteProduct)

			// Categories
			inventory.GET("/categories", inventoryHandler.GetCategories)
			inventory.POST("/categories", inventoryHandler.CreateCategory)
		}
	}
}
