package mocks

import (
	"erp-system/internal/domain"
	"errors"
)

// MockUserRepository is a mock implementation of UserRepository for testing
type MockUserRepository struct {
	Users          map[string]*domain.User // key: email
	FindByEmailErr error
	UpdateErr      error
	CreateErr      error
}

// NewMockUserRepository creates a new mock user repository
func NewMockUserRepository() *MockUserRepository {
	return &MockUserRepository{
		Users: make(map[string]*domain.User),
	}
}

// FindByEmail mocks finding a user by email
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

// FindByID mocks finding a user by ID
func (m *MockUserRepository) FindByID(id uint) (*domain.User, error) {
	for _, user := range m.Users {
		if user.ID == id {
			return user, nil
		}
	}
	return nil, errors.New("user not found")
}

// Create mocks creating a new user
func (m *MockUserRepository) Create(user *domain.User) error {
	if m.CreateErr != nil {
		return m.CreateErr
	}

	user.ID = uint(len(m.Users) + 1)
	m.Users[user.Email] = user
	return nil
}

// Update mocks updating a user
func (m *MockUserRepository) Update(user *domain.User) error {
	if m.UpdateErr != nil {
		return m.UpdateErr
	}

	if _, exists := m.Users[user.Email]; !exists {
		return errors.New("user not found")
	}

	m.Users[user.Email] = user
	return nil
}

// Delete mocks deleting a user
func (m *MockUserRepository) Delete(id uint) error {
	for email, user := range m.Users {
		if user.ID == id {
			delete(m.Users, email)
			return nil
		}
	}
	return errors.New("user not found")
}

// List mocks listing all users
func (m *MockUserRepository) List() ([]domain.User, error) {
	users := make([]domain.User, 0, len(m.Users))
	for _, user := range m.Users {
		users = append(users, *user)
	}
	return users, nil
}
