import { AppState } from './state.js';
import { t, formatCurrency } from './i18n.js';

// Sales Page Component
const SalesPage = () => `
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">${t('sales.title')}</h1>
        <p class="text-gray-600 mt-1">Manage sales orders and invoices</p>
      </div>
      <button onclick="openOrderModal()" class="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        ${t('sales.addNew')}
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm p-4 flex gap-4">
      <div class="relative flex-1">
        <input 
          type="text" 
          placeholder="${t('sales.search')}"
          class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
        <svg class="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <select class="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
        <option value="">All Statuses</option>
        <option value="draft">Draft</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
      </select>
    </div>

    <!-- Sales Table -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('sales.orderNumber')}</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('sales.customer')}</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('sales.date')}</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('sales.status')}</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('sales.total')}</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('sales.actions')}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            ${AppState.orders && AppState.orders.length > 0 ? AppState.orders.map(order => `
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">#${order.order_number}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${order.customer?.name || 'Unknown'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${new Date(order.order_date).toLocaleDateString()}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}">
                    ${order.status}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${formatCurrency(order.total_amount)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button class="text-indigo-600 hover:text-indigo-900">View</button>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  <p class="text-lg font-semibold">${t('sales.noData')}</p>
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  </div>
`;

function getStatusColor(status) {
    switch (status) {
        case 'draft': return 'bg-gray-100 text-gray-800';
        case 'confirmed': return 'bg-blue-100 text-blue-800';
        case 'shipped': return 'bg-yellow-100 text-yellow-800';
        case 'delivered': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

export { SalesPage };
