-- Migration: Add Performance Indexes
-- Date: 2025-12-09
-- Purpose: Week 3 - Performance Optimization - Database Indexes
-- Expected Improvement: 50-70% faster query performance

-- ============================================================================
-- CUSTOMERS TABLE INDEXES
-- ============================================================================

-- Index for filtering by status (very common query)
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);

-- Index for filtering by type
CREATE INDEX IF NOT EXISTS idx_customers_type ON customers(type);

-- Composite index for active customers (most common filter)
CREATE INDEX IF NOT EXISTS idx_customers_status_deleted ON customers(status, deleted_at);

-- Index for governorate filtering (location-based queries)
CREATE INDEX IF NOT EXISTS idx_customers_governorate ON customers(governorate);

-- Index for city filtering
CREATE INDEX IF NOT EXISTS idx_customers_city ON customers(city);

-- Composite index for location queries
CREATE INDEX IF NOT EXISTS idx_customers_location ON customers(governorate, city);

-- Index for created_by (audit queries)
CREATE INDEX IF NOT EXISTS idx_customers_created_by ON customers(created_by);

-- Index for created_at (date range queries)
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);

-- ============================================================================
-- SALES_ORDERS TABLE INDEXES
-- ============================================================================

-- Index for order status filtering (very common)
CREATE INDEX IF NOT EXISTS idx_sales_orders_status ON sales_orders(status);

-- Composite index for customer orders by date
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer_date ON sales_orders(customer_id, order_date);

-- Composite index for customer orders by status
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer_status ON sales_orders(customer_id, status);

-- Index for order date range queries
CREATE INDEX IF NOT EXISTS idx_sales_orders_order_date ON sales_orders(order_date);

-- Index for delivery date filtering
CREATE INDEX IF NOT EXISTS idx_sales_orders_delivery_date ON sales_orders(delivery_date);

-- Index for created_by (audit queries)
CREATE INDEX IF NOT EXISTS idx_sales_orders_created_by ON sales_orders(created_by);

-- Composite index for date range and status
CREATE INDEX IF NOT EXISTS idx_sales_orders_date_status ON sales_orders(order_date, status, deleted_at);

-- ============================================================================
-- SALES_ORDER_ITEMS TABLE INDEXES
-- ============================================================================

-- Index for order_id (JOIN queries)
CREATE INDEX IF NOT EXISTS idx_sales_order_items_order_id ON sales_order_items(order_id);

-- Index for product_id
CREATE INDEX IF NOT EXISTS idx_sales_order_items_product_id ON sales_order_items(product_id);

-- Composite index for order items query
CREATE INDEX IF NOT EXISTS idx_sales_order_items_order_product ON sales_order_items(order_id, product_id);

-- ============================================================================
-- PRODUCTS TABLE INDEXES
-- ============================================================================

-- Index for category_id (filtering by category)
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Index for is_active status
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Composite index for active products by category
CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(category_id, is_active, deleted_at);

-- Index for low stock alerts
CREATE INDEX IF NOT EXISTS idx_products_reorder_level ON products(reorder_level);

-- Index for unit_id
CREATE INDEX IF NOT EXISTS idx_products_unit_id ON products(unit_id);

-- ============================================================================
-- CUSTOMER_ACTIVITIES TABLE INDEXES
-- ============================================================================

-- Index for activity type filtering (column name is 'type')
CREATE INDEX IF NOT EXISTS idx_activities_type ON customer_activities(type);

-- Composite index for customer activities by type
CREATE INDEX IF NOT EXISTS idx_activities_customer_type ON customer_activities(customer_id, type);

-- Index for reminder_date (reminder queries)
CREATE INDEX IF NOT EXISTS idx_activities_reminder_date ON customer_activities(reminder_date);

-- Index for created_by
CREATE INDEX IF NOT EXISTS idx_activities_created_by ON customer_activities(created_by);

-- Index for created_at (date range queries)
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON customer_activities(created_at);

-- Composite index for customer activities by date
CREATE INDEX IF NOT EXISTS idx_activities_customer_date ON customer_activities(customer_id, created_at);

-- ============================================================================
-- CUSTOMER_DOCUMENTS TABLE INDEXES
-- ============================================================================

-- Index for customer_id (JOIN queries)
CREATE INDEX IF NOT EXISTS idx_documents_customer_id ON customer_documents(customer_id);

-- Index for file_type
CREATE INDEX IF NOT EXISTS idx_documents_file_type ON customer_documents(file_type);

-- Composite index for customer documents by type
CREATE INDEX IF NOT EXISTS idx_documents_customer_file_type ON customer_documents(customer_id, file_type);

-- Index for uploaded_at
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON customer_documents(uploaded_at);

-- ============================================================================
-- PRODUCTION_ORDERS TABLE INDEXES
-- ============================================================================

-- Index for product_id
CREATE INDEX IF NOT EXISTS idx_production_orders_product_id ON production_orders(product_id);

-- Index for status
CREATE INDEX IF NOT EXISTS idx_production_orders_status ON production_orders(status);

-- Composite index for product orders by status
CREATE INDEX IF NOT EXISTS idx_production_orders_product_status ON production_orders(product_id, status);

-- Index for start_date
CREATE INDEX IF NOT EXISTS idx_production_orders_start_date ON production_orders(start_date);

-- Index for end_date
CREATE INDEX IF NOT EXISTS idx_production_orders_end_date ON production_orders(end_date);

-- Index for created_by
CREATE INDEX IF NOT EXISTS idx_production_orders_created_by ON production_orders(created_by);

-- Composite index for date range queries
CREATE INDEX IF NOT EXISTS idx_production_orders_dates ON production_orders(start_date, end_date, status);

-- ============================================================================
-- PRODUCTION_BATCHES TABLE INDEXES
-- ============================================================================

-- Index for production_order_id
CREATE INDEX IF NOT EXISTS idx_production_batches_order_id ON production_batches(production_order_id);

-- Index for status
CREATE INDEX IF NOT EXISTS idx_production_batches_status ON production_batches(status);

-- Index for batch_number
CREATE INDEX IF NOT EXISTS idx_production_batches_batch_number ON production_batches(batch_number);

-- ============================================================================
-- BILL_OF_MATERIALS TABLE INDEXES
-- ============================================================================

-- Index for product_id
CREATE INDEX IF NOT EXISTS idx_bom_product_id ON bill_of_materials(product_id);

-- Index for component_id
CREATE INDEX IF NOT EXISTS idx_bom_component_id ON bill_of_materials(component_id);

-- Composite index for BOM queries
CREATE INDEX IF NOT EXISTS idx_bom_product_component ON bill_of_materials(product_id, component_id);

-- ============================================================================
-- CATEGORIES TABLE INDEXES
-- ============================================================================

-- Index for parent_id (hierarchical queries)
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- ============================================================================
-- WAREHOUSES TABLE INDEXES
-- ============================================================================

-- Index for manager_id
CREATE INDEX IF NOT EXISTS idx_warehouses_manager_id ON warehouses(manager_id);

-- Index for is_active
CREATE INDEX IF NOT EXISTS idx_warehouses_is_active ON warehouses(is_active);

-- Index for code
CREATE INDEX IF NOT EXISTS idx_warehouses_code ON warehouses(code);

-- ============================================================================
-- USERS TABLE INDEXES
-- ============================================================================

-- Index for role_id (permission checks)
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);

-- Index for is_active (authentication)
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Composite index for active users by role
CREATE INDEX IF NOT EXISTS idx_users_role_active ON users(role_id, is_active, deleted_at);

-- Index for last_login_at (activity tracking)
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_at);

-- ============================================================================
-- AUDIT_LOGS TABLE INDEXES
-- ============================================================================

-- Index for user_id (user activity queries)
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Index for action (filtering by action type)
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Index for created_at (date range queries)
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Composite index for user activity by date
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_date ON audit_logs(user_id, created_at);

-- Index for IP address (security queries)
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip ON audit_logs(ip_address);

-- ============================================================================
-- LOGIN_ATTEMPTS TABLE INDEXES
-- ============================================================================

-- Index for email (lockout checks)
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);

-- Index for successful attempts (column name is 'success')
CREATE INDEX IF NOT EXISTS idx_login_attempts_success ON login_attempts(success);

-- Composite index for failed login checks
CREATE INDEX IF NOT EXISTS idx_login_attempts_email_time ON login_attempts(email, attempted_at);

-- Index for IP address (security)
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);

-- ============================================================================
-- ACCOUNT_LOCKOUTS TABLE INDEXES
-- ============================================================================

-- Index for user_id (lockout checks)
CREATE INDEX IF NOT EXISTS idx_account_lockouts_user_id ON account_lockouts(user_id);

-- Index for email (lockout checks by email)
CREATE INDEX IF NOT EXISTS idx_account_lockouts_email ON account_lockouts(email);

-- Index for unlocked_at (active lockout checks)
CREATE INDEX IF NOT EXISTS idx_account_lockouts_unlocked_at ON account_lockouts(unlocked_at);

-- Composite index for active lockouts
CREATE INDEX IF NOT EXISTS idx_account_lockouts_user_unlocked ON account_lockouts(user_id, unlocked_at);

-- Index for is_active
CREATE INDEX IF NOT EXISTS idx_account_lockouts_is_active ON account_lockouts(is_active);

-- ============================================================================
-- REFRESH_TOKENS TABLE INDEXES
-- ============================================================================

-- Index for user_id (user sessions)
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);

-- Index for revoked status (active tokens)
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_revoked ON refresh_tokens(revoked);

-- Index for expires_at (cleanup queries)
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Composite index for active user tokens
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_active ON refresh_tokens(user_id, revoked, expires_at);

-- Index for replaced_by (token chain tracking)
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_replaced_by ON refresh_tokens(replaced_by);

-- ============================================================================
-- NOTIFICATIONS TABLE INDEXES
-- ============================================================================

-- Index for user_id (user notifications)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Index for is_read (unread notifications)
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Composite index for unread user notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);

-- Index for created_at (recent notifications)
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Index for notification type
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- ============================================================================
-- SYSTEM_SETTINGS TABLE INDEXES
-- ============================================================================

-- Index for setting_key (lookup queries) - column name is 'key'
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);

-- Index for group (settings by group) - column name is 'group'
CREATE INDEX IF NOT EXISTS idx_system_settings_group ON system_settings(`group`);

-- ============================================================================
-- SUMMARY
-- ============================================================================

-- Total indexes added: 80+ indexes
-- Expected performance improvement: 50-70% faster queries
-- Disk space impact: ~5-10MB additional space
-- Maintenance: Automatic by SQLite

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- To verify indexes were created:
-- SELECT name, tbl_name FROM sqlite_master WHERE type='index' ORDER BY tbl_name, name;

-- To check index usage:
-- EXPLAIN QUERY PLAN SELECT ... ;

-- To analyze database size:
-- SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();
