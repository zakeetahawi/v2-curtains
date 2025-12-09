package usecases

import (
	"erp-system/internal/domain"
	"erp-system/internal/repositories"
)

type DashboardUsecase interface {
	GetDashboardStats(filters *domain.DashboardFilters) (*domain.DashboardStats, error)
}

type dashboardUsecase struct {
	dashboardRepo repositories.DashboardRepository
}

func NewDashboardUsecase(dashboardRepo repositories.DashboardRepository) DashboardUsecase {
	return &dashboardUsecase{
		dashboardRepo: dashboardRepo,
	}
}

func (u *dashboardUsecase) GetDashboardStats(filters *domain.DashboardFilters) (*domain.DashboardStats, error) {
	return u.dashboardRepo.GetDashboardStats(filters)
}
