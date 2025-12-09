package handlers

import (
	"erp-system/internal/usecases"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type NotificationHandler struct {
	useCase *usecases.NotificationUseCase
}

func NewNotificationHandler(uc *usecases.NotificationUseCase) *NotificationHandler {
	return &NotificationHandler{useCase: uc}
}

func (h *NotificationHandler) GetUnread(c *gin.Context) {
	// TODO: Get real userID from Context/Token
	userID := uint(1)

	notifications, err := h.useCase.GetUnread(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch notifications"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": notifications})
}

func (h *NotificationHandler) MarkAsRead(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid notification ID"})
		return
	}

	err = h.useCase.MarkAsRead(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update notification"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Notification marked as read"})
}
