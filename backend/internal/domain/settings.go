package domain

import "time"

// SystemSetting stores global configuration like WhatsApp API keys
type SystemSetting struct {
	ID        uint      `json:"id" gorm:"primarykey"`
	Key       string    `json:"key" gorm:"uniqueIndex"` // e.g., "whatsapp_api_url"
	Value     string    `json:"value"`
	Group     string    `json:"group"` // e.g., "integration", "general"
	UpdatedAt time.Time `json:"updated_at"`
}

// Default settings keys
const (
	SettingWhatsAppURL   = "whatsapp_api_url"
	SettingWhatsAppToken = "whatsapp_api_token"
)
