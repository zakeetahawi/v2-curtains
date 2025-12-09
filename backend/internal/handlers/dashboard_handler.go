package handlers

import (
	"net/http"

	"erp-system/internal/domain"
	"erp-system/internal/usecases"

	"github.com/gin-gonic/gin"
)

type DashboardHandler struct {
	dashboardUsecase usecases.DashboardUsecase
}

func NewDashboardHandler(dashboardUsecase usecases.DashboardUsecase) *DashboardHandler {
	return &DashboardHandler{
		dashboardUsecase: dashboardUsecase,
	}
}

// GetDashboardStats godoc
// @Summary Get dashboard statistics
// @Description Get comprehensive dashboard statistics including KPIs, trends, and top products
// @Tags dashboard
// @Accept json
// @Produce json
// @Success 200 {object} domain.DashboardStats
// @Router /api/v1/dashboard/stats [get]
func (h *DashboardHandler) GetDashboardStats(c *gin.Context) {
	// Parse optional filters from query params
	filters := &domain.DashboardFilters{}

	// Get dashboard stats
	stats, err := h.dashboardUsecase.GetDashboardStats(filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to get dashboard stats",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    stats,
		"message": "Dashboard stats retrieved successfully",
	})
}
