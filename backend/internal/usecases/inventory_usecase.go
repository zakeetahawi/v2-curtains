package usecases

import (
	"erp-system/internal/domain"
	"erp-system/internal/repositories"
	"errors"
)

type InventoryUseCase struct {
	inventoryRepo repositories.InventoryRepository
}

func NewInventoryUseCase(repo repositories.InventoryRepository) *InventoryUseCase {
	return &InventoryUseCase{inventoryRepo: repo}
}

// Product Logic
func (uc *InventoryUseCase) CreateProduct(req *domain.CreateProductRequest) (*domain.Product, error) {
	product := &domain.Product{
		SKU:           req.SKU,
		Name:          req.Name,
		Description:   req.Description,
		CategoryID:    req.CategoryID,
		CostPrice:     req.CostPrice,
		SellingPrice:  req.SellingPrice,
		ReorderLevel:  req.ReorderLevel,
		MaxStockLevel: req.MaxStockLevel,
		StockQuantity: req.StockQuantity,
		IsActive:      true,
	}

	err := uc.inventoryRepo.CreateProduct(product)
	if err != nil {
		return nil, err
	}

	return product, nil
}

func (uc *InventoryUseCase) UpdateProduct(id uint, req *domain.UpdateProductRequest) (*domain.Product, error) {
	product, err := uc.inventoryRepo.FindProductByID(id)
	if err != nil {
		return nil, errors.New("product not found")
	}

	if req.Name != "" {
		product.Name = req.Name
	}
	if req.Description != "" {
		product.Description = req.Description
	}
	if req.CategoryID > 0 {
		product.CategoryID = req.CategoryID
	}
	if req.CostPrice > 0 {
		product.CostPrice = req.CostPrice
	}
	if req.SellingPrice > 0 {
		product.SellingPrice = req.SellingPrice
	}
	if req.ReorderLevel > 0 {
		product.ReorderLevel = req.ReorderLevel
	}
	if req.MaxStockLevel > 0 {
		product.MaxStockLevel = req.MaxStockLevel
	}
	if req.StockQuantity != nil {
		product.StockQuantity = *req.StockQuantity
	}
	if req.IsActive != nil {
		product.IsActive = *req.IsActive
	}

	err = uc.inventoryRepo.UpdateProduct(product)
	if err != nil {
		return nil, err
	}

	return product, nil
}

func (uc *InventoryUseCase) DeleteProduct(id uint) error {
	return uc.inventoryRepo.DeleteProduct(id)
}

func (uc *InventoryUseCase) GetProduct(id uint) (*domain.Product, error) {
	return uc.inventoryRepo.FindProductByID(id)
}

func (uc *InventoryUseCase) GetProducts(page, limit int, search string, categoryID uint) ([]domain.Product, int64, error) {
	return uc.inventoryRepo.FindAllProducts(page, limit, search, categoryID)
}

// Category Logic
func (uc *InventoryUseCase) CreateCategory(name, description string) (*domain.Category, error) {
	category := &domain.Category{
		Name:        name,
		Description: description,
	}
	err := uc.inventoryRepo.CreateCategory(category)
	return category, err
}

func (uc *InventoryUseCase) GetCategories() ([]domain.Category, error) {
	return uc.inventoryRepo.FindAllCategories()
}
