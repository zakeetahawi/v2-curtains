package routes

import (
	"erp-system/internal/handlers"

	"github.com/gin-gonic/gin"
)

// SetupUserRoutes sets up user routes
func SetupUserRoutes(router *gin.Engine, userHandler *handlers.UserHandler) {
	v1 := router.Group("/api/v1")
	{
		users := v1.Group("/users")
		{
			users.GET("", userHandler.GetUsers)
			users.GET("/:id", userHandler.GetUser)
			users.POST("", userHandler.CreateUser)
			users.PUT("/:id", userHandler.UpdateUser)
			users.DELETE("/:id", userHandler.DeleteUser)
		}
	}
}
