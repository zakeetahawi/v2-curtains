package handlers

import (
	"erp-system/internal/domain"
	"erp-system/internal/usecases"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type InventoryHandler struct {
	inventoryUseCase *usecases.InventoryUseCase
}

func NewInventoryHandler(uc *usecases.InventoryUseCase) *InventoryHandler {
	return &InventoryHandler{inventoryUseCase: uc}
}

// Product Endpoints
func (h *InventoryHandler) GetProducts(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")
	categoryID, _ := strconv.Atoi(c.Query("category_id"))

	products, total, err := h.inventoryUseCase.GetProducts(page, limit, search, uint(categoryID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"products": products,
			"total":    total,
			"page":     page,
			"limit":    limit,
		},
	})
}

func (h *InventoryHandler) GetProduct(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	product, err := h.inventoryUseCase.GetProduct(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Product not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": product})
}

func (h *InventoryHandler) CreateProduct(c *gin.Context) {
	var req domain.CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	product, err := h.inventoryUseCase.CreateProduct(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "data": product})
}

func (h *InventoryHandler) UpdateProduct(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	var req domain.UpdateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	product, err := h.inventoryUseCase.UpdateProduct(uint(id), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": product})
}

func (h *InventoryHandler) DeleteProduct(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	err := h.inventoryUseCase.DeleteProduct(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Product deleted successfully"})
}

// Category Endpoints
func (h *InventoryHandler) GetCategories(c *gin.Context) {
	categories, err := h.inventoryUseCase.GetCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": categories})
}

func (h *InventoryHandler) CreateCategory(c *gin.Context) {
	var req struct {
		Name        string `json:"name" binding:"required"`
		Description string `json:"description"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	category, err := h.inventoryUseCase.CreateCategory(req.Name, req.Description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"success": true, "data": category})
}
