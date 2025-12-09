package handlers

import (
	"erp-system/internal/usecases"
	"net/http"

	"github.com/gin-gonic/gin"
)

// TokenHandler handles token-related endpoints
type TokenHandler struct {
	tokenUseCase *usecases.TokenUseCase
}

// NewTokenHandler creates a new token handler
func NewTokenHandler(uc *usecases.TokenUseCase) *TokenHandler {
	return &TokenHandler{tokenUseCase: uc}
}

// RefreshToken handles token refresh requests
// @Summary Refresh access token
// @Description Get new access token using refresh token (with rotation)
// @Tags auth
// @Accept json
// @Produce json
// @Param refresh_token body object{refresh_token=string} true "Refresh token"
// @Success 200 {object} domain.LoginResponse
// @Router /api/v1/auth/refresh [post]
func (h *TokenHandler) RefreshToken(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "رمز التحديث مطلوب",
		})
		return
	}

	// Extract IP and User Agent
	ipAddress := c.ClientIP()
	userAgent := c.Request.UserAgent()

	// Refresh token
	response, err := h.tokenUseCase.RefreshAccessToken(req.RefreshToken, ipAddress, userAgent)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    response,
		"message": "تم تحديث رمز الدخول بنجاح",
	})
}

// RevokeToken handles token revocation (logout)
// @Summary Revoke refresh token
// @Description Logout by revoking refresh token
// @Tags auth
// @Accept json
// @Produce json
// @Param refresh_token body object{refresh_token=string} true "Refresh token"
// @Success 200 {object} object{success=bool,message=string}
// @Router /api/v1/auth/logout [post]
func (h *TokenHandler) RevokeToken(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "رمز التحديث مطلوب",
		})
		return
	}

	if err := h.tokenUseCase.RevokeToken(req.RefreshToken); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "فشل في تسجيل الخروج",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "تم تسجيل الخروج بنجاح",
	})
}

// RevokeAllTokens handles revoking all tokens for current user (logout all devices)
// @Summary Revoke all refresh tokens
// @Description Logout from all devices
// @Tags auth
// @Accept json
// @Produce json
// @Success 200 {object} object{success=bool,message=string}
// @Router /api/v1/auth/logout-all [post]
func (h *TokenHandler) RevokeAllTokens(c *gin.Context) {
	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "غير مصرح",
		})
		return
	}

	if err := h.tokenUseCase.RevokeAllUserTokens(userID.(uint)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "فشل في تسجيل الخروج من جميع الأجهزة",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "تم تسجيل الخروج من جميع الأجهزة بنجاح",
	})
}
