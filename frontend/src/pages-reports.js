import { AppState } from './state.js';
import { t, formatCurrency } from './i18n.js';

// Reports Page Component
const ReportsPage = () => `
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">${t('reports.title')}</h1>
        <p class="text-gray-600 mt-1">Analytics and performance metrics</p>
      </div>
      <div class="flex gap-2">
        <input 
          type="date" 
          value="${AppState.dateRange.start}"
          onchange="updateDateRange('start', this.value)"
          class="border border-gray-300 rounded-lg px-3 py-2"
        />
        <input 
          type="date" 
          value="${AppState.dateRange.end}"
          onchange="updateDateRange('end', this.value)"
          class="border border-gray-300 rounded-lg px-3 py-2"
        />
        <button onclick="loadReports()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Apply
        </button>
      </div>
    </div>

    <!-- Sales Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-gray-500 text-sm font-medium uppercase">${t('reports.totalSales')}</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">
          ${formatCurrency(AppState.salesStats?.total_sales || 0)}
        </p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-gray-500 text-sm font-medium uppercase">${t('reports.totalOrders')}</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">
          ${AppState.salesStats?.total_orders || 0}
        </p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-gray-500 text-sm font-medium uppercase">${t('reports.inventoryValue')}</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">
          ${formatCurrency(AppState.inventoryStats?.total_value || 0)}
        </p>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Sales Chart Placeholder -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">${t('reports.salesTrend')}</h3>
        <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </div>

      <!-- Inventory Chart Placeholder -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">${t('reports.stockDistribution')}</h3>
        <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </div>
    </div>
  </div>
`;

export { ReportsPage };
