package handlers

import (
	"erp-system/internal/domain"
	"erp-system/internal/usecases"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ProductionHandler struct {
	productionUseCase *usecases.ProductionUseCase
}

func NewProductionHandler(uc *usecases.ProductionUseCase) *ProductionHandler {
	return &ProductionHandler{productionUseCase: uc}
}

func (h *ProductionHandler) GetOrders(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	status := c.Query("status")

	orders, total, err := h.productionUseCase.GetOrders(page, limit, status)
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

func (h *ProductionHandler) CreateOrder(c *gin.Context) {
	var req domain.CreateProductionOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	// TODO: Get user ID from context
	userID := uint(1)

	order, err := h.productionUseCase.CreateOrder(&req, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "data": order})
}

func (h *ProductionHandler) GetOrder(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	order, err := h.productionUseCase.GetOrder(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Order not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": order})
}

func (h *ProductionHandler) GetBOM(c *gin.Context) {
	productID, _ := strconv.ParseUint(c.Param("productId"), 10, 32)
	bom, err := h.productionUseCase.GetBOM(uint(productID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": bom})
}
