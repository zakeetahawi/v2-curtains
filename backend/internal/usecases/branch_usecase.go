package usecases

import (
	"erp-system/internal/domain"
	"erp-system/internal/repositories"
	"errors"
)

type BranchUseCase struct {
	branchRepo   repositories.BranchRepository
	customerRepo repositories.CustomerRepository
}

func NewBranchUseCase(br repositories.BranchRepository, cr repositories.CustomerRepository) *BranchUseCase {
	return &BranchUseCase{
		branchRepo:   br,
		customerRepo: cr,
	}
}

func (uc *BranchUseCase) CreateBranch(name, nameEn, address, city, phone, email string, isMain bool) (*domain.Branch, error) {
	// Check if trying to create another main branch
	if isMain {
		existing, _ := uc.branchRepo.FindMainBranch()
		if existing != nil && existing.ID > 0 {
			return nil, errors.New("main branch already exists")
		}
	}

	// Generate code
	branches, _ := uc.branchRepo.FindAll()
	code := domain.GenerateBranchCode(uint(len(branches) + 1))

	branch := &domain.Branch{
		Code:     code,
		Name:     name,
		NameEn:   nameEn,
		Address:  address,
		City:     city,
		Phone:    phone,
		Email:    email,
		IsMain:   isMain,
		IsActive: true,
	}

	err := uc.branchRepo.Create(branch)
	return branch, err
}

func (uc *BranchUseCase) GetBranch(id uint) (*domain.Branch, error) {
	return uc.branchRepo.FindByID(id)
}

func (uc *BranchUseCase) GetAllBranches() ([]domain.Branch, error) {
	return uc.branchRepo.FindAll()
}

func (uc *BranchUseCase) UpdateBranch(id uint, name, nameEn, address, city, phone, email string, isActive bool) error {
	branch, err := uc.branchRepo.FindByID(id)
	if err != nil {
		return err
	}

	branch.Name = name
	branch.NameEn = nameEn
	branch.Address = address
	branch.City = city
	branch.Phone = phone
	branch.Email = email
	branch.IsActive = isActive

	return uc.branchRepo.Update(branch)
}

func (uc *BranchUseCase) DeleteBranch(id uint) error {
	branch, err := uc.branchRepo.FindByID(id)
	if err != nil {
		return err
	}

	// Cannot delete main branch
	if branch.IsMain {
		return errors.New("cannot delete main branch")
	}

	// TODO: Check if branch has customers/orders
	// For now, just delete
	return uc.branchRepo.Delete(id)
}

func (uc *BranchUseCase) SetMainBranch(id uint) error {
	// Remove main flag from current main branch
	currentMain, err := uc.branchRepo.FindMainBranch()
	if err == nil && currentMain != nil {
		currentMain.IsMain = false
		uc.branchRepo.Update(currentMain)
	}

	// Set new main branch
	newMain, err := uc.branchRepo.FindByID(id)
	if err != nil {
		return err
	}

	newMain.IsMain = true
	return uc.branchRepo.Update(newMain)
}

func (uc *BranchUseCase) GetBranchDashboard(branchID uint) (map[string]interface{}, error) {
	branch, err := uc.branchRepo.FindByID(branchID)
	if err != nil {
		return nil, err
	}

	// TODO: Get actual statistics
	// For now, return mock data
	stats := map[string]interface{}{
		"branch_name":     branch.Name,
		"total_customers": 0,
		"total_sales":     0,
		"total_orders":    0,
		"monthly_revenue": 0,
	}

	return stats, nil
}

func (uc *BranchUseCase) EnsureMainBranchExists() error {
	mainBranch, err := uc.branchRepo.FindMainBranch()
	if err != nil || mainBranch == nil || mainBranch.ID == 0 {
		// Create default main branch
		_, err := uc.CreateBranch(
			"الفرع الرئيسي",
			"Main Branch",
			"",
			"",
			"",
			"",
			true,
		)
		return err
	}
	return nil
}
