package handlers

import (
	"erp-system/internal/domain"
	"erp-system/internal/usecases"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// CustomerHandler handles customer endpoints
type CustomerHandler struct {
	customerUseCase *usecases.CustomerUseCase
}

// NewCustomerHandler creates a new customer handler
func NewCustomerHandler(uc *usecases.CustomerUseCase) *CustomerHandler {
	return &CustomerHandler{customerUseCase: uc}
}

// GetCustomers handles listing all customers
func (h *CustomerHandler) GetCustomers(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")

	customers, total, err := h.customerUseCase.GetCustomers(page, limit, search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch customers",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"customers": customers,
			"total":     total,
			"page":      page,
			"limit":     limit,
		},
	})
}

// GetCustomer handles fetching a single customer
func (h *CustomerHandler) GetCustomer(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid customer ID"})
		return
	}

	customer, err := h.customerUseCase.GetCustomer(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Customer not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": customer})
}

// CreateCustomer handles creating a new customer
func (h *CustomerHandler) CreateCustomer(c *gin.Context) {
	var req domain.CreateCustomerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request", "error": err.Error()})
		return
	}

	// TODO: Get userID from context (currently hardcoded)
	userID := uint(1)

	customer, err := h.customerUseCase.CreateCustomer(req, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create customer", "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "data": customer, "message": "Customer created successfully"})
}

// UpdateCustomer handles updating a customer
func (h *CustomerHandler) UpdateCustomer(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid customer ID"})
		return
	}

	var req domain.UpdateCustomerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request", "error": err.Error()})
		return
	}

	err = h.customerUseCase.UpdateCustomer(uint(id), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update customer", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Customer updated successfully"})
}

// DeleteCustomer handles deleting a customer
func (h *CustomerHandler) DeleteCustomer(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid customer ID"})
		return
	}

	err = h.customerUseCase.DeleteCustomer(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to delete customer", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Customer deleted successfully"})
}

// GetActivities handles fetching customer activities
func (h *CustomerHandler) GetActivities(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid customer ID"})
		return
	}

	activities, err := h.customerUseCase.GetActivities(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch activities"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": activities})
}

// AddActivity handles adding a customer activity
func (h *CustomerHandler) AddActivity(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid customer ID"})
		return
	}

	var req struct {
		Type         string  `json:"type" binding:"required"`
		Description  string  `json:"description" binding:"required"`
		ReminderDate *string `json:"reminder_date"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request", "error": err.Error()})
		return
	}

	// TODO: Get userID from context (currently hardcoded)
	userID := uint(1)

	err = h.customerUseCase.AddActivity(uint(id), req.Type, req.Description, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to add activity", "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Activity added successfully"})
}

// UploadDocument handles uploading a customer document
func (h *CustomerHandler) UploadDocument(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid customer ID"})
		return
	}

	// 1. Get file from request
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "No file uploaded"})
		return
	}

	// 2. Get title
	title := c.PostForm("title")
	if title == "" {
		title = file.Filename
	}

	// 3. Save file
	dst := "uploads/customers/" + strconv.FormatUint(id, 10) + "/" + file.Filename
	err = c.SaveUploadedFile(file, dst)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to save file"})
		return
	}

	// 4. Save record
	err = h.customerUseCase.AddDocument(uint(id), title, "/"+dst, "file")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to save document record"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Document uploaded successfully", "path": "/" + dst})
}

// GetDocuments handles fetching customer documents
func (h *CustomerHandler) GetDocuments(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid customer ID"})
		return
	}

	docs, err := h.customerUseCase.GetDocuments(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch documents"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": docs})
}

// ToggleActivityNotification handles enabling/disabling activity notification
func (h *CustomerHandler) ToggleActivityNotification(c *gin.Context) {
	activityID, err := strconv.ParseUint(c.Param("activityId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid activity ID"})
		return
	}

	var req struct {
		Enabled bool `json:"enabled"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request"})
		return
	}

	err = h.customerUseCase.ToggleActivityNotification(uint(activityID), req.Enabled)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to toggle notification"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Notification toggled successfully"})
}
