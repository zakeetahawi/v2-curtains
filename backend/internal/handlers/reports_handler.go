package handlers

import (
	"erp-system/internal/repositories"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type ReportsHandler struct {
	reportsRepo repositories.ReportsRepository
}

func NewReportsHandler(repo repositories.ReportsRepository) *ReportsHandler {
	return &ReportsHandler{reportsRepo: repo}
}

func (h *ReportsHandler) GetSalesReports(c *gin.Context) {
	startDate := c.DefaultQuery("start_date", time.Now().AddDate(0, -1, 0).Format("2006-01-02"))
	endDate := c.DefaultQuery("end_date", time.Now().Format("2006-01-02"))

	stats, err := h.reportsRepo.GetSalesStats(startDate, endDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": stats})
}

func (h *ReportsHandler) GetInventoryReports(c *gin.Context) {
	stats, err := h.reportsRepo.GetInventoryStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": stats})
}
