package usecases

import (
	"erp-system/internal/domain"
	"erp-system/internal/repositories"
	"erp-system/internal/services"
)

type CustomerUseCase struct {
	customerRepo repositories.CustomerRepository
	activityRepo repositories.CustomerActivityRepository
	docRepo      repositories.CustomerDocumentRepository
	notifService *services.NotificationService
}

// NewCustomerUseCase creates a new customer use case
func NewCustomerUseCase(cr repositories.CustomerRepository, car repositories.CustomerActivityRepository, cdr repositories.CustomerDocumentRepository, ns *services.NotificationService) *CustomerUseCase {
	return &CustomerUseCase{
		customerRepo: cr,
		activityRepo: car,
		docRepo:      cdr,
		notifService: ns,
	}
}

// CreateCustomer creates a new customer
func (uc *CustomerUseCase) CreateCustomer(req domain.CreateCustomerRequest, userID uint) (*domain.Customer, error) {
	// Generate code
	code, _ := uc.customerRepo.GenerateCode()

	customer := &domain.Customer{
		Code:              code,
		Name:              req.Name,
		Email:             req.Email,
		Phone:             req.Phone,
		Mobile:            req.Mobile,
		Address:           req.Address,
		City:              req.City,
		Governorate:       req.Governorate,
		Country:           req.Country,
		PostalCode:        req.PostalCode,
		TaxNumber:         req.TaxNumber,
		CreditLimit:       req.CreditLimit,
		Type:              req.Type,
		Status:            "active",
		IsWhatsAppEnabled: req.IsWhatsAppEnabled, // New Field
		CreatedBy:         userID,
	}

	if customer.Type == "" {
		customer.Type = "regular"
	}

	if err := uc.customerRepo.Create(customer); err != nil {
		return nil, err
	}

	return customer, nil
}

// GetCustomer retrieves a customer by ID
func (uc *CustomerUseCase) GetCustomer(id uint) (*domain.Customer, error) {
	return uc.customerRepo.FindByID(id)
}

// GetAllCustomers retrieves all customers
func (uc *CustomerUseCase) GetAllCustomers(page, limit int, search string) ([]domain.Customer, int64, error) {
	return uc.customerRepo.FindAll(page, limit, search)
}

// GetCustomers is an alias for GetAllCustomers for backward compatibility
func (uc *CustomerUseCase) GetCustomers(page, limit int, search string) ([]domain.Customer, int64, error) {
	return uc.GetAllCustomers(page, limit, search)
}

// UpdateCustomer updates an existing customer
func (uc *CustomerUseCase) UpdateCustomer(id uint, req domain.UpdateCustomerRequest) error {
	existing, err := uc.customerRepo.FindByID(id)
	if err != nil {
		return err
	}

	existing.Name = req.Name
	existing.Email = req.Email
	existing.Phone = req.Phone
	existing.Mobile = req.Mobile
	existing.Address = req.Address
	existing.City = req.City
	existing.Governorate = req.Governorate
	existing.Country = req.Country
	existing.PostalCode = req.PostalCode
	existing.TaxNumber = req.TaxNumber
	existing.CreditLimit = req.CreditLimit
	existing.Type = req.Type
	existing.Status = req.Status
	existing.IsWhatsAppEnabled = req.IsWhatsAppEnabled // New Field

	// Update Balance if needed (business logic for balance shouldn't be here usually)
	// But let's assume balance is managed via transactions

	return uc.customerRepo.Update(existing)
}

// DeleteCustomer soft deletes a customer
func (uc *CustomerUseCase) DeleteCustomer(id uint) error {
	return uc.customerRepo.Delete(id)
}

// AddActivity adds a note, call, or meeting log
func (uc *CustomerUseCase) AddActivity(customerID uint, activityType, description string, userID uint) error {
	activity := &domain.CustomerActivity{
		CustomerID:  customerID,
		Type:        activityType,
		Description: description,
		CreatedBy:   userID,
	}

	if err := uc.activityRepo.Create(activity); err != nil {
		return err
	}

	// Trigger Notification if type is 'alert'
	if activityType == "alert" {
		// 1. Get Customer to get phone & preferences
		customer, err := uc.customerRepo.FindByID(customerID)
		if err == nil && customer.Phone != "" && customer.IsWhatsAppEnabled {
			// 2. Send WhatsApp (Async to not block)
			go func() {
				// TODO: Check System Global Setting here too ideally, but for now PER CUSTOMER control is implemented
				_ = uc.notifService.SendWhatsApp(customer.Phone, description) // Raw message for now, will template later
			}()
		}
	}

	return nil
}

// GetActivities retrieves all activities for a customer
func (uc *CustomerUseCase) GetActivities(customerID uint) ([]domain.CustomerActivity, error) {
	return uc.activityRepo.FindByCustomerID(customerID)
}

// AddDocument saves a document record
func (uc *CustomerUseCase) AddDocument(customerID uint, title, path, fileType string) error {
	doc := &domain.CustomerDocument{
		CustomerID: customerID,
		Title:      title,
		FilePath:   path,
		FileType:   fileType,
	}
	return uc.docRepo.Create(doc)
}

// GetDocuments retrieves all documents for a customer
func (uc *CustomerUseCase) GetDocuments(customerID uint) ([]domain.CustomerDocument, error) {
	return uc.docRepo.FindByCustomerID(customerID)
}

// ToggleActivityNotification enables/disables notification for an activity
func (uc *CustomerUseCase) ToggleActivityNotification(activityID uint, enabled bool) error {
	activity, err := uc.activityRepo.FindByID(activityID)
	if err != nil {
		return err
	}

	activity.NotificationEnabled = enabled
	return uc.activityRepo.Update(activity)
}
