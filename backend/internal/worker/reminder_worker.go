package worker

import (
	"erp-system/internal/domain"
	"erp-system/internal/services"
	"log"
	"time"

	"gorm.io/gorm"
)

// StartReminderWorker starts a background goroutine that checks for reminders every minute
func StartReminderWorker(db *gorm.DB, notifService *services.NotificationService) {
	log.Println("⏰ Reminder Worker Started...")
	ticker := time.NewTicker(1 * time.Minute)
	go func() {
		for range ticker.C {
			processReminders(db, notifService)
		}
	}()
}

func processReminders(db *gorm.DB, notifService *services.NotificationService) {
	var activities []domain.CustomerActivity
	now := time.Now()

	// Find pending reminders due now or in the past
	err := db.Where("type = ? AND is_completed = ? AND reminder_date <= ?", "reminder", false, now).
		Preload("Customer").
		Find(&activities).Error

	if err != nil {
		log.Println("❌ Worker Error fetching reminders:", err)
		return
	}

	for _, act := range activities {
		log.Printf("🔔 Processing reminder #%d: %s for Customer: %s", act.ID, act.Description, act.Customer.Name)

		// 1. Send WhatsApp to Customer
		// Only if customer has phone and api is configured
		if act.Customer.Phone != "" {
			err := notifService.SendWhatsApp(act.Customer.Phone, "تذكير: "+act.Description)
			if err != nil {
				log.Printf("⚠️ Failed to send WhatsApp for reminder #%d: %v", act.ID, err)
			}
		}

		// 2. Create Internal Notification for Admin (UserID 1)
		notif := domain.Notification{
			UserID:  1, // TODO: Assign to the user who created the activity
			Title:   "تذكير مستحق: " + act.Customer.Name,
			Message: act.Description,
			Type:    "warning",
			IsRead:  false,
		}
		db.Create(&notif)

		// 3. Mark as Completed to avoid repeat
		db.Model(&act).Update("is_completed", true)
	}
}
