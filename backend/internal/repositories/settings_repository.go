package repositories

import (
	"erp-system/internal/domain"

	"gorm.io/gorm"
)

type SettingsRepository interface {
	Get(key string) (*domain.SystemSetting, error)
	Set(key, value, group string) error
	GetAll() ([]domain.SystemSetting, error)
}

type settingsRepository struct {
	db *gorm.DB
}

func NewSettingsRepository(db *gorm.DB) SettingsRepository {
	return &settingsRepository{db: db}
}

func (r *settingsRepository) Get(key string) (*domain.SystemSetting, error) {
	var setting domain.SystemSetting
	err := r.db.Where("key = ?", key).First(&setting).Error
	return &setting, err
}

func (r *settingsRepository) Set(key, value, group string) error {
	var setting domain.SystemSetting
	err := r.db.Where("key = ?", key).First(&setting).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// Create new
			newSetting := domain.SystemSetting{
				Key:   key,
				Value: value,
				Group: group,
			}
			return r.db.Create(&newSetting).Error
		}
		return err
	}

	// Update existing
	setting.Value = value
	if group != "" {
		setting.Group = group
	}
	return r.db.Save(&setting).Error
}

func (r *settingsRepository) GetAll() ([]domain.SystemSetting, error) {
	var settings []domain.SystemSetting
	err := r.db.Find(&settings).Error
	return settings, err
}
