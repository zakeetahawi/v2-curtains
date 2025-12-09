package routes

import (
	"erp-system/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupNotificationRoutes(router *gin.Engine, handler *handlers.NotificationHandler) {
	v1 := router.Group("/api/v1/notifications")
	{
		v1.GET("", handler.GetUnread)
		v1.POST("/:id/read", handler.MarkAsRead)
	}
}
