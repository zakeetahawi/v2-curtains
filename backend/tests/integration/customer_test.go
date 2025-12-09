package integration

import (
"testing"
"erp-system/internal/domain"
"erp-system/internal/repositories"
"erp-system/internal/usecases"
"erp-system/tests/fixtures"
)

// TestFixtures_Integration verifies test fixtures load correctly
func TestFixtures_Integration(t *testing.T) {
db := fixtures.SetupTestDB(t)
defer fixtures.TeardownTestDB(db)
fixtures.SeedTestDB(t, db)

var users []domain.User
db.Find(&users)
if len(users) != 3 {
t.Errorf("Expected 3 users, got %d", len(users))
}

var customers []domain.Customer
db.Find(&customers)
if len(customers) != 3 {
t.Errorf("Expected 3 customers, got %d", len(customers))
}
}

// TestCustomerCreate_Integration tests creating a customer
func TestCustomerCreate_Integration(t *testing.T) {
db := fixtures.SetupTestDB(t)
defer fixtures.TeardownTestDB(db)
fixtures.SeedTestDB(t, db)

customerRepo := repositories.NewCustomerRepository(db)
activityRepo := repositories.NewCustomerActivityRepository(db)
documentRepo := repositories.NewCustomerDocumentRepository(db)
customerUC := usecases.NewCustomerUseCase(customerRepo, activityRepo, documentRepo, nil)

req := domain.CreateCustomerRequest{
Name:        "شركة الاختبار",
Email:       "test@company.com",
Phone:       "0233445566",
Mobile:      "01122334455",
Address:     "عنوان الاختبار",
City:        "القاهرة",
Country:     "مصر",
CreditLimit: 50000,
Type:        "corporate",
}

customer, err := customerUC.CreateCustomer(req, 1)
if err != nil {
t.Fatalf("CreateCustomer failed: %v", err)
}

if customer.Code == "" {
t.Error("Customer code should be generated")
}

if customer.Name != req.Name {
t.Errorf("Expected name %s, got %s", req.Name, customer.Name)
}
}

// TestCustomerList_Integration tests retrieving customer list
func TestCustomerList_Integration(t *testing.T) {
db := fixtures.SetupTestDB(t)
defer fixtures.TeardownTestDB(db)
fixtures.SeedTestDB(t, db)

customerRepo := repositories.NewCustomerRepository(db)
customerUC := usecases.NewCustomerUseCase(customerRepo, nil, nil, nil)

customers, total, err := customerUC.GetCustomers(1, 10, "")
if err != nil {
t.Fatalf("GetCustomers failed: %v", err)
}

if total < 3 {
t.Errorf("Expected at least 3 customers, got %d", total)
}

if len(customers) < 3 {
t.Errorf("Expected at least 3 in result, got %d", len(customers))
}
}
