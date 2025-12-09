package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"erp-system/internal/middleware"

	"github.com/gin-gonic/gin"
)

func TestRateLimiter(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()

	limiter := middleware.NewRateLimiter(3, 1*time.Minute)
	router.Use(limiter.Middleware())

	router.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})

	for i := 0; i < 5; i++ {
		req := httptest.NewRequest("GET", "/test", nil)
		req.RemoteAddr = "192.168.1.1:1234"
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		if i < 3 {
			if w.Code != http.StatusOK {
				t.Errorf("Request %d: expected 200, got %d", i+1, w.Code)
			}
		} else {
			if w.Code != http.StatusTooManyRequests {
				t.Errorf("Request %d: expected 429, got %d", i+1, w.Code)
			}
		}
	}
}

func TestSecurityHeaders(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(middleware.SecurityHeaders())

	router.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})

	req := httptest.NewRequest("GET", "/test", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Header().Get("X-Frame-Options") == "" {
		t.Error("X-Frame-Options not set")
	}
	if w.Header().Get("X-Content-Type-Options") == "" {
		t.Error("X-Content-Type-Options not set")
	}
}
