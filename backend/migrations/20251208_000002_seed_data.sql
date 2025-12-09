-- Migration: Seed Data for ERP System
-- Version: 1.0.0
-- Date: 2025-12-08
-- Description: Seeds default data for roles, users, and settings

-- ============================================
-- DEFAULT ROLES
-- ============================================

INSERT OR IGNORE INTO roles (id, name, description, permissions) VALUES
(1, 'Admin', 'System Administrator', '{"all": true, "read": true, "write": true, "update": true, "delete": true}'),
(2, 'Manager', 'Manager', '{"read": true, "write": true, "update": true, "delete": false}'),
(3, 'User', 'Regular User', '{"read": true, "write": true, "update": false, "delete": false}'),
(4, 'Guest', 'Guest User', '{"read": true, "write": false, "update": false, "delete": false}');

-- ============================================
-- DEFAULT ADMIN USER
-- ============================================
-- Username: admin
-- Email: admin@erp.local
-- Password: admin123
-- Password Hash: $2a$12$KzGDw2oh9ylo00.nvPgw7.HuYL4wIjoxfPK0jTgyb7d7QQprTpQm6

INSERT OR IGNORE INTO users (id, username, email, password_hash, role_id, is_active) VALUES
(1, 'admin', 'admin@erp.local', '$2a$12$KzGDw2oh9ylo00.nvPgw7.HuYL4wIjoxfPK0jTgyb7d7QQprTpQm6', 1, 1);

-- ============================================
-- SYSTEM SETTINGS
-- ============================================

INSERT OR IGNORE INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('company_name', 'ERP System', 'string', 'Company Name'),
('company_email', 'info@erp.local', 'string', 'Company Email'),
('company_phone', '+20 123 456 7890', 'string', 'Company Phone'),
('company_address', 'Cairo, Egypt', 'string', 'Company Address'),
('currency', 'EGP', 'string', 'Default Currency'),
('language', 'ar', 'string', 'Default Language (ar/en)'),
('timezone', 'Africa/Cairo', 'string', 'Default Timezone'),
('tax_rate', '14', 'number', 'Default Tax Rate (%)'),
('date_format', 'YYYY-MM-DD', 'string', 'Date Format'),
('time_format', '24h', 'string', 'Time Format'),
('stock_reminder_enabled', 'true', 'boolean', 'Enable Low Stock Reminders'),
('stock_reminder_threshold', '10', 'number', 'Low Stock Threshold'),
('payment_reminder_days', '7', 'number', 'Payment Reminder Days Before Due'),
('backup_enabled', 'true', 'boolean', 'Enable Automatic Backups'),
('backup_frequency', 'daily', 'string', 'Backup Frequency (daily/weekly/monthly)');

-- ============================================
-- DEFAULT CATEGORIES
-- ============================================

INSERT OR IGNORE INTO categories (name, description) VALUES
('Raw Materials', 'Raw materials for production'),
('Finished Products', 'Finished products ready for sale'),
('Components', 'Components and parts'),
('Supplies', 'Office and factory supplies'),
('Services', 'Service items');

-- ============================================
-- DEFAULT WAREHOUSE
-- ============================================

INSERT OR IGNORE INTO warehouses (code, name, address, is_active) VALUES
('WH-MAIN', 'Main Warehouse', 'Cairo, Egypt', 1);
