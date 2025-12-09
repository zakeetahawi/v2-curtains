package routes

import (
	"erp-system/internal/handlers"

	"github.com/gin-gonic/gin"
)

// SetupAuthRoutes sets up authentication routes
func SetupAuthRoutes(router *gin.Engine, authHandler *handlers.AuthHandler, tokenHandler *handlers.TokenHandler) {
	v1 := router.Group("/api/v1")
	{
		auth := v1.Group("/auth")
		{
			auth.POST("/login", authHandler.Login)
			auth.POST("/logout", authHandler.Logout)
			auth.POST("/refresh", tokenHandler.RefreshToken)
			auth.POST("/revoke", tokenHandler.RevokeToken)
			// Requires authentication middleware
			// auth.POST("/logout-all", authMiddleware, tokenHandler.RevokeAllTokens)
		}
	}
}
