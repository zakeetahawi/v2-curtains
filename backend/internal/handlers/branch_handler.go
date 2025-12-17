package handlers

import (
	"erp-system/internal/usecases"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type BranchHandler struct {
	useCase *usecases.BranchUseCase
}

func NewBranchHandler(uc *usecases.BranchUseCase) *BranchHandler {
	return &BranchHandler{useCase: uc}
}

func (h *BranchHandler) GetAll(c *gin.Context) {
	branches, err := h.useCase.GetAllBranches()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch branches"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    branches,
	})
}

func (h *BranchHandler) GetOne(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid branch ID"})
		return
	}

	branch, err := h.useCase.GetBranch(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Branch not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    branch,
	})
}

func (h *BranchHandler) Create(c *gin.Context) {
	var req struct {
		Name    string `json:"name" binding:"required"`
		NameEn  string `json:"name_en"`
		Address string `json:"address"`
		City    string `json:"city"`
		Phone   string `json:"phone"`
		Email   string `json:"email"`
		IsMain  bool   `json:"is_main"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request"})
		return
	}

	branch, err := h.useCase.CreateBranch(req.Name, req.NameEn, req.Address, req.City, req.Phone, req.Email, req.IsMain)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    branch,
		"message": "Branch created successfully",
	})
}

func (h *BranchHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid branch ID"})
		return
	}

	var req struct {
		Name     string `json:"name" binding:"required"`
		NameEn   string `json:"name_en"`
		Address  string `json:"address"`
		City     string `json:"city"`
		Phone    string `json:"phone"`
		Email    string `json:"email"`
		IsActive bool   `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request"})
		return
	}

	err = h.useCase.UpdateBranch(uint(id), req.Name, req.NameEn, req.Address, req.City, req.Phone, req.Email, req.IsActive)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Branch updated successfully",
	})
}

func (h *BranchHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid branch ID"})
		return
	}

	err = h.useCase.DeleteBranch(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Branch deleted successfully",
	})
}

func (h *BranchHandler) GetDashboard(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid branch ID"})
		return
	}

	stats, err := h.useCase.GetBranchDashboard(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch dashboard data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    stats,
	})
}

func (h *BranchHandler) SetMain(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid branch ID"})
		return
	}

	err = h.useCase.SetMainBranch(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Main branch updated successfully",
	})
}
