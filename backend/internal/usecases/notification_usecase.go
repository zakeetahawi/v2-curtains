package usecases

import (
	"erp-system/internal/domain"
	"erp-system/internal/repositories"
)

type NotificationUseCase struct {
	repo repositories.NotificationRepository
}

func NewNotificationUseCase(repo repositories.NotificationRepository) *NotificationUseCase {
	return &NotificationUseCase{repo: repo}
}

func (uc *NotificationUseCase) CreateNotification(userID uint, title, message, notifType string) error {
	notification := &domain.Notification{
		UserID:  userID,
		Title:   title,
		Message: message,
		Type:    notifType, // e.g., "info", "warning", "success"
		IsRead:  false,
	}
	return uc.repo.Create(notification)
}

func (uc *NotificationUseCase) GetUnread(userID uint) ([]domain.Notification, error) {
	return uc.repo.GetUnreadByUserID(userID)
}

func (uc *NotificationUseCase) MarkAsRead(id uint) error {
	return uc.repo.MarkAsRead(id)
}
