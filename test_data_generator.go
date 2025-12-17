package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

const baseURL = "http://localhost:8080/api/v1"

func main() {
	fmt.Println("🚀 Starting Test Data Generation...")

	// 1. Create Users
	createUsers()

	// 2. Create Products
	createProducts()

	fmt.Println("✅ Test Data Generation Complete!")
}

func createUsers() {
	fmt.Println("\n-------- Crating Users --------")
	users := []map[string]interface{}{
		{
			"username":  "manager1",
			"email":     "manager1@erp.local",
			"password":  "password123",
			"role_id":   2,
			"branch_id": 1,
			"is_active": true,
		},
		{
			"username":  "employee1",
			"email":     "employee1@erp.local",
			"password":  "password123",
			"role_id":   3,
			"branch_id": 1,
			"is_active": true,
		},
	}

	for _, user := range users {
		post("/users", user)
	}
}

func createProducts() {
	fmt.Println("\n-------- Creating Products --------")
	// First ensure category exists
	post("/inventory/categories", map[string]interface{}{
		"name":        "Electronics",
		"description": "Electronic items",
	})

	products := []map[string]interface{}{
		{
			"sku":             "TEST-001",
			"name":            "Gaming Laptop",
			"description":     "High performance gaming laptop",
			"category_id":     1,
			"cost_price":      15000,
			"selling_price":   18500,
			"stock_quantity":  50,
			"reorder_level":   5,
			"max_stock_level": 100,
		},
		{
			"sku":             "TEST-002",
			"name":            "Wireless Mouse",
			"description":     "Ergonomic wireless mouse",
			"category_id":     1,
			"cost_price":      250,
			"selling_price":   450,
			"stock_quantity":  200,
			"reorder_level":   20,
			"max_stock_level": 500,
		},
		{
			"sku":             "TEST-003",
			"name":            "Mechanical Keyboard",
			"description":     "RGB Mechanical Keyboard",
			"category_id":     1,
			"cost_price":      800,
			"selling_price":   1200,
			"stock_quantity":  0, // Out of stock
			"reorder_level":   10,
			"max_stock_level": 100,
		},
	}

	for _, product := range products {
		post("/inventory/products", product)
	}
}

func post(endpoint string, data interface{}) {
	jsonData, _ := json.Marshal(data)
	resp, err := http.Post(baseURL+endpoint, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Printf("❌ Failed to request %s: %v\n", endpoint, err)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		fmt.Printf("✅ Success %s: %s\n", endpoint, extractSuccess(body))
	} else {
		fmt.Printf("❌ Error %s (%d): %s\n", endpoint, resp.StatusCode, string(body))
	}
}

func extractSuccess(body []byte) string {
	if len(body) > 100 {
		return "Created successfully" // Truncate long output
	}
	return string(body)
}
