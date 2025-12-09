import { AppState } from './state.js';
import { t, formatCurrency } from './i18n.js';

// Inventory Page Component
const InventoryPage = () => `
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">${t('inventory.title')}</h1>
        <p class="text-gray-600 mt-1">Manage products and stock levels</p>
      </div>
      <button onclick="openProductModal()" class="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        ${t('inventory.addNew')}
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm p-4 flex gap-4">
      <div class="relative flex-1">
        <input 
          type="text" 
          placeholder="${t('inventory.search')}"
          class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
        <svg class="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <select class="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
        <option value="">All Categories</option>
        ${AppState.categories ? AppState.categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('') : ''}
      </select>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('inventory.sku')}</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('inventory.name')}</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('inventory.category')}</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('inventory.price')}</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('inventory.stock')}</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('inventory.status')}</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('inventory.actions')}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            ${AppState.products && AppState.products.length > 0 ? AppState.products.map(product => `
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">${product.sku}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${product.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${product.category?.name || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${formatCurrency(product.selling_price)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 text-xs font-semibold rounded-full ${getStockColor(product.reorder_level, 100)}">
                    ${product.reorder_level} units
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 text-xs font-semibold rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ${product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button class="text-indigo-600 hover:text-indigo-900">Edit</button>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                  <p class="text-lg font-semibold">${t('inventory.noData')}</p>
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  </div>
`;

function getStockColor(current, max) {
    if (current <= 10) return 'bg-red-100 text-red-800';
    if (current <= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
}

export { InventoryPage };
