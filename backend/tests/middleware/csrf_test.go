package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"erp-system/internal/middleware"

	"github.com/gin-gonic/gin"
)

func TestCSRFProtection_GenerateToken(t *testing.T) {
	csrf := middleware.NewCSRFProtection(1 * time.Hour)
	token, err := csrf.GetOrCreateToken("session123")

	if err != nil {
		t.Fatalf("Expected no error, got: %v", err)
	}

	if token == "" {
		t.Error("Expected non-empty token")
	}

	if len(token) < 32 {
		t.Errorf("Expected token length >= 32, got: %d", len(token))
	}
}

func TestCSRFProtection_TokenPersistence(t *testing.T) {
	csrf := middleware.NewCSRFProtection(1 * time.Hour)
	sessionID := "session123"

	// Get first token
	token1, _ := csrf.GetOrCreateToken(sessionID)

	// Get token again - should be same
	token2, _ := csrf.GetOrCreateToken(sessionID)

	if token1 != token2 {
		t.Error("Expected same token for same session")
	}
}

func TestCSRFProtection_ValidateToken(t *testing.T) {
	csrf := middleware.NewCSRFProtection(1 * time.Hour)
	sessionID := "session123"

	token, _ := csrf.GetOrCreateToken(sessionID)

	// Valid token
	if !csrf.ValidateToken(sessionID, token) {
		t.Error("Expected valid token to pass validation")
	}

	// Invalid token
	if csrf.ValidateToken(sessionID, "invalid_token") {
		t.Error("Expected invalid token to fail validation")
	}

	// Wrong session
	if csrf.ValidateToken("wrong_session", token) {
		t.Error("Expected token to fail for wrong session")
	}
}

func TestCSRFProtection_TokenExpiration(t *testing.T) {
	csrf := middleware.NewCSRFProtection(100 * time.Millisecond)
	sessionID := "session123"

	token, _ := csrf.GetOrCreateToken(sessionID)

	// Token should be valid immediately
	if !csrf.ValidateToken(sessionID, token) {
		t.Error("Expected fresh token to be valid")
	}

	// Wait for expiration
	time.Sleep(150 * time.Millisecond)

	// Token should be expired
	if csrf.ValidateToken(sessionID, token) {
		t.Error("Expected expired token to be invalid")
	}
}

func TestCSRFMiddleware_GET_Request(t *testing.T) {
	csrf := middleware.NewCSRFProtection(1 * time.Hour)
	gin.SetMode(gin.TestMode)

	router := gin.New()
	router.Use(csrf.Middleware())
	router.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "ok"})
	})

	req := httptest.NewRequest("GET", "/test", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	// Should succeed
	if w.Code != 200 {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	// Should have CSRF token in header
	token := w.Header().Get("X-CSRF-Token")
	if token == "" {
		t.Error("Expected CSRF token in response header")
	}
}

func TestCSRFMiddleware_POST_WithValidToken(t *testing.T) {
	csrf := middleware.NewCSRFProtection(1 * time.Hour)
	gin.SetMode(gin.TestMode)

	router := gin.New()
	router.Use(csrf.Middleware())
	router.POST("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "ok"})
	})

	// First, get a token
	sessionID := "session123"
	token, _ := csrf.GetOrCreateToken(sessionID)

	// Make POST request with valid token
	req := httptest.NewRequest("POST", "/test", strings.NewReader("{}"))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-CSRF-Token", token)
	req.AddCookie(&http.Cookie{Name: "session_id", Value: sessionID})

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Should succeed
	if w.Code != 200 {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}

func TestCSRFMiddleware_POST_WithoutToken(t *testing.T) {
	csrf := middleware.NewCSRFProtection(1 * time.Hour)
	gin.SetMode(gin.TestMode)

	router := gin.New()
	router.Use(csrf.Middleware())
	router.POST("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "ok"})
	})

	// Make POST request without token
	req := httptest.NewRequest("POST", "/test", strings.NewReader("{}"))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Should fail with 403
	if w.Code != 403 {
		t.Errorf("Expected status 403, got %d", w.Code)
	}
}

func TestCSRFMiddleware_POST_WithInvalidToken(t *testing.T) {
	csrf := middleware.NewCSRFProtection(1 * time.Hour)
	gin.SetMode(gin.TestMode)

	router := gin.New()
	router.Use(csrf.Middleware())
	router.POST("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "ok"})
	})

	// Make POST request with invalid token
	req := httptest.NewRequest("POST", "/test", strings.NewReader("{}"))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-CSRF-Token", "invalid_token")
	req.AddCookie(&http.Cookie{Name: "session_id", Value: "session123"})

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Should fail with 403
	if w.Code != 403 {
		t.Errorf("Expected status 403, got %d", w.Code)
	}
}

func TestCSRFMiddleware_PUT_DELETE_PATCH(t *testing.T) {
	csrf := middleware.NewCSRFProtection(1 * time.Hour)
	gin.SetMode(gin.TestMode)

	methods := []string{"PUT", "DELETE", "PATCH"}
	sessionID := "session123"
	token, _ := csrf.GetOrCreateToken(sessionID)

	for _, method := range methods {
		router := gin.New()
		router.Use(csrf.Middleware())
		router.Handle(method, "/test", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "ok"})
		})

		// Valid token
		req := httptest.NewRequest(method, "/test", strings.NewReader("{}"))
		req.Header.Set("X-CSRF-Token", token)
		req.AddCookie(&http.Cookie{Name: "session_id", Value: sessionID})
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != 200 {
			t.Errorf("%s with valid token: Expected 200, got %d", method, w.Code)
		}

		// Invalid token
		req2 := httptest.NewRequest(method, "/test", strings.NewReader("{}"))
		w2 := httptest.NewRecorder()
		router.ServeHTTP(w2, req2)

		if w2.Code != 403 {
			t.Errorf("%s without token: Expected 403, got %d", method, w2.Code)
		}
	}
}

func TestCSRFProtection_DeleteToken(t *testing.T) {
	csrf := middleware.NewCSRFProtection(1 * time.Hour)
	sessionID := "session123"

	token, _ := csrf.GetOrCreateToken(sessionID)

	// Token should be valid
	if !csrf.ValidateToken(sessionID, token) {
		t.Error("Expected token to be valid before deletion")
	}

	// Delete token
	csrf.DeleteToken(sessionID)

	// Token should be invalid after deletion
	if csrf.ValidateToken(sessionID, token) {
		t.Error("Expected token to be invalid after deletion")
	}
}
