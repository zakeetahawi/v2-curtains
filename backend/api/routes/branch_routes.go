package routes

import (
	"erp-system/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupBranchRoutes(router *gin.Engine, handler *handlers.BranchHandler) {
	branches := router.Group("/api/v1/branches")
	{
		branches.GET("", handler.GetAll)
		branches.GET("/:id", handler.GetOne)
		branches.POST("", handler.Create)
		branches.PUT("/:id", handler.Update)
		branches.DELETE("/:id", handler.Delete)
		branches.GET("/:id/dashboard", handler.GetDashboard)
		branches.POST("/:id/set-main", handler.SetMain)
	}
}
