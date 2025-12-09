package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

// RateLimiter holds rate limiting configuration and state
type RateLimiter struct {
	requests map[string]*clientRate
	mu       sync.RWMutex
	limit    int           // max requests
	window   time.Duration // time window
}

// clientRate tracks request count and window for a client
type clientRate struct {
	count      int
	resetTime  time.Time
	lastAccess time.Time
}

// NewRateLimiter creates a new rate limiter
// limit: maximum requests allowed per window
// window: time window duration (e.g., 1 minute)
func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
	rl := &RateLimiter{
		requests: make(map[string]*clientRate),
		limit:    limit,
		window:   window,
	}

	// Start cleanup goroutine to remove stale entries
	go rl.cleanupStaleEntries()

	return rl
}

// Middleware returns a Gin middleware function for rate limiting
func (rl *RateLimiter) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get client identifier (IP address or user ID)
		clientID := rl.getClientID(c)

		if !rl.allowRequest(clientID) {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"message": "معدل الطلبات مرتفع جداً. حاول مرة أخرى لاحقاً",
				"error":   "Rate limit exceeded. Please try again later.",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// getClientID extracts client identifier from request
func (rl *RateLimiter) getClientID(c *gin.Context) string {
	// Try to get user ID from context (if authenticated)
	if userID, exists := c.Get("user_id"); exists {
		return "user:" + userID.(string)
	}

	// Fall back to IP address
	return "ip:" + c.ClientIP()
}

// allowRequest checks if a request should be allowed
func (rl *RateLimiter) allowRequest(clientID string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()

	// Get or create client rate entry
	client, exists := rl.requests[clientID]
	if !exists {
		rl.requests[clientID] = &clientRate{
			count:      1,
			resetTime:  now.Add(rl.window),
			lastAccess: now,
		}
		return true
	}

	// Reset if window has passed
	if now.After(client.resetTime) {
		client.count = 1
		client.resetTime = now.Add(rl.window)
		client.lastAccess = now
		return true
	}

	// Check if limit exceeded
	if client.count >= rl.limit {
		client.lastAccess = now
		return false
	}

	// Increment counter
	client.count++
	client.lastAccess = now
	return true
}

// cleanupStaleEntries removes old entries to prevent memory leaks
func (rl *RateLimiter) cleanupStaleEntries() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		rl.mu.Lock()
		now := time.Now()

		for clientID, client := range rl.requests {
			// Remove entries not accessed in last 10 minutes
			if now.Sub(client.lastAccess) > 10*time.Minute {
				delete(rl.requests, clientID)
			}
		}

		rl.mu.Unlock()
	}
}

// GetStats returns current rate limiter statistics
func (rl *RateLimiter) GetStats() map[string]interface{} {
	rl.mu.RLock()
	defer rl.mu.RUnlock()

	return map[string]interface{}{
		"total_clients": len(rl.requests),
		"limit":         rl.limit,
		"window":        rl.window.String(),
	}
}
