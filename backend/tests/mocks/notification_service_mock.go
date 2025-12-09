package mocks

import (
	"erp-system/internal/domain"
)

// MockNotificationService is a mock implementation of NotificationService for testing
type MockNotificationService struct {
	SentNotifications []MockNotification
	SendErr           error
}

type MockNotification struct {
	CustomerID uint
	Message    string
	Type       string
	Method     string // "whatsapp" or "internal"
}

// NewMockNotificationService creates a new mock notification service
func NewMockNotificationService() *MockNotificationService {
	return &MockNotificationService{
		SentNotifications: make([]MockNotification, 0),
	}
}

// SendWhatsAppMessage mocks sending a WhatsApp message
func (m *MockNotificationService) SendWhatsAppMessage(customer *domain.Customer, message string) error {
	if m.SendErr != nil {
		return m.SendErr
	}

	m.SentNotifications = append(m.SentNotifications, MockNotification{
		CustomerID: customer.ID,
		Message:    message,
		Type:       "reminder",
		Method:     "whatsapp",
	})

	return nil
}

// CreateInternalNotification mocks creating an internal notification
func (m *MockNotificationService) CreateInternalNotification(customerID uint, message, notifType string) error {
	if m.SendErr != nil {
		return m.SendErr
	}

	m.SentNotifications = append(m.SentNotifications, MockNotification{
		CustomerID: customerID,
		Message:    message,
		Type:       notifType,
		Method:     "internal",
	})

	return nil
}

// GetNotificationCount returns the count of sent notifications
func (m *MockNotificationService) GetNotificationCount() int {
	return len(m.SentNotifications)
}

// GetNotificationsForCustomer returns notifications sent to a specific customer
func (m *MockNotificationService) GetNotificationsForCustomer(customerID uint) []MockNotification {
	notifications := make([]MockNotification, 0)
	for _, notif := range m.SentNotifications {
		if notif.CustomerID == customerID {
			notifications = append(notifications, notif)
		}
	}
	return notifications
}

// Clear clears all sent notifications
func (m *MockNotificationService) Clear() {
	m.SentNotifications = make([]MockNotification, 0)
}
