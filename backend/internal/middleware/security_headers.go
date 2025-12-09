package middleware

import (
	"github.com/gin-gonic/gin"
)

// SecurityHeaders adds security-related HTTP headers to responses
func SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Prevent clickjacking attacks
		c.Header("X-Frame-Options", "DENY")

		// Prevent MIME type sniffing
		c.Header("X-Content-Type-Options", "nosniff")

		// Enable XSS protection in browsers
		c.Header("X-XSS-Protection", "1; mode=block")

		// Enforce HTTPS (only in production)
		// c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

		// Content Security Policy - restrict resource loading
		csp := "default-src 'self'; " +
			"script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net; " +
			"style-src 'self' 'unsafe-inline' cdn.jsdelivr.net fonts.googleapis.com; " +
			"font-src 'self' fonts.gstatic.com cdn.jsdelivr.net; " +
			"img-src 'self' data: https:; " +
			"connect-src 'self'; " +
			"frame-ancestors 'none';"
		c.Header("Content-Security-Policy", csp)

		// Referrer Policy - control referrer information
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")

		// Permissions Policy - control browser features
		c.Header("Permissions-Policy", "geolocation=(), microphone=(), camera=()")

		c.Next()
	}
}
