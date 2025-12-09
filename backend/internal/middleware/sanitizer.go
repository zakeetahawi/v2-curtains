package middleware

import (
	"html"
	"reflect"
	"strings"

	"github.com/gin-gonic/gin"
)

// Sanitizer middleware sanitizes all input data to prevent XSS attacks
func Sanitizer() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Sanitize query parameters
		sanitizeQueryParams(c)

		// Sanitize form data
		sanitizeFormData(c)

		// Note: JSON body sanitization should be done in handlers
		// after binding to avoid interfering with JSON parsing

		c.Next()
	}
}

// sanitizeQueryParams sanitizes URL query parameters
func sanitizeQueryParams(c *gin.Context) {
	query := c.Request.URL.Query()
	for key, values := range query {
		for i, value := range values {
			query[key][i] = sanitizeString(value)
		}
	}
	c.Request.URL.RawQuery = query.Encode()
}

// sanitizeFormData sanitizes form data
func sanitizeFormData(c *gin.Context) {
	if c.Request.Form != nil {
		for key, values := range c.Request.Form {
			for i, value := range values {
				c.Request.Form[key][i] = sanitizeString(value)
			}
		}
	}

	if c.Request.PostForm != nil {
		for key, values := range c.Request.PostForm {
			for i, value := range values {
				c.Request.PostForm[key][i] = sanitizeString(value)
			}
		}
	}
}

// sanitizeString removes potentially dangerous characters
func sanitizeString(s string) string {
	// HTML escape to prevent XSS
	s = html.EscapeString(s)

	// Remove null bytes
	s = strings.ReplaceAll(s, "\x00", "")

	// Trim whitespace
	s = strings.TrimSpace(s)

	return s
}

// SanitizeStruct sanitizes all string fields in a struct
func SanitizeStruct(data interface{}) {
	v := reflect.ValueOf(data)

	// If it's a pointer, get the underlying value
	if v.Kind() == reflect.Ptr {
		v = v.Elem()
	}

	// Only work with structs
	if v.Kind() != reflect.Struct {
		return
	}

	// Iterate through fields
	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)

		// Skip unexported fields
		if !field.CanSet() {
			continue
		}

		switch field.Kind() {
		case reflect.String:
			// Sanitize string fields
			sanitized := sanitizeString(field.String())
			field.SetString(sanitized)

		case reflect.Struct:
			// Recursively sanitize nested structs
			SanitizeStruct(field.Addr().Interface())

		case reflect.Ptr:
			// Handle pointer fields
			if !field.IsNil() && field.Elem().Kind() == reflect.Struct {
				SanitizeStruct(field.Interface())
			}
		}
	}
}

// SanitizeMap sanitizes string values in a map
func SanitizeMap(data map[string]interface{}) {
	for key, value := range data {
		switch v := value.(type) {
		case string:
			data[key] = sanitizeString(v)
		case map[string]interface{}:
			SanitizeMap(v)
		case []interface{}:
			sanitizeSlice(v)
		}
	}
}

// sanitizeSlice sanitizes elements in a slice
func sanitizeSlice(data []interface{}) {
	for i, item := range data {
		switch v := item.(type) {
		case string:
			data[i] = sanitizeString(v)
		case map[string]interface{}:
			SanitizeMap(v)
		case []interface{}:
			sanitizeSlice(v)
		}
	}
}
