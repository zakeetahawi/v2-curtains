package usecases

import (
	"erp-system/internal/domain"
	"erp-system/internal/repositories"
)

type SettingsUseCase struct {
	repo repositories.SettingsRepository
}

func NewSettingsUseCase(repo repositories.SettingsRepository) *SettingsUseCase {
	return &SettingsUseCase{repo: repo}
}

func (uc *SettingsUseCase) UpdateSettings(settings map[string]string) error {
	for key, value := range settings {
		// Determine group based on key prefix or list
		group := "general"
		if key == domain.SettingWhatsAppURL || key == domain.SettingWhatsAppToken {
			group = "integration"
		}

		err := uc.repo.Set(key, value, group)
		if err != nil {
			return err
		}
	}
	return nil
}

func (uc *SettingsUseCase) GetSettings() (map[string]string, error) {
	settingsList, err := uc.repo.GetAll()
	if err != nil {
		return nil, err
	}

	result := make(map[string]string)
	for _, s := range settingsList {
		result[s.Key] = s.Value
	}
	return result, nil
}
