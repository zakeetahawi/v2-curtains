import { AppState } from './state.js';
import { t } from './i18n.js';

// Customers Page Component
const CustomersPage = () => `
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">${t('customers.title')}</h1>
        <p class="text-gray-600 mt-1">Manage your customers and contacts</p>
      </div>
      <button onclick="openCustomerModal()" class="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        ${t('customers.addNew')}
      </button>
    </div>

    <!-- Search Bar -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <div class="relative">
        <input 
          type="text" 
          id="searchCustomers"
          placeholder="${t('customers.search')}"
          class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          onkeyup="searchCustomers(this.value)"
        />
        <svg class="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Customers Table -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div id="customersTableContainer">
        ${CustomersTable()}
      </div>
    </div>
  </div>
`;

// Customers Table
const CustomersTable = () => `
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead class="bg-gray-50 border-b-2 border-gray-200">
        <tr>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('customers.code')}</th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('customers.name')}</th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('customers.email')}</th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('customers.phone')}</th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('customers.location')}</th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('customers.type')}</th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('customers.status')}</th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">${t('customers.actions')}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        ${AppState.customers.length === 0 ? `
          <tr>
            <td colspan="8" class="px-6 py-12 text-center text-gray-500">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p class="text-lg font-semibold">${t('customers.noData')}</p>
              <button onclick="openCustomerModal()" class="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold">
                ${t('customers.addNew')}
              </button>
            </td>
          </tr>
        ` : AppState.customers.map(customer => `
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${customer.code}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${customer.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${customer.email || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${customer.phone || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${customer.city || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-3 py-1 text-xs font-semibold rounded-full ${customer.type === 'vip' ? 'bg-purple-100 text-purple-800' :
    customer.type === 'wholesale' ? 'bg-blue-100 text-blue-800' :
      'bg-gray-100 text-gray-800'
  }">
                ${t('customers.types.' + customer.type)}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-3 py-1 text-xs font-semibold rounded-full ${customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }">
                ${t('customers.statuses.' + customer.status)}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button onclick="viewCustomerProfile(${customer.id})" class="text-indigo-600 hover:text-indigo-900">View</button>
              <button onclick="editCustomer(${customer.id})" class="text-blue-600 hover:text-blue-900">Edit</button>
              <button onclick="deleteCustomer(${customer.id})" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  ${AppState.customersTotal > 10 ? `
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing ${((AppState.customersPage - 1) * 10) + 1} to ${Math.min(AppState.customersPage * 10, AppState.customersTotal)} of ${AppState.customersTotal} customers
      </div>
      <div class="flex gap-2">
        <button 
          onclick="changeCustomersPage(${AppState.customersPage - 1})"
          ${AppState.customersPage === 1 ? 'disabled' : ''}
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button 
          onclick="changeCustomersPage(${AppState.customersPage + 1})"
          ${AppState.customersPage * 10 >= AppState.customersTotal ? 'disabled' : ''}
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  ` : ''}
`;

// Export for use
export { CustomersPage, CustomersTable };
