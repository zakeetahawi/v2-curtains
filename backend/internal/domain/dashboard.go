package domain

import "time"

// DashboardStats represents the main dashboard statistics
type DashboardStats struct {
	// Customer Stats
	TotalCustomers       int64   `json:"total_customers"`
	ActiveCustomers      int64   `json:"active_customers"` // Last 30 days
	NewCustomersThisWeek int64   `json:"new_customers_this_week"`
	CustomerGrowthRate   float64 `json:"customer_growth_rate"` // Percentage

	// Sales Stats
	TotalSalesToday     float64 `json:"total_sales_today"`
	TotalSalesThisWeek  float64 `json:"total_sales_this_week"`
	TotalSalesThisMonth float64 `json:"total_sales_this_month"`
	TotalSalesThisYear  float64 `json:"total_sales_this_year"`
	SalesGrowthRate     float64 `json:"sales_growth_rate"` // vs last month

	// Order Stats
	PendingOrdersCount   int64   `json:"pending_orders_count"`
	CompletedOrdersToday int64   `json:"completed_orders_today"`
	TotalOrdersThisMonth int64   `json:"total_orders_this_month"`
	AverageOrderValue    float64 `json:"average_order_value"`

	// Inventory Stats
	TotalProducts         int64   `json:"total_products"`
	LowStockProductsCount int64   `json:"low_stock_products_count"`
	OutOfStockCount       int64   `json:"out_of_stock_count"`
	TotalInventoryValue   float64 `json:"total_inventory_value"`

	// Production Stats
	ProductionOrdersInProgress int64 `json:"production_orders_in_progress"`
	ProductionOrdersCompleted  int64 `json:"production_orders_completed_today"`
	ProductionOrdersPending    int64 `json:"production_orders_pending"`

	// Top Products
	TopSellingProducts []TopProduct `json:"top_selling_products"`

	// Revenue Trend (last 7 days)
	RevenueTrend []DailyRevenue `json:"revenue_trend"`
}

// TopProduct represents a top-selling product
type TopProduct struct {
	ProductID    uint    `json:"product_id"`
	ProductName  string  `json:"product_name"`
	SKU          string  `json:"sku"`
	QuantitySold int64   `json:"quantity_sold"`
	Revenue      float64 `json:"revenue"`
}

// DailyRevenue represents revenue for a single day
type DailyRevenue struct {
	Date    string  `json:"date"` // YYYY-MM-DD
	Revenue float64 `json:"revenue"`
	Orders  int64   `json:"orders"`
}

// DashboardFilters for date range filtering
type DashboardFilters struct {
	StartDate *time.Time `json:"start_date"`
	EndDate   *time.Time `json:"end_date"`
}
