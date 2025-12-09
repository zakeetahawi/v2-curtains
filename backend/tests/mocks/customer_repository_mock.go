package mocks

import (
	"erp-system/internal/domain"
	"errors"
	"fmt"
	"time"
)

// MockCustomerRepository is a mock implementation of CustomerRepository for testing
type MockCustomerRepository struct {
	Customers      map[uint]*domain.Customer
	NextID         uint
	GenerateCodeFn func() (string, error)
	CreateErr      error
	UpdateErr      error
	DeleteErr      error
}

// NewMockCustomerRepository creates a new mock customer repository
func NewMockCustomerRepository() *MockCustomerRepository {
	return &MockCustomerRepository{
		Customers: make(map[uint]*domain.Customer),
		NextID:    1,
		GenerateCodeFn: func() (string, error) {
			return fmt.Sprintf("CUST-%05d", time.Now().Unix()%100000), nil
		},
	}
}

// Create mocks creating a new customer
func (m *MockCustomerRepository) Create(customer *domain.Customer) error {
	if m.CreateErr != nil {
		return m.CreateErr
	}

	customer.ID = m.NextID
	m.NextID++
	customer.CreatedAt = time.Now()
	customer.UpdatedAt = time.Now()
	m.Customers[customer.ID] = customer
	return nil
}

// FindByID mocks finding a customer by ID
func (m *MockCustomerRepository) FindByID(id uint) (*domain.Customer, error) {
	customer, exists := m.Customers[id]
	if !exists {
		return nil, errors.New("customer not found")
	}
	return customer, nil
}

// FindByCode mocks finding a customer by code
func (m *MockCustomerRepository) FindByCode(code string) (*domain.Customer, error) {
	for _, customer := range m.Customers {
		if customer.Code == code {
			return customer, nil
		}
	}
	return nil, errors.New("customer not found")
}

// FindAll mocks finding all customers with pagination
func (m *MockCustomerRepository) FindAll(page, limit int, search string) ([]domain.Customer, int64, error) {
	customers := make([]domain.Customer, 0)

	for _, customer := range m.Customers {
		// Simple search filter
		if search != "" {
			if customer.Name != search && customer.Email != search && customer.Code != search {
				continue
			}
		}
		customers = append(customers, *customer)
	}

	// Simple pagination
	total := int64(len(customers))
	start := (page - 1) * limit
	end := start + limit

	if start >= len(customers) {
		return []domain.Customer{}, total, nil
	}

	if end > len(customers) {
		end = len(customers)
	}

	return customers[start:end], total, nil
}

// Update mocks updating a customer
func (m *MockCustomerRepository) Update(customer *domain.Customer) error {
	if m.UpdateErr != nil {
		return m.UpdateErr
	}

	if _, exists := m.Customers[customer.ID]; !exists {
		return errors.New("customer not found")
	}

	customer.UpdatedAt = time.Now()
	m.Customers[customer.ID] = customer
	return nil
}

// Delete mocks deleting a customer (soft delete)
func (m *MockCustomerRepository) Delete(id uint) error {
	if m.DeleteErr != nil {
		return m.DeleteErr
	}

	customer, exists := m.Customers[id]
	if !exists {
		return errors.New("customer not found")
	}

	now := time.Now()
	customer.DeletedAt = &now
	m.Customers[id] = customer
	return nil
}

// GenerateCode mocks generating a unique customer code
func (m *MockCustomerRepository) GenerateCode() (string, error) {
	if m.GenerateCodeFn != nil {
		return m.GenerateCodeFn()
	}
	return fmt.Sprintf("CUST-%05d", m.NextID), nil
}

// MockCustomerActivityRepository is a mock for customer activities
type MockCustomerActivityRepository struct {
	Activities map[uint][]domain.CustomerActivity
	NextID     uint
	CreateErr  error
}

// NewMockCustomerActivityRepository creates a new mock activity repository
func NewMockCustomerActivityRepository() *MockCustomerActivityRepository {
	return &MockCustomerActivityRepository{
		Activities: make(map[uint][]domain.CustomerActivity),
		NextID:     1,
	}
}

// Create mocks creating a new activity
func (m *MockCustomerActivityRepository) Create(activity *domain.CustomerActivity) error {
	if m.CreateErr != nil {
		return m.CreateErr
	}

	activity.ID = m.NextID
	m.NextID++
	activity.CreatedAt = time.Now()

	if _, exists := m.Activities[activity.CustomerID]; !exists {
		m.Activities[activity.CustomerID] = make([]domain.CustomerActivity, 0)
	}

	m.Activities[activity.CustomerID] = append(m.Activities[activity.CustomerID], *activity)
	return nil
}

// FindByCustomerID mocks finding activities by customer ID
func (m *MockCustomerActivityRepository) FindByCustomerID(customerID uint) ([]domain.CustomerActivity, error) {
	activities, exists := m.Activities[customerID]
	if !exists {
		return []domain.CustomerActivity{}, nil
	}
	return activities, nil
}

// Update mocks updating an activity
func (m *MockCustomerActivityRepository) Update(activity *domain.CustomerActivity) error {
	activities, exists := m.Activities[activity.CustomerID]
	if !exists {
		return errors.New("customer not found")
	}

	for i, a := range activities {
		if a.ID == activity.ID {
			activities[i] = *activity
			m.Activities[activity.CustomerID] = activities
			return nil
		}
	}

	return errors.New("activity not found")
}

// FindPendingReminders mocks finding pending reminders
func (m *MockCustomerActivityRepository) FindPendingReminders() ([]domain.CustomerActivity, error) {
	now := time.Now()
	reminders := make([]domain.CustomerActivity, 0)

	for _, customerActivities := range m.Activities {
		for _, activity := range customerActivities {
			if activity.Type == "reminder" &&
				!activity.IsCompleted &&
				activity.ReminderDate != nil &&
				activity.ReminderDate.Before(now) {
				reminders = append(reminders, activity)
			}
		}
	}

	return reminders, nil
}

// MockCustomerDocumentRepository is a mock for customer documents
type MockCustomerDocumentRepository struct {
	Documents map[uint][]domain.CustomerDocument
	NextID    uint
	CreateErr error
}

// NewMockCustomerDocumentRepository creates a new mock document repository
func NewMockCustomerDocumentRepository() *MockCustomerDocumentRepository {
	return &MockCustomerDocumentRepository{
		Documents: make(map[uint][]domain.CustomerDocument),
		NextID:    1,
	}
}

// Create mocks creating a new document
func (m *MockCustomerDocumentRepository) Create(doc *domain.CustomerDocument) error {
	if m.CreateErr != nil {
		return m.CreateErr
	}

	doc.ID = m.NextID
	m.NextID++
	doc.UploadedAt = time.Now()

	if _, exists := m.Documents[doc.CustomerID]; !exists {
		m.Documents[doc.CustomerID] = make([]domain.CustomerDocument, 0)
	}

	m.Documents[doc.CustomerID] = append(m.Documents[doc.CustomerID], *doc)
	return nil
}

// FindByCustomerID mocks finding documents by customer ID
func (m *MockCustomerDocumentRepository) FindByCustomerID(customerID uint) ([]domain.CustomerDocument, error) {
	docs, exists := m.Documents[customerID]
	if !exists {
		return []domain.CustomerDocument{}, nil
	}
	return docs, nil
}

// Delete mocks deleting a document
func (m *MockCustomerDocumentRepository) Delete(id uint) error {
	for customerID, docs := range m.Documents {
		for i, doc := range docs {
			if doc.ID == id {
				m.Documents[customerID] = append(docs[:i], docs[i+1:]...)
				return nil
			}
		}
	}
	return errors.New("document not found")
}
