// User Types
export interface User {
    id: number;
    username: string;
    email: string;
    role: {
        id: number;
        name: string;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    data?: {
        user: User;
        access_token: string;
    };
}

// Customer Types
export interface Customer {
    id: number;
    code: string;
    name: string;
    email?: string;
    phone?: string;
    mobile?: string;
    address?: string;
    city?: string;
    governorate?: string;
    country?: string;
    postal_code?: string;
    tax_number?: string;
    credit_limit: number;
    balance: number;
    type: 'regular' | 'vip' | 'wholesale';
    status: 'active' | 'inactive';
    is_whatsapp_enabled: boolean;
    created_at: string;
    updated_at: string;
}

export interface CustomerActivity {
    id: number;
    customer_id: number;
    type: 'note' | 'call' | 'meeting' | 'alert' | 'reminder';
    description: string;
    reminder_date?: string;
    is_completed: boolean;
    created_by: number;
    created_at: string;
}

export interface CustomerDocument {
    id: number;
    customer_id: number;
    title: string;
    file_path: string;
    file_type: string;
    uploaded_at: string;
}

// Sales Types
export interface SalesOrder {
    id: number;
    customer_id: number;
    customer?: Customer;
    order_date: string;
    total_amount: number;
    status: 'pending' | 'completed' | 'cancelled';
    items: SalesOrderItem[];
    created_at: string;
}

export interface SalesOrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product?: Product;
    quantity: number;
    unit_price: number;
    total: number;
}

// Inventory/Product Types
export interface Product {
    id: number;
    sku: string;
    name: string;
    description?: string;
    category_id: number;
    category?: Category;
    cost_price: number;
    selling_price: number;
    stock_quantity: number;
    min_stock_level: number;
    status: 'active' | 'inactive';
    created_at: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
}

// Production Types
export interface ProductionOrder {
    id: number;
    product_id: number;
    product?: Product;
    quantity: number;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    start_date: string;
    end_date?: string;
    created_at: string;
}

// Notification Types
export interface Notification {
    ID: number;
    UserID: number;
    Title: string;
    Message: string;
    Type: 'info' | 'warning' | 'success' | 'error';
    IsRead: boolean;
    CreatedAt: string;
}

// Settings Types
export interface SystemSettings {
    company_name?: string;
    company_logo?: string;
    currency?: string;
    whatsapp_api_url?: string;
    whatsapp_api_token?: string;
    whatsapp_sender?: string;
}

// Branch Types
export interface Branch {
    id: number;
    code: string;
    name: string;
    name_en?: string;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
    is_main: boolean;
    is_active: boolean;
    manager_id?: number;
    created_at: string;
    updated_at: string;
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    total?: number;
}

// Pagination
export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
}
