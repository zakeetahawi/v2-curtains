package benchmarks

import (
	"erp-system/internal/repositories"
	"erp-system/pkg/database"
	"erp-system/pkg/pagination"
	"testing"
)

// setupBenchmarkDB creates an in-memory database with sample data for benchmarking
func setupBenchmarkDB(b *testing.B) (repositories.CustomerRepository, repositories.SalesRepository, repositories.InventoryRepository) {
	// Connect to in-memory database
	db, err := database.Connect(":memory:")
	if err != nil {
		b.Fatalf("Failed to setup benchmark database: %v", err)
	}

	// Create repositories
	customerRepo := repositories.NewCustomerRepository(db)
	salesRepo := repositories.NewSalesRepository(db)
	inventoryRepo := repositories.NewInventoryRepository(db)

	// Seed sample data for benchmarking
	seedBenchmarkData(b)

	return customerRepo, salesRepo, inventoryRepo
}

func seedBenchmarkData(b *testing.B) {
	// Implementation would seed realistic data
	// For now, we'll create a few sample records
	// In production benchmark, you'd want 1000+ records
}

// BenchmarkCustomerQuery_WithIndexes measures customer query performance
func BenchmarkCustomerQuery_WithIndexes(b *testing.B) {
	customerRepo, _, _ := setupBenchmarkDB(b)

	// Reset timer to exclude setup time
	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		params := pagination.NewPaginationParams(1, 25)
		_ = customerRepo.FindAllPaginated(params, "")
	}
}

// BenchmarkCustomerQuery_WithSearch measures search performance
func BenchmarkCustomerQuery_WithSearch(b *testing.B) {
	customerRepo, _, _ := setupBenchmarkDB(b)

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		params := pagination.NewPaginationParams(1, 25)
		_ = customerRepo.FindAllPaginated(params, "test")
	}
}

// BenchmarkSalesOrdersQuery measures sales orders query performance
func BenchmarkSalesOrdersQuery(b *testing.B) {
	_, salesRepo, _ := setupBenchmarkDB(b)

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		params := pagination.NewPaginationParams(1, 25)
		_ = salesRepo.FindAllPaginated(params, "", 0)
	}
}

// BenchmarkSalesOrdersQuery_WithFilters measures filtered query performance
func BenchmarkSalesOrdersQuery_WithFilters(b *testing.B) {
	_, salesRepo, _ := setupBenchmarkDB(b)

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		params := pagination.NewPaginationParams(1, 25)
		_ = salesRepo.FindAllPaginated(params, "completed", 1)
	}
}

// BenchmarkProductsQuery measures products query performance
func BenchmarkProductsQuery(b *testing.B) {
	_, _, inventoryRepo := setupBenchmarkDB(b)

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		params := pagination.NewPaginationParams(1, 25)
		_ = inventoryRepo.FindAllProductsPaginated(params, "", 0)
	}
}

// BenchmarkProductsQuery_WithCategory measures category-filtered query performance
func BenchmarkProductsQuery_WithCategory(b *testing.B) {
	_, _, inventoryRepo := setupBenchmarkDB(b)

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		params := pagination.NewPaginationParams(1, 25)
		_ = inventoryRepo.FindAllProductsPaginated(params, "", 1)
	}
}

// BenchmarkPagination_LargeOffset measures performance with large page numbers
func BenchmarkPagination_LargeOffset(b *testing.B) {
	customerRepo, _, _ := setupBenchmarkDB(b)

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		// Simulate page 100 with 25 items per page
		params := pagination.NewPaginationParams(100, 25)
		_ = customerRepo.FindAllPaginated(params, "")
	}
}

// BenchmarkPagination_DifferentPageSizes measures performance with different page sizes
func BenchmarkPagination_DifferentPageSizes(b *testing.B) {
	customerRepo, _, _ := setupBenchmarkDB(b)

	testCases := []struct {
		name     string
		pageSize int
	}{
		{"PageSize_10", 10},
		{"PageSize_25", 25},
		{"PageSize_50", 50},
		{"PageSize_100", 100},
	}

	for _, tc := range testCases {
		b.Run(tc.name, func(b *testing.B) {
			b.ResetTimer()
			for i := 0; i < b.N; i++ {
				params := pagination.NewPaginationParams(1, tc.pageSize)
				_ = customerRepo.FindAllPaginated(params, "")
			}
		})
	}
}
