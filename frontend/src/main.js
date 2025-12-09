import './style.css'
// Core modules - loaded immediately (required for app initialization)
import { t, formatCurrency, getLanguage, setLanguage, getCurrency, setCurrency, currencies } from './i18n.js'
import { AppState } from './state.js'
import { Modal, FormInput, FormSelect } from './components.js'
import { getGovernorates, getCities } from './egypt_locations.js'
import { NotificationsAPI } from './notifications.js'

// Dynamic module loader - for lazy loading heavy modules
import {
  loadCustomersModule,
  loadCustomersPageModule,
  loadCustomerProfileModule,
  loadSalesModule,
  loadSalesPageModule,
  loadInventoryModule,
  loadInventoryPageModule,
  loadProductionModule,
  loadProductionPageModule,
  loadReportsModule,
  loadReportsPageModule,
  loadSettingsModule,
  loadSettingsPageModule,
  showModuleLoadingSpinner,
  predictivePreload
} from './module-loader.js'

// ==================== STATE MANAGEMENT ====================
// AppState is imported from state.js

// ==================== API FUNCTIONS ====================
const API = {
  baseURL: 'http://localhost:8080/api/v1',

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await response.json();
  },

  getAuthHeader() {
    const token = localStorage.getItem('access_token');
    return { 'Authorization': `Bearer ${token}` };
  }
};

// ==================== PAGES ====================

// LOGIN PAGE
const LoginPage = () => `
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-16 px-4">
    <div class="flex bg-white rounded-2xl shadow-2xl overflow-hidden mx-auto max-w-sm lg:max-w-5xl">
      
      <!-- Left Side - Image -->
      <div class="hidden lg:block lg:w-1/2 bg-cover bg-center relative"
           style="background-image:url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 flex flex-col items-center justify-center p-12 text-white">
          <div class="text-center">
            ${AppState.publicSettings?.company_logo
    ? `<img src="http://localhost:8080${AppState.publicSettings.company_logo}" class="w-24 h-24 object-contain bg-white rounded-2xl mx-auto mb-6 p-2 shadow-2xl">`
    : `<div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>`
  }
            <h1 class="text-4xl font-extrabold mb-4 drop-shadow-lg">${AppState.publicSettings?.company_name || t('login.title')}</h1>
            <p class="text-xl font-medium mb-8 text-white/90">${t('login.subtitle')}</p>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 class="font-bold text-lg mb-4">✨ ${t('login.features.title')}</h3>
              <ul class="text-right space-y-2 text-sm">
                <li class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                  ${t('login.features.customers')}
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                  ${t('login.features.inventory')}
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                  ${t('login.features.reports')}
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                  ${t('login.features.security')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Form -->
      <div class="w-full p-8 lg:w-1/2 lg:p-12" dir="${getLanguage() === 'ar' ? 'rtl' : 'ltr'}">
        <div class="mb-8 text-center ${'lg:text-' + (getLanguage() === 'ar' ? 'right' : 'left')}">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">${AppState.publicSettings?.company_name || t('login.title')}</h2>
          <p class="text-xl text-gray-600">${t('login.welcome')}</p>
        </div>

        <form id="loginForm" class="mt-6">
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">${t('login.email')}</label>
            <input id="email" type="email" value="admin@erp.local"
              class="bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-300 rounded-lg py-3 px-4 block w-full" 
              required dir="ltr" />
          </div>

          <div class="mt-4">
            <div class="flex justify-between items-center">
              <label class="block text-gray-700 text-sm font-bold mb-2">${t('login.password')}</label>
              <a href="#" class="text-xs text-indigo-600 hover:text-indigo-800">${t('login.forgotPassword')}</a>
            </div>
            <input id="password" type="password" value="admin123"
              class="bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-300 rounded-lg py-3 px-4 block w-full" 
              required dir="ltr" />
          </div>

          <div id="errorMessage" class="hidden mt-4">
            <div class="bg-red-50 border-r-4 border-red-500 p-4 rounded-lg">
              <p class="text-red-800 text-sm font-medium"></p>
            </div>
          </div>

          <div class="mt-6">
            <button id="submitBtn" type="submit"
              class="bg-gray-800 text-white font-bold py-3 px-4 w-full rounded-lg hover:bg-gray-700 transition-all">
              <span id="btnText">${t('login.loginButton')}</span>
              <span id="btnLoader" class="hidden">${t('login.loggingIn')}</span>
            </button>
          </div>
        </form>

        <div class="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div class="flex-1 text-${getLanguage() === 'ar' ? 'right' : 'left'}">
              <h3 class="text-sm font-bold text-gray-800 mb-1">🔑 ${t('login.demoCredentials')}</h3>
              <p class="text-xs text-gray-600">${t('login.demoEmail')} / ${t('login.demoPassword')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// DASHBOARD PAGE
const DashboardPage = () => `
  <div class="min-h-screen bg-gray-50" dir="${getLanguage() === 'ar' ? 'rtl' : 'ltr'}">
    <!-- Sidebar -->
    <aside class="fixed right-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl z-50">
      <div class="p-6">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold">${t('login.title')}</h1>
            <p class="text-xs text-gray-400">v1.0.0</p>
          </div>
        </div>

        <nav class="space-y-2">
          <a href="#" onclick="navigateTo('dashboard')" class="nav-item active flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span class="font-semibold">${t('nav.home')}</span>
          </a>
          <a href="#" onclick="navigateTo('customers')" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span>${t('nav.customers')}</span>
          </a>
          <a href="#" onclick="navigateTo('sales')" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <span>${t('nav.sales')}</span>
          </a>
          <a href="#" onclick="navigateTo('inventory')" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <span>${t('nav.inventory')}</span>
          </a>
          <a href="#" onclick="navigateTo('production')" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span>${t('nav.production')}</span>
          </a>
          <a href="#" onclick="navigateTo('reports')" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <span>${t('nav.reports')}</span>
          </a>
          <a href="#" onclick="navigateTo('settings')" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>Settings</span>
          </a>
        </nav>

        <div class="mt-8 pt-8 border-t border-gray-700">
          <button onclick="handleLogout()" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-400 w-full transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span>${t('nav.logout')}</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="mr-64 p-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">${t('dashboard.welcome')}, ${AppState.user?.username || 'User'} 👋</h1>
            <p class="text-gray-600 mt-1">${t('dashboard.overview')}</p>
          </div>
          <div class="flex items-center gap-4">
            <!-- Language Switcher -->
            <div class="relative" onclick="toggleLanguage()">
              <button class="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span class="text-sm font-semibold text-gray-700">${getLanguage().toUpperCase()}</span>
              </button>
            </div>
            <!-- Notification Bell -->
            <div class="relative">
                <button onclick="toggleNotifications()" class="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all relative">
                  <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  <span id="notif-badge" class="hidden absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                <div id="notif-dropdown" class="hidden absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden" style="right: ${getLanguage() === 'ar' ? 'auto' : '0'}; left: ${getLanguage() === 'ar' ? '0' : 'auto'};">
                    <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 class="font-bold text-gray-900">Notifications</h3>
                        <span id="notif-count" class="text-xs font-medium bg-white px-2 py-1 rounded-full text-gray-600 border border-gray-200">0</span>
                    </div>
                    <div id="notif-list" class="max-h-80 overflow-y-auto">
                        <div class="p-8 text-center text-gray-400 text-sm">Scanning...</div>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm">
              <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                ${(AppState.user?.username || 'A')[0].toUpperCase()}
              </div>
              <div class="text-right">
                <p class="font-semibold text-sm">${AppState.user?.username || 'Admin'}</p>
                <p class="text-xs text-gray-500">${AppState.user?.role?.name || 'مدير'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        ${StatsCard(t('dashboard.stats.totalSales'), formatCurrency(245000), '+12.5%', 'up', 'blue')}
        ${StatsCard(t('dashboard.stats.newCustomers'), '156', '+8.2%', 'up', 'green')}
        ${StatsCard(t('dashboard.stats.activeOrders'), '89', '-3.1%', 'down', 'yellow')}
        ${StatsCard(t('dashboard.stats.totalRevenue'), formatCurrency(1200000), '+15.3%', 'up', 'purple')}
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-lg p-6 overflow-hidden">
          <h3 class="text-lg font-bold text-gray-900 mb-4">${t('dashboard.charts.salesStats')}</h3>
          <div class="h-64 flex items-end justify-between gap-2 overflow-hidden">
            ${Array.from({ length: 7 }, (_, i) => {
  const height = Math.random() * 100 + 50;
  return `<div class="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t-lg transition-all hover:scale-105" style="height: ${height}%"></div>`;
}).join('')}
          </div>
          <div class="flex justify-between mt-4 text-xs text-gray-600">
            <span>${t('days.saturday')}</span><span>${t('days.sunday')}</span><span>${t('days.monday')}</span><span>${t('days.tuesday')}</span><span>${t('days.wednesday')}</span><span>${t('days.thursday')}</span><span>${t('days.friday')}</span>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6 overflow-hidden">
          <h3 class="text-lg font-bold text-gray-900 mb-4">${t('dashboard.charts.productDistribution')}</h3>
          <div class="flex items-center justify-center h-64 overflow-hidden">
            <div class="relative w-48 h-48">
              <svg class="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="80" fill="none" stroke="#e5e7eb" stroke-width="16"/>
                <circle cx="96" cy="96" r="80" fill="none" stroke="#6366f1" stroke-width="16" 
                  stroke-dasharray="251.2 251.2" stroke-dashoffset="62.8" stroke-linecap="round"/>
                <circle cx="96" cy="96" r="80" fill="none" stroke="#10b981" stroke-width="16"
                  stroke-dasharray="251.2 251.2" stroke-dashoffset="188.4" stroke-linecap="round"/>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-3xl font-bold text-gray-900">234</div>
                  <div class="text-sm text-gray-600">${t('dashboard.charts.products')}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-indigo-500 rounded"></div>
              <span class="text-sm text-gray-600">${t('dashboard.charts.active')} (75%)</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-green-500 rounded"></div>
              <span class="text-sm text-gray-600">${t('dashboard.charts.limited')} (25%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">${t('dashboard.activities.title')}</h3>
        <div class="space-y-4">
          ${ActivityItem(t('dashboard.activities.newCustomer'), 'محمد أحمد ' + t('dashboard.activities.customerJoined'), '5 ' + t('dashboard.activities.minutesAgo'), 'user')}
          ${ActivityItem(t('dashboard.activities.newOrder') + ' #1234', t('dashboard.activities.orderCreated') + ' ' + formatCurrency(15000), '15 ' + t('dashboard.activities.minutesAgo'), 'cart')}
          ${ActivityItem(t('dashboard.activities.inventoryUpdate'), '12 ' + t('dashboard.activities.productsUpdated'), t('dashboard.activities.hourAgo'), 'box')}
          ${ActivityItem(t('dashboard.activities.invoicePaid'), t('dashboard.activities.paymentReceived') + ' ' + formatCurrency(25000), t('dashboard.activities.hoursAgo'), 'money')}
        </div>
      </div>
    </main>
  </div>
`;

// Helper Components
const StatsCard = (title, value, change, trend, color) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return `
    <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-gradient-to-br ${colors[color]} rounded-xl flex items-center justify-center shadow-lg">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span class="text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${trend === 'up' ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'}" />
          </svg>
          ${change}
        </span>
      </div>
      <h4 class="text-gray-600 text-sm mb-2">${title}</h4>
      <p class="text-3xl font-bold text-gray-900">${value}</p>
    </div>
  `;
};

const ActivityItem = (title, desc, time, type) => {
  const icons = {
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    cart: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    box: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    money: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
  };

  return `
    <div class="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
      <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icons[type]}" />
        </svg>
      </div>
      <div class="flex-1">
        <h4 class="font-semibold text-gray-900">${title}</h4>
        <p class="text-sm text-gray-600">${desc}</p>
      </div>
      <span class="text-xs text-gray-500">${time}</span>
    </div>
  `;
};

// ==================== ROUTING ====================
async function navigateTo(page) {
  AppState.currentPage = page;
  
  // Show loading spinner while module loads
  const mainContent = document.getElementById('main-content');
  if (mainContent && page !== 'dashboard' && page !== 'login') {
    showModuleLoadingSpinner(mainContent);
  }

  // Load page-specific modules dynamically
  if (page === 'customers') {
    await loadCustomers();
  } else if (page === 'sales') {
    await loadSales();
  } else if (page === 'inventory') {
    await loadInventory();
  } else if (page === 'production') {
    await loadProduction();
  } else if (page === 'reports') {
    await loadReports();
  } else if (page === 'settings') {
    await loadSettings();
  }

  // Predictive preloading - load likely next pages in background
  predictivePreload(page);
  
  render();
}

async function loadSettings() {
  try {
    // Dynamically load Settings module
    const { SettingsAPI } = await loadSettingsModule();
    
    const data = await SettingsAPI.get();
    if (data.success) {
      AppState.settings = data.data;
    } else {
      AppState.settings = {};
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
    AppState.settings = {};
  }
}

// ==================== CUSTOMERS LOGIC ====================
async function loadCustomers() {
  try {
    // Dynamically load Customers module
    const { CustomersAPI } = await loadCustomersModule();
    
    const data = await CustomersAPI.getAll(AppState.customersPage, 10, AppState.customersSearch);
    if (data.success) {
      AppState.customers = data.data.customers;
      AppState.customersTotal = data.data.total;
    }
  } catch (error) {
    console.error('Failed to load customers:', error);
  }
}

window.searchCustomers = async (query) => {
  AppState.customersSearch = query;
  AppState.customersPage = 1;
  await loadCustomers();
  render(); // Re-render to update table
};

window.changeCustomersPage = async (page) => {
  AppState.customersPage = page;
  await loadCustomers();
  render();
};

// Store current editing ID
let currentEditingId = null;

window.openCustomerModal = (customer = null) => {
  currentEditingId = customer ? customer.id : null;
  const isEdit = !!customer;
  const governorates = getGovernorates().map(g => ({ value: g, label: g }));

  // Pre-fill data if editing
  const name = customer ? customer.name : '';
  const email = customer ? customer.email : '';
  const phone = customer ? customer.phone : '';
  const gov = customer ? customer.governorate : '';
  const city = customer ? customer.city : '';
  const address = customer ? customer.address : '';
  const creditLimit = customer ? customer.credit_limit : 0;
  const type = customer ? customer.type : 'regular';

  const modalContent = `
    <form id="customerForm">
      ${FormInput('customerName', t('customers.name'), 'text', name)}
      ${FormInput('customerEmail', t('customers.email'), 'email', email)}
      ${FormInput('customerPhone', t('customers.phone'), 'tel', phone)}
      <div class="grid grid-cols-2 gap-4">
        ${FormSelect('customerGov', t('customers.governorate'), [{ value: '', label: 'Select Governorate' }, ...governorates], gov)}
        <div class="mb-4">
          <label for="customerCity" class="block text-sm font-medium text-gray-700 mb-1">${t('customers.city')}</label>
          <select id="customerCity" name="customerCity" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border">
            <option value="">Select City</option>
            ${gov ? getCities(gov).map(c => `<option value="${c}" ${c === city ? 'selected' : ''}>${c}</option>`).join('') : ''}
          </select>
        </div>
      </div>
      ${FormInput('customerAddress', t('customers.address'), 'text', address)}
      ${FormInput('customerCreditLimit', 'Credit Limit (EGP)', 'number', creditLimit)}
      ${FormSelect('customerType', t('customers.type'), [
    { value: 'regular', label: 'Regular' },
    { value: 'vip', label: 'VIP' },
    { value: 'wholesale', label: 'Wholesale' }
  ], type)}
    </form>
  `;

  const title = isEdit ? 'Edit Customer' : t('customers.addNew');
  const modalHTML = Modal('customerModal', title, modalContent, 'saveCustomer()');

  const existingModal = document.getElementById('customerModal');
  if (existingModal) existingModal.remove();

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Add Event Listener for Governorate Change
  const govSelect = document.getElementById('customerGov');
  govSelect.addEventListener('change', (e) => {
    const cities = getCities(e.target.value);
    const citySelect = document.getElementById('customerCity');
    citySelect.innerHTML = '<option value="">Select City</option>' +
      cities.map(c => `<option value="${c}">${c}</option>`).join('');
  });

  document.getElementById('customerModal').classList.remove('hidden');
};

window.closeModal = (id) => {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('hidden');
    // Optional: Remove from DOM after transition
    // modal.remove();
  }
};

window.saveCustomer = async () => {
  const name = document.getElementById('customerName').value;
  const email = document.getElementById('customerEmail').value;
  const phone = document.getElementById('customerPhone').value;
  const governorate = document.getElementById('customerGov').value;
  const city = document.getElementById('customerCity').value;
  const address = document.getElementById('customerAddress').value;
  const creditLimit = parseFloat(document.getElementById('customerCreditLimit').value) || 0;
  const type = document.getElementById('customerType').value;

  if (!name) {
    alert('Name is required');
    return;
  }

  const data = {
    name, email, phone, type,
    governorate, city, address,
    credit_limit: creditLimit,
    country: 'Egypt'
  };

  try {
    let result;
    if (currentEditingId) {
      result = await CustomersAPI.update(currentEditingId, data);
    } else {
      result = await CustomersAPI.create(data);
    }

    if (result.success) {
      closeModal('customerModal');
      await loadCustomers();
      render();
      alert(currentEditingId ? 'Customer updated successfully!' : 'Customer saved successfully!');
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Save error:', error);
    alert('Failed to save customer');
  }
};

window.editCustomer = async (id) => {
  try {
    const response = await CustomersAPI.getOne(id);
    if (response.success) {
      openCustomerModal(response.data);
    } else {
      alert('Failed to fetch customer details');
    }
  } catch (error) {
    console.error('Edit error:', error);
  }
};

window.viewCustomerProfile = async (id) => {
  try {
    const [customerData, ordersData, activitiesData, documentsData] = await Promise.all([
      CustomersAPI.getOne(id),
      SalesAPI.getAll(1, 100, '', id),
      CustomersAPI.getActivities(id),
      CustomersAPI.getDocuments(id)
    ]);

    if (customerData.success) {
      AppState.selectedCustomer = customerData.data;
      AppState.customerOrders = ordersData.success ? ordersData.data.orders : [];
      AppState.customerActivities = activitiesData.success ? activitiesData.data : [];
      AppState.customerDocuments = documentsData.success ? documentsData.data : [];
      navigateTo('customer-profile');
    }
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
};

window.switchProfileTab = (tabName) => {
  // Update Tab Styles
  document.querySelectorAll('[id^="tab-"]').forEach(el => {
    if (el.id === `tab-${tabName}`) {
      el.classList.add('border-indigo-600', 'text-indigo-600');
      el.classList.remove('border-transparent', 'text-gray-500');
    } else {
      el.classList.remove('border-indigo-600', 'text-indigo-600');
      el.classList.add('border-transparent', 'text-gray-500');
    }
  });

  // Show/Hide Content
  document.querySelectorAll('[id^="content-"]').forEach(el => {
    if (el.id === `content-${tabName}`) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
};

window.saveActivity = async (customerId) => {
  const type = document.querySelector('input[name="activityType"]:checked').value;
  const description = document.getElementById('activityDesc').value;
  const reminderDate = document.getElementById('reminderDate').value;

  if (!description) {
    alert(t('crm.descriptionRequired'));
    return;
  }

  // Validate reminder date if type is reminder
  if (type === 'reminder' && !reminderDate) {
    alert(t('crm.reminderDateRequired'));
    return;
  }

  try {
    const payload = { type, description };
    
    // Only include reminder_date if type is reminder
    if (type === 'reminder' && reminderDate) {
      payload.reminder_date = reminderDate;
    }
    
    const result = await CustomersAPI.addActivity(customerId, payload);
    if (result.success) {
      // Clear form
      document.getElementById('activityDesc').value = '';
      document.getElementById('reminderDate').value = '';
      document.querySelector('input[name="activityType"][value="note"]').checked = true;
      toggleReminderDate();
      
      // Refresh activities
      const activitiesData = await CustomersAPI.getActivities(customerId);
      if (activitiesData.success) {
        AppState.customerActivities = activitiesData.data;
        // Re-render profile page
        render();
        // Switch back to activities tab after render
        setTimeout(() => switchProfileTab('activities'), 0);
      }
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Save activity error:', error);
    alert(t('common.error'));
  }
};

window.uploadDocument = async (customerId) => {
  const fileInput = document.getElementById('docFile');
  const titleInput = document.getElementById('docTitle');

  if (fileInput.files.length === 0) {
    alert('Please select a file');
    return;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  formData.append('title', titleInput.value);

  try {
    const result = await CustomersAPI.uploadDocument(customerId, formData);
    if (result.success) {
      // Refresh documents
      const docsData = await CustomersAPI.getDocuments(customerId);
      if (docsData.success) {
        AppState.customerDocuments = docsData.data;
        render();
        setTimeout(() => switchProfileTab('documents'), 0);
      }
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('Failed to upload document');
  }
};

window.deleteCustomer = async (id) => {
  if (confirm('Are you sure you want to delete this customer?')) {
    await CustomersAPI.delete(id);
    await loadCustomers();
    render();
  }
};

// ==================== SALES LOGIC ====================
async function loadSales() {
  try {
    // Dynamically load Sales module
    const { SalesAPI } = await loadSalesModule();
    
    const data = await SalesAPI.getAll(AppState.ordersPage, 10, AppState.ordersStatus);
    if (data.success) {
      AppState.orders = data.data.orders;
      AppState.ordersTotal = data.data.total;
    }
  } catch (error) {
    console.error('Failed to load sales:', error);
  }
}

window.openOrderModal = async () => {
  // Load required modules dynamically
  const [{ CustomersAPI }, { InventoryAPI }] = await Promise.all([
    loadCustomersModule(),
    loadInventoryModule()
  ]);
  
  // Fetch data for dropdowns
  const [customersData, productsData] = await Promise.all([
    CustomersAPI.getAll(1, 100), // Get all for dropdown
    InventoryAPI.getAllProducts(1, 100)
  ]);

  const customersOptions = customersData.success ? customersData.data.customers.map(c => ({ value: c.id, label: c.name })) : [];
  const productsOptions = productsData.success ? productsData.data.products.map(p => ({ value: p.id, label: p.name })) : [];

  const modalContent = `
    <form id="orderForm">
      ${FormSelect('orderCustomer', t('sales.customer'), customersOptions)}
      ${FormInput('orderDate', t('sales.date'), 'date', new Date().toISOString().split('T')[0])}
      <hr class="my-4 border-gray-200">
      <h4 class="font-bold mb-2 text-sm text-gray-700 uppercase">Order Item</h4>
      ${FormSelect('orderProduct', t('production.product'), productsOptions)}
      <div class="grid grid-cols-2 gap-4">
        ${FormInput('orderQuantity', t('production.quantity'), 'number', '1')}
        ${FormInput('orderPrice', t('inventory.price'), 'number', '0')}
      </div>
    </form>
  `;

  // Remove existing modal if any to refresh content
  const existingModal = document.getElementById('orderModal');
  if (existingModal) existingModal.remove();

  const modalHTML = Modal('orderModal', t('sales.addNew'), modalContent, 'saveOrder()');
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  document.getElementById('orderModal').classList.remove('hidden');
};

window.saveOrder = async () => {
  const customerId = document.getElementById('orderCustomer').value;
  const date = document.getElementById('orderDate').value;
  const productId = document.getElementById('orderProduct').value;
  const quantity = document.getElementById('orderQuantity').value;
  const price = document.getElementById('orderPrice').value;

  if (!customerId || !productId || !quantity || !price) {
    alert('Please fill all required fields');
    return;
  }

  try {
    const result = await SalesAPI.create({
      customer_id: parseInt(customerId),
      order_date: new Date(date).toISOString(),
      items: [{
        product_id: parseInt(productId),
        quantity: parseFloat(quantity),
        unit_price: parseFloat(price)
      }]
    });

    if (result.success) {
      closeModal('orderModal');
      await loadSales();
      render();
      alert('Order created successfully!');
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Save error:', error);
    alert('Failed to save order');
  }
};

// ==================== INVENTORY LOGIC ====================
async function loadInventory() {
  try {
    // Dynamically load Inventory module
    const { InventoryAPI } = await loadInventoryModule();
    
    const [productsData, categoriesData] = await Promise.all([
      InventoryAPI.getAllProducts(AppState.productsPage, 10, AppState.productsSearch, AppState.selectedCategory),
      InventoryAPI.getAllCategories()
    ]);

    if (productsData.success) {
      AppState.products = productsData.data.products;
      AppState.productsTotal = productsData.data.total;
    }
    if (categoriesData.success) {
      AppState.categories = categoriesData.data;
    }
  } catch (error) {
    console.error('Failed to load inventory:', error);
  }
}

window.openProductModal = async () => {
  // Load Inventory module dynamically
  const { InventoryAPI } = await loadInventoryModule();
  
  const categoriesData = await InventoryAPI.getAllCategories();
  const categoriesOptions = categoriesData.success ? categoriesData.data.map(c => ({ value: c.id, label: c.name })) : [];

  const modalContent = `
    <form id="productForm">
      ${FormInput('productSKU', t('inventory.sku'))}
      ${FormInput('productName', t('inventory.name'))}
      ${FormSelect('productCategory', t('inventory.category'), categoriesOptions)}
      <div class="grid grid-cols-2 gap-4">
        ${FormInput('productCost', 'Cost Price', 'number')}
        ${FormInput('productPrice', t('inventory.price'), 'number')}
      </div>
      ${FormInput('productStock', 'Initial Stock', 'number', '0')}
    </form>
  `;

  const existingModal = document.getElementById('productModal');
  if (existingModal) existingModal.remove();

  const modalHTML = Modal('productModal', t('inventory.addNew'), modalContent, 'saveProduct()');
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  document.getElementById('productModal').classList.remove('hidden');
};

window.saveProduct = async () => {
  const sku = document.getElementById('productSKU').value;
  const name = document.getElementById('productName').value;
  const categoryId = document.getElementById('productCategory').value;
  const cost = document.getElementById('productCost').value;
  const price = document.getElementById('productPrice').value;

  if (!sku || !name) {
    alert('SKU and Name are required');
    return;
  }

  try {
    const result = await InventoryAPI.createProduct({
      sku, name,
      category_id: parseInt(categoryId),
      cost_price: parseFloat(cost),
      selling_price: parseFloat(price)
    });

    if (result.success) {
      closeModal('productModal');
      await loadInventory();
      render();
      alert('Product saved successfully!');
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Save error:', error);
    alert('Failed to save product');
  }
};

// ==================== PRODUCTION LOGIC ====================
async function loadProduction() {
  try {
    // Dynamically load Production module
    const { ProductionAPI } = await loadProductionModule();
    
    const data = await ProductionAPI.getAllOrders(AppState.productionOrdersPage, 10, AppState.productionOrdersStatus);
    if (data.success) {
      AppState.productionOrders = data.data.orders;
      AppState.productionOrdersTotal = data.data.total;
    }
  } catch (error) {
    console.error('Failed to load production orders:', error);
  }
}

window.openProductionOrderModal = async () => {
  // Load Inventory module dynamically
  const { InventoryAPI } = await loadInventoryModule();
  
  const productsData = await InventoryAPI.getAllProducts(1, 100);
  const productsOptions = productsData.success ? productsData.data.products.map(p => ({ value: p.id, label: p.name })) : [];

  const modalContent = `
    <form id="productionOrderForm">
      ${FormSelect('prodOrderId', t('production.product'), productsOptions)}
      ${FormInput('prodOrderQty', t('production.quantity'), 'number')}
      ${FormInput('prodOrderDate', t('production.startDate'), 'date', new Date().toISOString().split('T')[0])}
    </form>
  `;

  const existingModal = document.getElementById('productionOrderModal');
  if (existingModal) existingModal.remove();

  const modalHTML = Modal('productionOrderModal', t('production.addNew'), modalContent, 'saveProductionOrder()');
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  document.getElementById('productionOrderModal').classList.remove('hidden');
};

window.saveProductionOrder = async () => {
  const productId = document.getElementById('prodOrderId').value;
  const quantity = document.getElementById('prodOrderQty').value;
  const date = document.getElementById('prodOrderDate').value;

  if (!productId || !quantity) {
    alert('Product and Quantity are required');
    return;
  }

  try {
    const result = await ProductionAPI.createOrder({
      product_id: parseInt(productId),
      quantity: parseFloat(quantity),
      start_date: new Date(date).toISOString()
    });

    if (result.success) {
      closeModal('productionOrderModal');
      await loadProduction();
      render();
      alert('Production Order created successfully!');
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Save error:', error);
    alert('Failed to save production order');
  }
};

// ==================== REPORTS LOGIC ====================
async function loadReports() {
  try {
    // Dynamically load Reports module
    const { ReportsAPI } = await loadReportsModule();
    
    const [salesData, inventoryData] = await Promise.all([
      ReportsAPI.getSalesStats(AppState.dateRange.start, AppState.dateRange.end),
      ReportsAPI.getInventoryStats()
    ]);

    if (salesData.success) {
      AppState.salesStats = salesData.data;
    }
    if (inventoryData.success) {
      AppState.inventoryStats = inventoryData.data;
    }
  } catch (error) {
    console.error('Failed to load reports:', error);
  }
  render();
}

window.loadReports = loadReports;

window.updateDateRange = (type, value) => {
  AppState.dateRange[type] = value;
};

function toggleLanguage() {
  const currentLang = getLanguage();
  const newLang = currentLang === 'en' ? 'ar' : 'en';
  setLanguage(newLang);
  render();
}

function handleLogout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  AppState.isAuthenticated = false;
  AppState.user = null;
  navigateTo('login');
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('errorMessage');
  const btnText = document.getElementById('btnText');
  const btnLoader = document.getElementById('btnLoader');

  errorMsg.classList.add('hidden');
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');

  try {
    const data = await API.login(email, password);

    if (data.success) {
      localStorage.setItem('access_token', data.data.access_token);
      localStorage.setItem('refresh_token', data.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      AppState.isAuthenticated = true;
      AppState.user = data.data.user;
      navigateTo('dashboard');
    } else {
      errorMsg.querySelector('p').textContent = data.message || 'خطأ في تسجيل الدخول';
      errorMsg.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMsg.querySelector('p').textContent = 'حدث خطأ أثناء الاتصال بالخادم';
    errorMsg.classList.remove('hidden');
  } finally {
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
  }
}

// ==================== RENDER ====================
async function render() {
  const app = document.querySelector('#app');

  if (AppState.currentPage === 'login' || !AppState.isAuthenticated) {
    app.innerHTML = LoginPage();
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
  } else if (AppState.currentPage === 'dashboard') {
    app.innerHTML = DashboardPage();
  } else if (AppState.currentPage === 'customers') {
    // Load page module dynamically
    const { CustomersPage } = await loadCustomersPageModule();
    
    // We reuse the dashboard layout but replace main content
    const dashboardHTML = DashboardPage();
    const parser = new DOMParser();
    const doc = parser.parseFromString(dashboardHTML, 'text/html');

    // Update active nav item
    const navItems = doc.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    navItems[1].classList.add('active'); // Customers is index 1

    // Replace main content
    const mainContent = doc.querySelector('main');
    mainContent.innerHTML = CustomersPage();

    app.innerHTML = doc.body.innerHTML;
  } else if (AppState.currentPage === 'customer-profile') {
    // Load customer profile page dynamically
    const { CustomerProfilePage } = await loadCustomerProfileModule();
    
    const dashboardHTML = DashboardPage();
    const parser = new DOMParser();
    const doc = parser.parseFromString(dashboardHTML, 'text/html');

    const mainContent = doc.querySelector('main');
    mainContent.innerHTML = CustomerProfilePage(AppState.selectedCustomer, AppState.customerOrders, AppState.customerActivities, AppState.customerDocuments);

    app.innerHTML = doc.body.innerHTML;
  } else if (AppState.currentPage === 'sales') {
    // Load sales page dynamically
    const { SalesPage } = await loadSalesPageModule();
    
    const dashboardHTML = DashboardPage();
    const parser = new DOMParser();
    const doc = parser.parseFromString(dashboardHTML, 'text/html');

    const navItems = doc.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    navItems[2].classList.add('active'); // Sales is index 2

    const mainContent = doc.querySelector('main');
    mainContent.innerHTML = SalesPage();

    app.innerHTML = doc.body.innerHTML;
  } else if (AppState.currentPage === 'inventory') {
    // Load inventory page dynamically
    const { InventoryPage } = await loadInventoryPageModule();
    
    const dashboardHTML = DashboardPage();
    const parser = new DOMParser();
    const doc = parser.parseFromString(dashboardHTML, 'text/html');

    const navItems = doc.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    navItems[3].classList.add('active'); // Inventory is index 3

    const mainContent = doc.querySelector('main');
    mainContent.innerHTML = InventoryPage();

    app.innerHTML = doc.body.innerHTML;
  } else if (AppState.currentPage === 'production') {
    // Load production page dynamically
    const { ProductionPage } = await loadProductionPageModule();
    
    const dashboardHTML = DashboardPage();
    const parser = new DOMParser();
    const doc = parser.parseFromString(dashboardHTML, 'text/html');

    const navItems = doc.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    navItems[4].classList.add('active'); // Production is index 4

    const mainContent = doc.querySelector('main');
    mainContent.innerHTML = ProductionPage();

    app.innerHTML = doc.body.innerHTML;
  } else if (AppState.currentPage === 'reports') {
    // Load reports page dynamically
    const { ReportsPage } = await loadReportsPageModule();
    
    const dashboardHTML = DashboardPage();
    const parser = new DOMParser();
    const doc = parser.parseFromString(dashboardHTML, 'text/html');

    const navItems = doc.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    navItems[5].classList.add('active'); // Reports is index 5

    const mainContent = doc.querySelector('main');
    mainContent.innerHTML = ReportsPage();

    app.innerHTML = doc.body.innerHTML;
  } else if (AppState.currentPage === 'settings') {
    // Load settings page dynamically
    const { SettingsPage } = await loadSettingsPageModule();
    
    const dashboardHTML = DashboardPage();
    const parser = new DOMParser();
    const doc = parser.parseFromString(dashboardHTML, 'text/html');

    const navItems = doc.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    navItems[6].classList.add('active'); // Settings is index 6

    const mainContent = doc.querySelector('main');
    mainContent.innerHTML = SettingsPage(AppState.settings);

    app.innerHTML = doc.body.innerHTML;
  }
}

window.switchSettingsSection = (sectionName) => {
  // 1. Hide all sections
  document.querySelectorAll('.settings-section').forEach(el => el.classList.add('hidden'));

  // 2. Show target section
  document.getElementById(`section-settings-${sectionName}`).classList.remove('hidden');

  // 3. Update buttons
  const activeClass = ['bg-indigo-50', 'text-indigo-700', 'border-indigo-100'];
  const inactiveClass = ['text-gray-600', 'hover:bg-gray-50'];

  document.querySelectorAll('[id^="btn-settings-"]').forEach(btn => {
    btn.classList.remove(...activeClass);
    btn.classList.add(...inactiveClass);
  });

  const activeBtn = document.getElementById(`btn-settings-${sectionName}`);
  activeBtn.classList.remove(...inactiveClass);
  activeBtn.classList.add(...activeClass);
};

window.saveSettings = async () => {
  // 1. Upload Logo if selected
  const logoInput = document.getElementById('setting_company_logo');
  if (logoInput && logoInput.files.length > 0) {
    const formData = new FormData();
    formData.append('file', logoInput.files[0]);
    try {
      const logoResult = await SettingsAPI.uploadLogo(formData);
      if (!logoResult.success) {
        alert('Logo upload failed: ' + logoResult.message);
        return;
      }
    } catch (e) {
      console.error("Logo upload error", e);
    }
  }

  const settings = {
    'whatsapp_api_url': document.getElementById('setting_whatsapp_api_url').value,
    'whatsapp_api_token': document.getElementById('setting_whatsapp_api_token').value,
    'whatsapp_sender': document.getElementById('setting_whatsapp_sender').value,
    'company_name': document.getElementById('setting_company_name').value,
    'currency': document.getElementById('setting_currency').value
  };

  try {
    const result = await SettingsAPI.update(settings);
    if (result.success) {
      alert('Settings saved successfully!');
      // Update local state if needed
      AppState.settings = { ...AppState.settings, ...settings };
      setCurrency(settings['currency']);
      await loadSettings(); // Reload to be sure
      render();
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Save settings error:', error);
    alert('Failed to save settings');
  }
};

// Make functions available globally
window.navigateTo = navigateTo;
window.handleLogout = handleLogout;
window.toggleLanguage = toggleLanguage;

// ==================== INIT ====================
// ==================== INIT ====================
async function init() {
  // Load Public Settings
  try {
    const publicResult = await SettingsAPI.getPublic();
    if (publicResult.success) {
      AppState.publicSettings = publicResult.data;
    }
  } catch (e) { console.error("Failed to load public settings", e); }

  // Check if user is logged in
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('access_token');

  if (user && token) {
    AppState.isAuthenticated = true;
    AppState.user = JSON.parse(user);
    AppState.currentPage = 'dashboard';

    // Start Notification Polling
    setTimeout(loadNotifications, 1000); // Initial load
    setInterval(loadNotifications, 60000); // Every minute
  }

  render();
}

// ==================== NOTIFICATIONS ====================
window.toggleNotifications = async () => {
  const dropdown = document.getElementById('notif-dropdown');
  dropdown.classList.toggle('hidden');
  if (!dropdown.classList.contains('hidden')) {
    await loadNotifications();
  }
};

async function loadNotifications() {
  try {
    const result = await NotificationsAPI.getUnread();
    if (result.success) {
      updateNotificationUI(result.data);
    }
  } catch (e) { console.error("Load notifs error", e); }
}

function updateNotificationUI(notifications) {
  const list = document.getElementById('notif-list');
  const badge = document.getElementById('notif-badge');
  const count = document.getElementById('notif-count');

  if (!list) return; // Not in dashboard

  count.textContent = notifications.length;

  if (notifications.length > 0) {
    badge.classList.remove('hidden');
    list.innerHTML = notifications.map(n => `
            <div class="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 items-start" onclick="markNotificationRead(${n.ID})">
                 <div class="p-2 bg-blue-50 rounded-full text-blue-600 mt-1 flex-shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <div>
                    <p class="text-sm font-semibold text-gray-800">${n.Title}</p>
                    <p class="text-xs text-gray-500 mt-1">${n.Message}</p>
                    <p class="text-[10px] text-gray-400 mt-2">${new Date(n.CreatedAt).toLocaleString()}</p>
                 </div>
            </div>
        `).join('');
  } else {
    badge.classList.add('hidden');
    list.innerHTML = `<div class="p-8 text-center text-gray-400 text-sm">No new notifications</div>`;
  }
}

window.markNotificationRead = async (id) => {
  await NotificationsAPI.markAsRead(id);
  await loadNotifications();
};

init();
