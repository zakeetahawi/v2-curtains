package middleware

import (
	"crypto/rand"
	"encoding/base64"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

// CSRFToken represents a CSRF token with expiration
type CSRFToken struct {
	Token     string
	ExpiresAt time.Time
}

// CSRFProtection handles CSRF token generation and validation
type CSRFProtection struct {
	tokens map[string]*CSRFToken // sessionID -> token
	mu     sync.RWMutex
	ttl    time.Duration
}

// NewCSRFProtection creates a new CSRF protection instance
func NewCSRFProtection(ttl time.Duration) *CSRFProtection {
	csrf := &CSRFProtection{
		tokens: make(map[string]*CSRFToken),
		ttl:    ttl,
	}

	// Start cleanup goroutine
	go csrf.cleanupExpiredTokens()

	return csrf
}

// generateToken creates a random CSRF token
func (c *CSRFProtection) generateToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(bytes), nil
}

// GetOrCreateToken gets existing token or creates new one
func (c *CSRFProtection) GetOrCreateToken(sessionID string) (string, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	// Check if valid token exists
	if token, exists := c.tokens[sessionID]; exists {
		if time.Now().Before(token.ExpiresAt) {
			return token.Token, nil
		}
		// Token expired, delete it
		delete(c.tokens, sessionID)
	}

	// Generate new token
	tokenString, err := c.generateToken()
	if err != nil {
		return "", err
	}

	c.tokens[sessionID] = &CSRFToken{
		Token:     tokenString,
		ExpiresAt: time.Now().Add(c.ttl),
	}

	return tokenString, nil
}

// ValidateToken checks if the provided token is valid
func (c *CSRFProtection) ValidateToken(sessionID, token string) bool {
	c.mu.RLock()
	defer c.mu.RUnlock()

	csrfToken, exists := c.tokens[sessionID]
	if !exists {
		return false
	}

	// Check expiration
	if time.Now().After(csrfToken.ExpiresAt) {
		return false
	}

	// Compare tokens
	return csrfToken.Token == token
}

// DeleteToken removes a token
func (c *CSRFProtection) DeleteToken(sessionID string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	delete(c.tokens, sessionID)
}

// cleanupExpiredTokens runs periodically to remove expired tokens
func (c *CSRFProtection) cleanupExpiredTokens() {
	ticker := time.NewTicker(10 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		c.mu.Lock()
		now := time.Now()
		for sessionID, token := range c.tokens {
			if now.After(token.ExpiresAt) {
				delete(c.tokens, sessionID)
			}
		}
		c.mu.Unlock()
	}
}

// Middleware returns Gin middleware for CSRF protection
func (c *CSRFProtection) Middleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Get session ID (from cookie or generate temporary one)
		sessionID, err := ctx.Cookie("session_id")
		if err != nil {
			// Generate temporary session ID for this request
			sessionID = generateSessionID()
			ctx.SetCookie("session_id", sessionID, 3600, "/", "", false, true)
		}

		// For GET/HEAD/OPTIONS, generate and set CSRF token
		if ctx.Request.Method == "GET" || ctx.Request.Method == "HEAD" || ctx.Request.Method == "OPTIONS" {
			token, err := c.GetOrCreateToken(sessionID)
			if err == nil {
				ctx.Header("X-CSRF-Token", token)
				ctx.Set("csrf_token", token)
			}
			ctx.Next()
			return
		}

		// For POST/PUT/DELETE/PATCH, validate CSRF token
		if ctx.Request.Method == "POST" || ctx.Request.Method == "PUT" ||
			ctx.Request.Method == "DELETE" || ctx.Request.Method == "PATCH" {

			// Get token from header or form
			token := ctx.GetHeader("X-CSRF-Token")
			if token == "" {
				token = ctx.PostForm("csrf_token")
			}

			// Validate token
			if !c.ValidateToken(sessionID, token) {
				ctx.JSON(http.StatusForbidden, gin.H{
					"success": false,
					"message": "رمز CSRF غير صحيح أو منتهي الصلاحية",
				})
				ctx.Abort()
				return
			}
		}

		ctx.Next()
	}
}

// SkipCSRF middleware to skip CSRF check for specific routes
func SkipCSRF() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Set("skip_csrf", true)
		ctx.Next()
	}
}

// generateSessionID creates a random session ID
func generateSessionID() string {
	bytes := make([]byte, 16)
	rand.Read(bytes)
	return base64.URLEncoding.EncodeToString(bytes)
}

// GetCSRFToken extracts CSRF token from context (for templates/responses)
func GetCSRFToken(ctx *gin.Context) string {
	if token, exists := ctx.Get("csrf_token"); exists {
		if tokenStr, ok := token.(string); ok {
			return tokenStr
		}
	}
	return ""
}
