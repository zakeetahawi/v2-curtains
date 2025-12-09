package handlers

import (
	"erp-system/internal/domain"
	"erp-system/internal/usecases"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type SalesHandler struct {
	salesUseCase *usecases.SalesUseCase
}

func NewSalesHandler(uc *usecases.SalesUseCase) *SalesHandler {
	return &SalesHandler{salesUseCase: uc}
}

func (h *SalesHandler) GetOrders(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	status := c.Query("status")
	customerID, _ := strconv.Atoi(c.Query("customer_id"))

	orders, total, err := h.salesUseCase.GetOrders(page, limit, status, uint(customerID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"orders": orders,
			"total":  total,
			"page":   page,
			"limit":  limit,
		},
	})
}

func (h *SalesHandler) CreateOrder(c *gin.Context) {
	var req domain.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	// TODO: Get user ID from context
	userID := uint(1)

	order, err := h.salesUseCase.CreateOrder(&req, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "data": order})
}

func (h *SalesHandler) GetOrder(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	order, err := h.salesUseCase.GetOrder(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Order not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": order})
}
