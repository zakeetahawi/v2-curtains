// Export Utilities for Excel, CSV, and PDF
// Week 4 - Day 3: Advanced Export Features

import * as XLSX from 'xlsx';

/**
 * Export data to Excel with formatting
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {string} sheetName - Name of the worksheet
 * @param {Object} options - Additional options for formatting
 */
export function exportToExcel(data, filename, sheetName = 'Sheet1', options = {}) {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  try {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Auto-size columns
    const colWidths = Object.keys(data[0]).map(key => {
      const maxLength = Math.max(
        key.length,
        ...data.map(row => String(row[key] || '').length)
      );
      return { wch: Math.min(maxLength + 2, 50) }; // Max width 50 chars
    });
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate Excel file
    const timestamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `${filename}-${timestamp}.xlsx`);

    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Failed to export data to Excel');
    return false;
  }
}

/**
 * Export data to CSV
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 */
export function exportToCSV(data, filename) {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  try {
    // Create worksheet and convert to CSV
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `${filename}-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    alert('Failed to export data to CSV');
    return false;
  }
}

/**
 * Export multiple sheets to single Excel file
 * @param {Array} sheets - Array of {name, data} objects
 * @param {string} filename - Name of the file (without extension)
 */
export function exportMultiSheetExcel(sheets, filename) {
  if (!sheets || sheets.length === 0) {
    alert('No data to export');
    return;
  }

  try {
    const wb = XLSX.utils.book_new();

    sheets.forEach(sheet => {
      if (sheet.data && sheet.data.length > 0) {
        const ws = XLSX.utils.json_to_sheet(sheet.data);

        // Auto-size columns
        const colWidths = Object.keys(sheet.data[0]).map(key => {
          const maxLength = Math.max(
            key.length,
            ...sheet.data.map(row => String(row[key] || '').length)
          );
          return { wch: Math.min(maxLength + 2, 50) };
        });
        ws['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, sheet.name);
      }
    });

    const timestamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `${filename}-${timestamp}.xlsx`);

    return true;
  } catch (error) {
    console.error('Error exporting multi-sheet Excel:', error);
    alert('Failed to export data to Excel');
    return false;
  }
}

/**
 * Format customer data for export
 * @param {Array} customers - Array of customer objects
 */
export function formatCustomersForExport(customers) {
  return customers.map(customer => ({
    'Customer Code': customer.code,
    'Name': customer.name,
    'Email': customer.email,
    'Phone': customer.phone || customer.mobile,
    'City': customer.city,
    'Country': customer.country,
    'Type': customer.customer_type,
    'Credit Limit': customer.credit_limit,
    'Current Balance': customer.balance,
    'Status': customer.status,
    'Created At': new Date(customer.created_at).toLocaleDateString()
  }));
}

/**
 * Format sales orders for export
 * @param {Array} orders - Array of sales order objects
 */
export function formatSalesOrdersForExport(orders) {
  return orders.map(order => ({
    'Order Number': order.order_number,
    'Customer': order.customer_name,
    'Order Date': new Date(order.order_date).toLocaleDateString(),
    'Delivery Date': new Date(order.delivery_date).toLocaleDateString(),
    'Status': order.status,
    'Total Amount': order.total_amount,
    'Tax Amount': order.tax_amount,
    'Discount': order.discount_amount,
    'Net Amount': order.net_amount,
    'Created By': order.created_by_name
  }));
}

/**
 * Format products for export
 * @param {Array} products - Array of product objects
 */
export function formatProductsForExport(products) {
  return products.map(product => ({
    'SKU': product.sku,
    'Name': product.name,
    'Category': product.category_name,
    'Unit': product.unit_name,
    'Cost Price': product.cost_price,
    'Selling Price': product.selling_price,
    'Stock Quantity': product.stock_quantity,
    'Reorder Level': product.reorder_level,
    'Max Stock': product.max_stock_level,
    'Status': product.is_active ? 'Active' : 'Inactive'
  }));
}

/**
 * Format production orders for export
 * @param {Array} orders - Array of production order objects
 */
export function formatProductionOrdersForExport(orders) {
  return orders.map(order => ({
    'Order Number': order.order_number,
    'Product': order.product_name,
    'Planned Quantity': order.quantity,
    'Actual Quantity': order.actual_quantity || 0,
    'Start Date': new Date(order.start_date).toLocaleDateString(),
    'End Date': new Date(order.end_date).toLocaleDateString(),
    'Status': order.status,
    'Created By': order.created_by_name
  }));
}

/**
 * Print current page
 */
export function printPage() {
  window.print();
}

/**
 * Create export dropdown menu
 * @param {Function} onExcelClick - Callback for Excel export
 * @param {Function} onCSVClick - Callback for CSV export
 * @param {Function} onPrintClick - Callback for print
 */
export function createExportDropdown(onExcelClick, onCSVClick, onPrintClick) {
  return `
    <div class="relative inline-block">
      <button onclick="toggleExportMenu()" 
              class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Export</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div id="export-menu" class="hidden absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
        <button onclick="${onExcelClick}" 
                class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100">
          <span class="text-2xl">📊</span>
          <span class="font-medium">Export to Excel</span>
        </button>
        <button onclick="${onCSVClick}" 
                class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100">
          <span class="text-2xl">📄</span>
          <span class="font-medium">Export to CSV</span>
        </button>
        <button onclick="${onPrintClick}" 
                class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3">
          <span class="text-2xl">🖨️</span>
          <span class="font-medium">Print</span>
        </button>
      </div>
    </div>
  `;
}

// Toggle export menu
window.toggleExportMenu = function() {
  const menu = document.getElementById('export-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

// Close export menu when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('export-menu');
  const button = e.target.closest('button');
  
  if (menu && !menu.contains(e.target) && !button?.textContent.includes('Export')) {
    menu.classList.add('hidden');
  }
});
