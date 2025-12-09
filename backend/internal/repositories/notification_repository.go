package repositories

import (
	"erp-system/internal/domain"

	"gorm.io/gorm"
)

type NotificationRepository interface {
	Create(notification *domain.Notification) error
	GetUnreadByUserID(userID uint) ([]domain.Notification, error)
	MarkAsRead(id uint) error
}

type notificationRepository struct {
	db *gorm.DB
}

func NewNotificationRepository(db *gorm.DB) NotificationRepository {
	return &notificationRepository{db: db}
}

func (r *notificationRepository) Create(notification *domain.Notification) error {
	return r.db.Create(notification).Error
}

func (r *notificationRepository) GetUnreadByUserID(userID uint) ([]domain.Notification, error) {
	var notifications []domain.Notification
	err := r.db.Where("user_id = ? AND is_read = ?", userID, false).
		Order("created_at desc").
		Find(&notifications).Error
	return notifications, err
}

func (r *notificationRepository) MarkAsRead(id uint) error {
	return r.db.Model(&domain.Notification{}).Where("id = ?", id).Update("is_read", true).Error
}
