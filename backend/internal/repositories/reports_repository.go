package repositories

import (
	"gorm.io/gorm"
)

type ReportsRepository interface {
	GetSalesStats(startDate, endDate string) (map[string]interface{}, error)
	GetInventoryStats() (map[string]interface{}, error)
}

type reportsRepository struct {
	db *gorm.DB
}

func NewReportsRepository(db *gorm.DB) ReportsRepository {
	return &reportsRepository{db: db}
}

func (r *reportsRepository) GetSalesStats(startDate, endDate string) (map[string]interface{}, error) {
	var totalSales float64
	var totalOrders int64

	// Total Sales
	r.db.Table("sales_orders").Where("created_at BETWEEN ? AND ?", startDate, endDate).Select("COALESCE(SUM(total_amount), 0)").Scan(&totalSales)

	// Total Orders
	r.db.Table("sales_orders").Where("created_at BETWEEN ? AND ?", startDate, endDate).Count(&totalOrders)

	// Sales by Status
	var salesByStatus []struct {
		Status string `json:"status"`
		Count  int    `json:"count"`
	}
	r.db.Table("sales_orders").Where("created_at BETWEEN ? AND ?", startDate, endDate).Select("status, count(*) as count").Group("status").Scan(&salesByStatus)

	return map[string]interface{}{
		"total_sales":     totalSales,
		"total_orders":    totalOrders,
		"sales_by_status": salesByStatus,
	}, nil
}

func (r *reportsRepository) GetInventoryStats() (map[string]interface{}, error) {
	var totalProducts int64
	var lowStockProducts int64
	var totalValue float64

	// Total Products
	r.db.Table("products").Count(&totalProducts)

	// Low Stock (reorder level)
	r.db.Table("products").Where("reorder_level >= 0").Count(&lowStockProducts) // Simplified logic

	// Total Value
	r.db.Table("products").Select("COALESCE(SUM(cost_price * reorder_level), 0)").Scan(&totalValue) // Using reorder_level as proxy for stock for now

	return map[string]interface{}{
		"total_products":     totalProducts,
		"low_stock_products": lowStockProducts,
		"total_value":        totalValue,
	}, nil
}
