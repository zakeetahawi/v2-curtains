package routes

import (
	"erp-system/internal/handlers"

	"github.com/gin-gonic/gin"
)

// SetupCustomerRoutes sets up customer routes
func SetupCustomerRoutes(router *gin.Engine, customerHandler *handlers.CustomerHandler) {
	v1 := router.Group("/api/v1")
	{
		customers := v1.Group("/customers")
		{
			customers.GET("", customerHandler.GetCustomers)
			customers.GET("/:id", customerHandler.GetCustomer)
			customers.POST("", customerHandler.CreateCustomer)
			customers.PUT("/:id", customerHandler.UpdateCustomer)
			customers.DELETE("/:id", customerHandler.DeleteCustomer)

			// CRM Activities
			customers.GET("/:id/activities", customerHandler.GetActivities)
			customers.POST("/:id/activities", customerHandler.AddActivity)
			customers.PUT("/activities/:activityId/toggle-notification", customerHandler.ToggleActivityNotification)

			// Documents
			customers.GET("/:id/documents", customerHandler.GetDocuments)
			customers.POST("/:id/documents", customerHandler.UploadDocument)
		}
	}
}
