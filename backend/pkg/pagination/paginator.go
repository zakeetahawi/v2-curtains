package pagination

import (
	"math"

	"gorm.io/gorm"
)

// PaginationParams contains pagination parameters from request
type PaginationParams struct {
	Page     int `form:"page" binding:"min=1"`              // Current page number (starts from 1)
	PageSize int `form:"page_size" binding:"min=1,max=100"` // Items per page (max 100)
}

// PaginatedResponse contains paginated data and metadata
type PaginatedResponse struct {
	Data       interface{} `json:"data"`        // The actual data
	Page       int         `json:"page"`        // Current page
	PageSize   int         `json:"page_size"`   // Items per page
	TotalPages int         `json:"total_pages"` // Total number of pages
	TotalItems int64       `json:"total_items"` // Total number of items
	HasNext    bool        `json:"has_next"`    // Whether there's a next page
	HasPrev    bool        `json:"has_prev"`    // Whether there's a previous page
}

// DefaultPageSize is the default number of items per page
const DefaultPageSize = 25

// MaxPageSize is the maximum allowed items per page
const MaxPageSize = 100

// NewPaginationParams creates pagination params with defaults
func NewPaginationParams(page, pageSize int) *PaginationParams {
	// Set defaults
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = DefaultPageSize
	}
	if pageSize > MaxPageSize {
		pageSize = MaxPageSize
	}

	return &PaginationParams{
		Page:     page,
		PageSize: pageSize,
	}
}

// Paginate applies pagination to a GORM query
// Usage:
//
//	var customers []Customer
//	var total int64
//	db = pagination.Paginate(db, params, &total)
//	db.Find(&customers)
func Paginate(db *gorm.DB, params *PaginationParams, totalItems *int64) *gorm.DB {
	// Get total count before pagination
	db.Count(totalItems)

	// Calculate offset
	offset := (params.Page - 1) * params.PageSize

	// Apply pagination
	return db.Offset(offset).Limit(params.PageSize)
}

// CreateResponse creates a paginated response
func CreateResponse(data interface{}, params *PaginationParams, totalItems int64) *PaginatedResponse {
	totalPages := int(math.Ceil(float64(totalItems) / float64(params.PageSize)))

	return &PaginatedResponse{
		Data:       data,
		Page:       params.Page,
		PageSize:   params.PageSize,
		TotalPages: totalPages,
		TotalItems: totalItems,
		HasNext:    params.Page < totalPages,
		HasPrev:    params.Page > 1,
	}
}

// PaginateAndRespond is a helper that combines Paginate and CreateResponse
// Usage:
//
//	var customers []Customer
//	response := pagination.PaginateAndRespond(db.Model(&Customer{}), params, &customers)
func PaginateAndRespond(db *gorm.DB, params *PaginationParams, result interface{}) *PaginatedResponse {
	var totalItems int64

	// Apply pagination and get total count
	paginatedDB := Paginate(db, params, &totalItems)

	// Execute query
	paginatedDB.Find(result)

	// Create response
	return CreateResponse(result, params, totalItems)
}

// GetOffset returns the offset for the current page
func (p *PaginationParams) GetOffset() int {
	return (p.Page - 1) * p.PageSize
}

// GetLimit returns the limit (page size)
func (p *PaginationParams) GetLimit() int {
	return p.PageSize
}
