package usecases

import (
	"erp-system/internal/domain"
	"erp-system/internal/repositories"
)

type ProductionUseCase struct {
	productionRepo repositories.ProductionRepository
}

func NewProductionUseCase(repo repositories.ProductionRepository) *ProductionUseCase {
	return &ProductionUseCase{productionRepo: repo}
}

func (uc *ProductionUseCase) CreateOrder(req *domain.CreateProductionOrderRequest, userID uint) (*domain.ProductionOrder, error) {
	orderNumber, err := uc.productionRepo.GenerateOrderNumber()
	if err != nil {
		return nil, err
	}

	order := &domain.ProductionOrder{
		OrderNumber: orderNumber,
		ProductID:   req.ProductID,
		Quantity:    req.Quantity,
		StartDate:   req.StartDate,
		Status:      "planned",
		Notes:       req.Notes,
		CreatedBy:   userID,
	}

	err = uc.productionRepo.CreateOrder(order)
	if err != nil {
		return nil, err
	}

	return order, nil
}

func (uc *ProductionUseCase) GetOrders(page, limit int, status string) ([]domain.ProductionOrder, int64, error) {
	return uc.productionRepo.FindAllOrders(page, limit, status)
}

func (uc *ProductionUseCase) GetOrder(id uint) (*domain.ProductionOrder, error) {
	return uc.productionRepo.FindOrderByID(id)
}

func (uc *ProductionUseCase) GetBOM(productID uint) ([]domain.BillOfMaterials, error) {
	return uc.productionRepo.FindBOMByProductID(productID)
}
