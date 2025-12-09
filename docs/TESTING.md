# 🧪 Testing Guidelines - ERP System

## 📋 Overview

This document outlines the testing standards, best practices, and guidelines for the ERP System project.

**Testing Philosophy**: We follow Test-Driven Development (TDD) principles where applicable and aim for **>80% test coverage** across all critical business logic.

---

## 🏗️ Testing Structure

```
backend/tests/
├── unit/              # Unit tests for use cases and business logic
│   ├── auth_usecase_test.go
│   ├── customer_usecase_test.go
│   └── ...
├── integration/       # Integration tests for API endpoints
│   ├── customer_api_test.go
│   └── ...
├── mocks/            # Mock implementations of repositories
│   ├── user_repository_mock.go
│   ├── customer_repository_mock.go
│   └── ...
└── fixtures/         # Test data and database helpers
    ├── test_data.go
    └── database.go
```

---

## 📝 Testing Standards

### 1. **Unit Tests**

Unit tests focus on individual functions/methods in isolation using mocks.

#### Naming Convention
```go
func Test<UseCase>_<Method>_<Scenario>(t *testing.T)
```

**Examples**:
- `TestAuthUseCase_Login_Success`
- `TestAuthUseCase_Login_InvalidPassword`
- `TestCustomerUseCase_CreateCustomer_Success`

#### Structure (AAA Pattern)
```go
func TestAuthUseCase_Login_Success(t *testing.T) {
    // ARRANGE - Setup
    mockRepo := mocks.NewMockUserRepository()
    authUC := usecases.NewAuthUseCase(mockRepo)
    
    // Test data
    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
    testUser := &domain.User{
        ID:           1,
        Email:        "test@example.com",
        PasswordHash: string(hashedPassword),
        IsActive:     true,
    }
    mockRepo.Users[testUser.Email] = testUser

    // ACT - Execute
    response, err := authUC.Login("test@example.com", "password123")

    // ASSERT - Verify
    if err != nil {
        t.Fatalf("Expected no error, got: %v", err)
    }
    if response == nil {
        t.Fatal("Expected response, got nil")
    }
    if response.AccessToken == "" {
        t.Error("Expected access token, got empty string")
    }
}
```

#### Best Practices
- ✅ **Test one thing**: Each test should verify one specific behavior
- ✅ **Clear assertions**: Use descriptive error messages
- ✅ **Independent tests**: Tests should not depend on each other
- ✅ **Mock external dependencies**: Use mocks for repositories, services
- ✅ **Table-driven tests**: For testing multiple scenarios

**Example - Table-Driven Test**:
```go
func TestValidateEmail(t *testing.T) {
    tests := []struct {
        name    string
        email   string
        wantErr bool
    }{
        {"Valid email", "user@example.com", false},
        {"Missing @", "userexample.com", true},
        {"Empty email", "", true},
        {"No domain", "user@", true},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := ValidateEmail(tt.email)
            if (err != nil) != tt.wantErr {
                t.Errorf("ValidateEmail() error = %v, wantErr %v", err, tt.wantErr)
            }
        })
    }
}
```

---

### 2. **Integration Tests**

Integration tests verify that components work together correctly.

#### Database Setup
```go
func TestCustomerAPI_Integration(t *testing.T) {
    // Setup test database
    db := fixtures.SetupTestDB(t)
    defer fixtures.TeardownTestDB(db)
    
    // Seed with test data
    fixtures.SeedTestDB(t, db)
    
    // Test your API endpoints
    // ...
}
```

#### Best Practices
- ✅ Use in-memory SQLite for fast tests
- ✅ Seed database with known test data
- ✅ Clean up after each test
- ✅ Test full request/response cycle
- ✅ Verify database state changes

---

### 3. **Mock Objects**

Mocks simulate external dependencies without actual implementation.

#### Creating Mocks
```go
type MockUserRepository struct {
    Users          map[string]*domain.User
    FindByEmailErr error
    CreateErr      error
}

func NewMockUserRepository() *MockUserRepository {
    return &MockUserRepository{
        Users: make(map[string]*domain.User),
    }
}

func (m *MockUserRepository) FindByEmail(email string) (*domain.User, error) {
    if m.FindByEmailErr != nil {
        return nil, m.FindByEmailErr
    }
    
    user, exists := m.Users[email]
    if !exists {
        return nil, errors.New("user not found")
    }
    
    return user, nil
}
```

#### Best Practices
- ✅ Implement all interface methods
- ✅ Allow error injection for testing error cases
- ✅ Store data in maps for easy manipulation
- ✅ Keep mocks simple and predictable

---

### 4. **Test Fixtures**

Fixtures provide consistent test data across tests.

#### Using Fixtures
```go
// Get test users
users := fixtures.TestUsers()

// Get test customers
customers := fixtures.TestCustomers()

// Setup database with fixtures
db := fixtures.SetupTestDB(t)
fixtures.SeedTestDB(t, db)
```

#### Available Fixtures
- `TestUsers()` - Sample users with different roles
- `TestCustomers()` - Sample customers (VIP, regular, wholesale)
- `TestActivities()` - Sample activities (notes, calls, reminders)
- `TestDocuments()` - Sample customer documents
- `TestNotifications()` - Sample notifications

---

## 🚀 Running Tests

### Run All Tests
```bash
cd backend
go test ./... -v
```

### Run Specific Package
```bash
go test ./tests/unit/... -v
go test ./tests/integration/... -v
```

### Run Single Test
```bash
go test -v -run TestAuthUseCase_Login_Success ./tests/unit/
```

### Run with Coverage
```bash
go test ./... -cover
```

### Generate Coverage Report
```bash
go test ./... -coverprofile=coverage.out
go tool cover -html=coverage.out -o coverage.html
```

### Run Tests with Race Detector
```bash
go test ./... -race
```

---

## 📊 Coverage Requirements

### Minimum Coverage Targets

| Component | Coverage Target |
|-----------|----------------|
| **Use Cases** | 80%+ |
| **Repositories** | 70%+ |
| **Handlers** | 70%+ |
| **Domain Logic** | 90%+ |
| **Overall** | 75%+ |

### Checking Coverage
```bash
# Generate coverage for specific package
go test ./internal/usecases/... -coverprofile=usecases_coverage.out

# View coverage in browser
go tool cover -html=usecases_coverage.out
```

---

## ✅ Test Checklist

### Before Writing Tests
- [ ] Understand the function's requirements
- [ ] Identify edge cases and error conditions
- [ ] Prepare test data (use fixtures if available)
- [ ] Set up mocks for dependencies

### While Writing Tests
- [ ] Follow AAA pattern (Arrange, Act, Assert)
- [ ] Use descriptive test names
- [ ] Test both success and error cases
- [ ] Include edge cases (nil, empty, invalid values)
- [ ] Verify all return values

### After Writing Tests
- [ ] Run tests and ensure they pass
- [ ] Check test coverage
- [ ] Review assertions for completeness
- [ ] Ensure tests are independent
- [ ] Add documentation if test is complex

---

## 🎯 Testing Examples

### Example 1: Testing Success Case
```go
func TestAuthUseCase_Login_Success(t *testing.T) {
    // Setup
    mockRepo := mocks.NewMockUserRepository()
    authUC := usecases.NewAuthUseCase(mockRepo)

    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
    testUser := &domain.User{
        ID:           1,
        Email:        "test@example.com",
        PasswordHash: string(hashedPassword),
        IsActive:     true,
    }
    mockRepo.Users[testUser.Email] = testUser

    // Execute
    response, err := authUC.Login("test@example.com", "password123")

    // Verify
    if err != nil {
        t.Fatalf("Expected no error, got: %v", err)
    }
    if response.AccessToken == "" {
        t.Error("Expected access token")
    }
}
```

### Example 2: Testing Error Case
```go
func TestAuthUseCase_Login_InvalidPassword(t *testing.T) {
    // Setup
    mockRepo := mocks.NewMockUserRepository()
    authUC := usecases.NewAuthUseCase(mockRepo)

    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("correct"), bcrypt.DefaultCost)
    testUser := &domain.User{
        Email:        "test@example.com",
        PasswordHash: string(hashedPassword),
        IsActive:     true,
    }
    mockRepo.Users[testUser.Email] = testUser

    // Execute with wrong password
    response, err := authUC.Login("test@example.com", "wrongpassword")

    // Verify error
    if err == nil {
        t.Fatal("Expected error, got nil")
    }
    if response != nil {
        t.Error("Expected nil response on error")
    }
}
```

### Example 3: Testing with Mock Error Injection
```go
func TestCustomerUseCase_CreateCustomer_DatabaseError(t *testing.T) {
    // Setup
    customerRepo := mocks.NewMockCustomerRepository()
    customerRepo.CreateErr = errors.New("database connection failed")
    
    customerUC := usecases.NewCustomerUseCase(customerRepo, nil, nil, nil)

    req := domain.CreateCustomerRequest{
        Name:  "Test Customer",
        Email: "test@example.com",
    }

    // Execute
    customer, err := customerUC.CreateCustomer(req, 1)

    // Verify
    if err == nil {
        t.Fatal("Expected database error")
    }
    if customer != nil {
        t.Error("Expected nil customer on error")
    }
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. **Import Cycle**
```
package X imports Y imports X
```
**Solution**: Reorganize packages or use interfaces to break the cycle.

#### 2. **Test Database Lock**
```
database is locked
```
**Solution**: Use separate test databases per test or use in-memory SQLite.

#### 3. **Mock Not Implementing Interface**
```
*MockRepo does not implement Repository (missing method X)
```
**Solution**: Implement all interface methods in your mock.

---

## 📈 Best Practices Summary

### Do ✅
- Write tests first (TDD)
- Test edge cases and errors
- Use descriptive test names
- Keep tests fast and independent
- Mock external dependencies
- Aim for high coverage (>80%)
- Use table-driven tests for multiple scenarios
- Clean up resources (defer cleanup)

### Don't ❌
- Test implementation details
- Write flaky or time-dependent tests
- Ignore test failures
- Skip error case testing
- Use real databases in unit tests
- Make tests dependent on each other
- Leave commented-out test code

---

## 📚 Resources

### Go Testing Documentation
- [Official Go Testing Package](https://pkg.go.dev/testing)
- [Table-Driven Tests](https://dave.cheney.net/2019/05/07/prefer-table-driven-tests)
- [Test Fixtures](https://github.com/go-testfixtures/testfixtures)

### Tools
- **Testing**: `go test`
- **Coverage**: `go tool cover`
- **Mocking**: Manual mocks (as shown in this project)
- **Assertions**: Standard `testing` package

---

## 🎓 Examples in Project

### Current Test Files
- `tests/unit/auth_usecase_test.go` - Authentication testing
- `tests/unit/customer_usecase_test.go` - Customer operations testing
- `tests/mocks/user_repository_mock.go` - User repository mock
- `tests/mocks/customer_repository_mock.go` - Customer repository mock
- `tests/fixtures/test_data.go` - Test data fixtures
- `tests/fixtures/database.go` - Database helpers

### Running Project Tests
```bash
# Run all unit tests
cd backend
go test ./tests/unit/... -v

# Run with coverage
go test ./tests/unit/... -cover

# Generate coverage report
go test ./tests/unit/... -coverprofile=coverage.out
go tool cover -html=coverage.out
```

---

**Last Updated**: 2025-01-08  
**Version**: 1.0.0  
**Maintained By**: Development Team
