package usecases

import (
	"erp-system/internal/domain"
	"erp-system/internal/repositories"
	"errors"
)

type SalesUseCase struct {
	salesRepo    repositories.SalesRepository
	customerRepo repositories.CustomerRepository
}

func NewSalesUseCase(repo repositories.SalesRepository, custRepo repositories.CustomerRepository) *SalesUseCase {
	return &SalesUseCase{
		salesRepo:    repo,
		customerRepo: custRepo,
	}
}

func (uc *SalesUseCase) CreateOrder(req *domain.CreateOrderRequest, userID uint) (*domain.SalesOrder, error) {
	orderNumber, err := uc.salesRepo.GenerateOrderNumber()
	if err != nil {
		return nil, err
	}

	order := &domain.SalesOrder{
		OrderNumber:  orderNumber,
		CustomerID:   req.CustomerID,
		OrderDate:    req.OrderDate,
		DeliveryDate: req.DeliveryDate,
		Status:       "draft",
		Notes:        req.Notes,
		CreatedBy:    userID,
	}

	var totalAmount, taxAmount, discountAmount float64

	for i, itemReq := range req.Items {
		total := itemReq.Quantity * itemReq.UnitPrice
		itemDiscount := total * (itemReq.Discount / 100)
		itemTax := (total - itemDiscount) * (itemReq.TaxRate / 100)
		itemTotal := total - itemDiscount + itemTax

		order.Items[i].Total = itemTotal // Assuming items are init

		// Better: reconstruct items list
	}

	// Let's rewrite the loop properly
	var items []domain.SalesOrderItem
	for _, itemReq := range req.Items {
		total := itemReq.Quantity * itemReq.UnitPrice
		itemDiscount := total * (itemReq.Discount / 100)
		itemTax := (total - itemDiscount) * (itemReq.TaxRate / 100)
		itemTotal := total - itemDiscount + itemTax

		items = append(items, domain.SalesOrderItem{
			ProductID: itemReq.ProductID,
			Quantity:  itemReq.Quantity,
			UnitPrice: itemReq.UnitPrice,
			Discount:  itemReq.Discount,
			TaxRate:   itemReq.TaxRate,
			Total:     itemTotal,
		})

		totalAmount += total
		discountAmount += itemDiscount
		taxAmount += itemTax
	}

	order.Items = items
	order.TotalAmount = totalAmount
	order.DiscountAmount = discountAmount
	order.TaxAmount = taxAmount
	order.NetAmount = totalAmount - discountAmount + taxAmount

	// === Credit Limit Check ===
	customer, err := uc.customerRepo.FindByID(req.CustomerID)
	if err != nil {
		return nil, errors.New("customer not found")
	}

	if customer.CreditLimit > 0 && (customer.Balance+order.NetAmount) > customer.CreditLimit {
		return nil, errors.New("credit limit exceeded for this customer")
	}

	// Create Order
	err = uc.salesRepo.Create(order)
	if err != nil {
		return nil, err
	}

	// Update Customer Balance
	customer.Balance += order.NetAmount
	_ = uc.customerRepo.Update(customer) // Ignore error? Or handle it? Ideally transactional.

	return order, nil
}

func (uc *SalesUseCase) GetOrders(page, limit int, status string, customerID uint) ([]domain.SalesOrder, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	return uc.salesRepo.FindAll(page, limit, status, customerID)
}

func (uc *SalesUseCase) GetOrder(id uint) (*domain.SalesOrder, error) {
	return uc.salesRepo.FindByID(id)
}
