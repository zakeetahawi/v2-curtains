package handlers

import (
	"erp-system/internal/domain"
	"erp-system/internal/usecases"
	"net/http"

	"github.com/gin-gonic/gin"
)

// AuthHandler handles authentication endpoints
type AuthHandler struct {
	authUseCase *usecases.AuthUseCase
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(uc *usecases.AuthUseCase) *AuthHandler {
	return &AuthHandler{authUseCase: uc}
}

// Login handles user login
// @Summary User login
// @Description Authenticate user and return JWT tokens
// @Tags auth
// @Accept json
// @Produce json
// @Param credentials body domain.LoginRequest true "Login credentials"
// @Success 200 {object} domain.LoginResponse
// @Router /api/v1/auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req domain.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "بيانات غير صحيحة",
			"errors":  err.Error(),
		})
		return
	}

	// Extract IP address and User Agent
	ipAddress := c.ClientIP()
	userAgent := c.Request.UserAgent()

	loginResp, err := h.authUseCase.Login(req.Email, req.Password, ipAddress, userAgent)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "تم تسجيل الدخول بنجاح",
		"data":    loginResp,
	})
}

// Logout handles user logout
func (h *AuthHandler) Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "تم تسجيل الخروج بنجاح",
	})
}
