package services

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"erp-system/internal/domain"
	"erp-system/internal/repositories"
)

type NotificationService struct {
	settingsRepo repositories.SettingsRepository
}

func NewNotificationService(sr repositories.SettingsRepository) *NotificationService {
	return &NotificationService{settingsRepo: sr}
}

// SendWhatsApp sends a message using the configured API
func (s *NotificationService) SendWhatsApp(to string, message string) error {
	// 1. Get Settings
	urlSetting, err := s.settingsRepo.Get(domain.SettingWhatsAppURL)
	if err != nil {
		return errors.New("WhatsApp API URL not configured")
	}
	tokenSetting, err := s.settingsRepo.Get(domain.SettingWhatsAppToken)
	if err != nil {
		return errors.New("WhatsApp API Token not configured")
	}

	apiURL := urlSetting.Value
	apiToken := tokenSetting.Value

	if apiURL == "" || apiToken == "" {
		return errors.New("WhatsApp configuration incomplete")
	}

	// 2. Prepare Payload (Adjust structure based on Provider, using a generic one for now)
	// Most providers use: { "phone": "...", "message": "..." } or similar
	payload := map[string]string{
		"phone":   to,
		"message": message,
	}
	jsonData, _ := json.Marshal(payload)

	// 3. Create Request
	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiToken)

	// 4. Send
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return errors.New("WhatsApp API returned error status: " + resp.Status)
	}

	return nil
}
