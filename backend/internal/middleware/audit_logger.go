package middleware

import (
	"encoding/json"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// AuditLog represents an audit log entry in the database
type AuditLog struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	UserID    uint      `json:"user_id"`
	Action    string    `json:"action"`
	Resource  string    `json:"resource"`
	Method    string    `json:"method"`
	Path      string    `json:"path"`
	IPAddress string    `json:"ip_address"`
	UserAgent string    `json:"user_agent"`
	RequestID string    `json:"request_id"`
	Status    int       `json:"status"`
	Details   string    `json:"details"`
	CreatedAt time.Time `json:"created_at"`
}

// AuditLogger middleware logs all API requests for security auditing
func AuditLogger(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Start time
		startTime := time.Now()

		// Generate request ID if not exists
		requestID := c.GetHeader("X-Request-ID")
		if requestID == "" {
			requestID = generateRequestID()
			c.Header("X-Request-ID", requestID)
		}

		// Process request
		c.Next()

		// Log after request completes
		go logAuditEntry(db, c, requestID, startTime)
	}
}

// logAuditEntry creates an audit log entry in the database
func logAuditEntry(db *gorm.DB, c *gin.Context, requestID string, startTime time.Time) {
	// Extract user ID if available
	var userID uint
	if uid, exists := c.Get("user_id"); exists {
		if id, ok := uid.(uint); ok {
			userID = id
		}
	}

	// Determine action based on method and path
	action := determineAction(c.Request.Method, c.Request.URL.Path)
	resource := extractResource(c.Request.URL.Path)

	// Create audit log entry
	auditLog := AuditLog{
		UserID:    userID,
		Action:    action,
		Resource:  resource,
		Method:    c.Request.Method,
		Path:      c.Request.URL.Path,
		IPAddress: c.ClientIP(),
		UserAgent: c.Request.UserAgent(),
		RequestID: requestID,
		Status:    c.Writer.Status(),
		Details:   buildDetails(c, startTime),
		CreatedAt: time.Now(),
	}

	// Save to database (ignore errors in background)
	db.Create(&auditLog)
}

// determineAction determines the action type from method and path
func determineAction(method, path string) string {
	switch method {
	case "POST":
		return "CREATE"
	case "PUT", "PATCH":
		return "UPDATE"
	case "DELETE":
		return "DELETE"
	case "GET":
		return "READ"
	default:
		return "UNKNOWN"
	}
}

// extractResource extracts resource type from URL path
func extractResource(path string) string {
	// Extract resource from path (e.g., /api/v1/customers -> customers)
	parts := splitPath(path)
	if len(parts) >= 3 {
		return parts[2] // Assuming /api/v1/{resource}
	}
	return "unknown"
}

// splitPath splits URL path into parts
func splitPath(path string) []string {
	parts := []string{}
	for _, part := range splitString(path, "/") {
		if part != "" {
			parts = append(parts, part)
		}
	}
	return parts
}

// splitString is a helper to split string by separator
func splitString(s, sep string) []string {
	result := []string{}
	current := ""

	for _, char := range s {
		if string(char) == sep {
			result = append(result, current)
			current = ""
		} else {
			current += string(char)
		}
	}
	result = append(result, current)

	return result
}

// buildDetails creates a JSON string with request details
func buildDetails(c *gin.Context, startTime time.Time) string {
	details := map[string]interface{}{
		"duration_ms": time.Since(startTime).Milliseconds(),
		"query":       c.Request.URL.RawQuery,
	}

	// Add error if any
	if len(c.Errors) > 0 {
		details["error"] = c.Errors.String()
	}

	jsonBytes, _ := json.Marshal(details)
	return string(jsonBytes)
}

// generateRequestID generates a unique request ID
func generateRequestID() string {
	return time.Now().Format("20060102150405.000000")
}

// AuditCriticalOperation logs critical operations explicitly
func AuditCriticalOperation(db *gorm.DB, userID uint, action, resource, details string, c *gin.Context) {
	auditLog := AuditLog{
		UserID:    userID,
		Action:    action,
		Resource:  resource,
		Method:    c.Request.Method,
		Path:      c.Request.URL.Path,
		IPAddress: c.ClientIP(),
		UserAgent: c.Request.UserAgent(),
		RequestID: c.GetHeader("X-Request-ID"),
		Status:    c.Writer.Status(),
		Details:   details,
		CreatedAt: time.Now(),
	}

	db.Create(&auditLog)
}
