package handlers

import (
	"erp-system/internal/usecases"
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

type SettingsHandler struct {
	useCase *usecases.SettingsUseCase
}

func NewSettingsHandler(uc *usecases.SettingsUseCase) *SettingsHandler {
	return &SettingsHandler{useCase: uc}
}

func (h *SettingsHandler) GetSettings(c *gin.Context) {
	settings, err := h.useCase.GetSettings()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch settings"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": settings})
}

func (h *SettingsHandler) UpdateSettings(c *gin.Context) {
	var req map[string]string
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request"})
		return
	}

	err := h.useCase.UpdateSettings(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update settings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Settings updated successfully"})
}

func (h *SettingsHandler) GetPublicSettings(c *gin.Context) {
	settings, err := h.useCase.GetSettings()
	if err != nil {
		// Return defaults if error (e.g. not init)
		c.JSON(http.StatusOK, gin.H{"success": true, "data": gin.H{
			"company_name": "ERP System",
			"company_logo": "",
		}})
		return
	}

	// Filter only public data
	publicData := gin.H{
		"company_name": settings["company_name"],
		"company_logo": settings["company_logo"],
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": publicData})
}

func (h *SettingsHandler) UploadLogo(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "No file uploaded"})
		return
	}

	// Validate ext
	ext := filepath.Ext(file.Filename)
	if ext != ".png" && ext != ".jpg" && ext != ".jpeg" && ext != ".svg" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid file type"})
		return
	}

	dst := "uploads/settings/logo" + ext
	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to save file"})
		return
	}

	// Save path to settings
	err = h.useCase.UpdateSettings(map[string]string{
		"company_logo": "/" + dst,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update settings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Logo uploaded", "path": "/" + dst})
}
