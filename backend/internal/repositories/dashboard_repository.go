package repositories

import (
	"time"

	"erp-system/internal/domain"

	"gorm.io/gorm"
)

type DashboardRepository interface {
	GetDashboardStats(filters *domain.DashboardFilters) (*domain.DashboardStats, error)
}

type dashboardRepository struct {
	db *gorm.DB
}

func NewDashboardRepository(db *gorm.DB) DashboardRepository {
	return &dashboardRepository{db: db}
}

func (r *dashboardRepository) GetDashboardStats(filters *domain.DashboardFilters) (*domain.DashboardStats, error) {
	stats := &domain.DashboardStats{}
	now := time.Now()

	// Customer Stats
	if err := r.getCustomerStats(stats, now); err != nil {
		return nil, err
	}

	// Sales Stats
	if err := r.getSalesStats(stats, now); err != nil {
		return nil, err
	}

	// Order Stats
	if err := r.getOrderStats(stats, now); err != nil {
		return nil, err
	}

	// Inventory Stats
	if err := r.getInventoryStats(stats); err != nil {
		return nil, err
	}

	// Production Stats
	if err := r.getProductionStats(stats); err != nil {
		return nil, err
	}

	// Top Selling Products
	if err := r.getTopSellingProducts(stats, 5); err != nil {
		return nil, err
	}

	// Revenue Trend (last 7 days)
	if err := r.getRevenueTrend(stats, 7); err != nil {
		return nil, err
	}

	return stats, nil
}

func (r *dashboardRepository) getCustomerStats(stats *domain.DashboardStats, now time.Time) error {
	// Total customers (active only)
	if err := r.db.Model(&domain.Customer{}).
		Where("deleted_at IS NULL").
		Count(&stats.TotalCustomers).Error; err != nil {
		return err
	}

	// Active customers (last 30 days activity)
	thirtyDaysAgo := now.AddDate(0, 0, -30)
	if err := r.db.Model(&domain.Customer{}).
		Where("deleted_at IS NULL AND updated_at >= ?", thirtyDaysAgo).
		Count(&stats.ActiveCustomers).Error; err != nil {
		return err
	}

	// New customers this week
	weekStart := now.AddDate(0, 0, -int(now.Weekday()))
	if err := r.db.Model(&domain.Customer{}).
		Where("deleted_at IS NULL AND created_at >= ?", weekStart).
		Count(&stats.NewCustomersThisWeek).Error; err != nil {
		return err
	}

	// Customer growth rate (this month vs last month)
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	lastMonthStart := monthStart.AddDate(0, -1, 0)

	var thisMonthCount, lastMonthCount int64
	r.db.Model(&domain.Customer{}).
		Where("deleted_at IS NULL AND created_at >= ?", monthStart).
		Count(&thisMonthCount)
	r.db.Model(&domain.Customer{}).
		Where("deleted_at IS NULL AND created_at >= ? AND created_at < ?", lastMonthStart, monthStart).
		Count(&lastMonthCount)

	if lastMonthCount > 0 {
		stats.CustomerGrowthRate = float64(thisMonthCount-lastMonthCount) / float64(lastMonthCount) * 100
	}

	return nil
}

func (r *dashboardRepository) getSalesStats(stats *domain.DashboardStats, now time.Time) error {
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	weekStart := now.AddDate(0, 0, -int(now.Weekday()))
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	yearStart := time.Date(now.Year(), 1, 1, 0, 0, 0, 0, now.Location())

	// Total sales today
	r.db.Model(&domain.SalesOrder{}).
		Where("deleted_at IS NULL AND order_date >= ? AND status != ?", todayStart, "cancelled").
		Select("COALESCE(SUM(net_amount), 0)").
		Scan(&stats.TotalSalesToday)

	// Total sales this week
	r.db.Model(&domain.SalesOrder{}).
		Where("deleted_at IS NULL AND order_date >= ? AND status != ?", weekStart, "cancelled").
		Select("COALESCE(SUM(net_amount), 0)").
		Scan(&stats.TotalSalesThisWeek)

	// Total sales this month
	r.db.Model(&domain.SalesOrder{}).
		Where("deleted_at IS NULL AND order_date >= ? AND status != ?", monthStart, "cancelled").
		Select("COALESCE(SUM(net_amount), 0)").
		Scan(&stats.TotalSalesThisMonth)

	// Total sales this year
	r.db.Model(&domain.SalesOrder{}).
		Where("deleted_at IS NULL AND order_date >= ? AND status != ?", yearStart, "cancelled").
		Select("COALESCE(SUM(net_amount), 0)").
		Scan(&stats.TotalSalesThisYear)

	// Sales growth rate (this month vs last month)
	lastMonthStart := monthStart.AddDate(0, -1, 0)
	var lastMonthSales float64
	r.db.Model(&domain.SalesOrder{}).
		Where("deleted_at IS NULL AND order_date >= ? AND order_date < ? AND status != ?", lastMonthStart, monthStart, "cancelled").
		Select("COALESCE(SUM(net_amount), 0)").
		Scan(&lastMonthSales)

	if lastMonthSales > 0 {
		stats.SalesGrowthRate = (stats.TotalSalesThisMonth - lastMonthSales) / lastMonthSales * 100
	}

	return nil
}

func (r *dashboardRepository) getOrderStats(stats *domain.DashboardStats, now time.Time) error {
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	// Pending orders count
	r.db.Model(&domain.SalesOrder{}).
		Where("deleted_at IS NULL AND status = ?", "pending").
		Count(&stats.PendingOrdersCount)

	// Completed orders today
	r.db.Model(&domain.SalesOrder{}).
		Where("deleted_at IS NULL AND status = ? AND updated_at >= ?", "completed", todayStart).
		Count(&stats.CompletedOrdersToday)

	// Total orders this month
	r.db.Model(&domain.SalesOrder{}).
		Where("deleted_at IS NULL AND order_date >= ?", monthStart).
		Count(&stats.TotalOrdersThisMonth)

	// Average order value
	if stats.TotalOrdersThisMonth > 0 {
		stats.AverageOrderValue = stats.TotalSalesThisMonth / float64(stats.TotalOrdersThisMonth)
	}

	return nil
}

func (r *dashboardRepository) getInventoryStats(stats *domain.DashboardStats) error {
	// Total products (active only)
	r.db.Model(&domain.Product{}).
		Where("deleted_at IS NULL AND is_active = ?", true).
		Count(&stats.TotalProducts)

	// Low stock products (quantity <= reorder_level)
	r.db.Table("products p").
		Select("COUNT(DISTINCT p.id)").
		Joins("LEFT JOIN stock_movements sm ON p.id = sm.product_id AND sm.deleted_at IS NULL").
		Where("p.deleted_at IS NULL AND p.is_active = ? AND COALESCE(sm.quantity, 0) <= p.reorder_level", true).
		Scan(&stats.LowStockProductsCount)

	// Out of stock
	r.db.Table("products p").
		Select("COUNT(DISTINCT p.id)").
		Joins("LEFT JOIN stock_movements sm ON p.id = sm.product_id AND sm.deleted_at IS NULL").
		Where("p.deleted_at IS NULL AND p.is_active = ? AND COALESCE(sm.quantity, 0) = 0", true).
		Scan(&stats.OutOfStockCount)

	// Total inventory value
	r.db.Table("products p").
		Select("COALESCE(SUM(p.cost_price * COALESCE(sm.quantity, 0)), 0)").
		Joins("LEFT JOIN stock_movements sm ON p.id = sm.product_id AND sm.deleted_at IS NULL").
		Where("p.deleted_at IS NULL AND p.is_active = ?", true).
		Scan(&stats.TotalInventoryValue)

	return nil
}

func (r *dashboardRepository) getProductionStats(stats *domain.DashboardStats) error {
	// Production orders in progress
	r.db.Model(&domain.ProductionOrder{}).
		Where("deleted_at IS NULL AND status = ?", "in_progress").
		Count(&stats.ProductionOrdersInProgress)

	// Completed today
	todayStart := time.Now().Truncate(24 * time.Hour)
	r.db.Model(&domain.ProductionOrder{}).
		Where("deleted_at IS NULL AND status = ? AND updated_at >= ?", "completed", todayStart).
		Count(&stats.ProductionOrdersCompleted)

	// Pending
	r.db.Model(&domain.ProductionOrder{}).
		Where("deleted_at IS NULL AND status = ?", "pending").
		Count(&stats.ProductionOrdersPending)

	return nil
}

func (r *dashboardRepository) getTopSellingProducts(stats *domain.DashboardStats, limit int) error {
	type Result struct {
		ProductID    uint
		ProductName  string
		SKU          string
		QuantitySold int64
		Revenue      float64
	}

	var results []Result
	err := r.db.Table("sales_order_items soi").
		Select(`
			p.id as product_id,
			p.name as product_name,
			p.sku,
			SUM(soi.quantity) as quantity_sold,
			SUM(soi.total) as revenue
		`).
		Joins("JOIN products p ON soi.product_id = p.id").
		Joins("JOIN sales_orders so ON soi.order_id = so.id").
		Where("soi.deleted_at IS NULL AND so.deleted_at IS NULL AND so.status != ?", "cancelled").
		Group("p.id, p.name, p.sku").
		Order("quantity_sold DESC").
		Limit(limit).
		Scan(&results).Error

	if err != nil {
		return err
	}

	stats.TopSellingProducts = make([]domain.TopProduct, len(results))
	for i, r := range results {
		stats.TopSellingProducts[i] = domain.TopProduct{
			ProductID:    r.ProductID,
			ProductName:  r.ProductName,
			SKU:          r.SKU,
			QuantitySold: r.QuantitySold,
			Revenue:      r.Revenue,
		}
	}

	return nil
}

func (r *dashboardRepository) getRevenueTrend(stats *domain.DashboardStats, days int) error {
	type Result struct {
		Date    string
		Revenue float64
		Orders  int64
	}

	now := time.Now()
	startDate := now.AddDate(0, 0, -days+1).Truncate(24 * time.Hour)

	var results []Result
	err := r.db.Table("sales_orders").
		Select(`
			DATE(order_date) as date,
			COALESCE(SUM(net_amount), 0) as revenue,
			COUNT(*) as orders
		`).
		Where("deleted_at IS NULL AND order_date >= ? AND status != ?", startDate, "cancelled").
		Group("DATE(order_date)").
		Order("date ASC").
		Scan(&results).Error

	if err != nil {
		return err
	}

	stats.RevenueTrend = make([]domain.DailyRevenue, len(results))
	for i, r := range results {
		stats.RevenueTrend[i] = domain.DailyRevenue{
			Date:    r.Date,
			Revenue: r.Revenue,
			Orders:  r.Orders,
		}
	}

	return nil
}
