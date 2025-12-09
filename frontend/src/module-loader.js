/**
 * Dynamic Module Loader
 * Handles lazy loading of heavy modules to improve initial load time
 * 
 * Performance Strategy:
 * - Load core modules immediately (login, state, i18n)
 * - Lazy load page modules on navigation
 * - Cache loaded modules for instant subsequent access
 */

// Module cache to avoid reloading
const moduleCache = new Map();

// Loading state tracking
const loadingState = new Map();

/**
 * Dynamically import a module with caching
 * @param {string} moduleName - Name of module to load
 * @param {Function} importFn - Dynamic import function
 * @returns {Promise<any>} - Loaded module
 */
export async function loadModule(moduleName, importFn) {
  // Return cached module if available
  if (moduleCache.has(moduleName)) {
    console.log(`✅ Module '${moduleName}' loaded from cache`);
    return moduleCache.get(moduleName);
  }

  // If already loading, return the existing promise
  if (loadingState.has(moduleName)) {
    console.log(`⏳ Module '${moduleName}' already loading, waiting...`);
    return loadingState.get(moduleName);
  }

  // Start loading
  console.log(`📦 Loading module '${moduleName}'...`);
  const loadPromise = importFn()
    .then(module => {
      moduleCache.set(moduleName, module);
      loadingState.delete(moduleName);
      console.log(`✅ Module '${moduleName}' loaded successfully`);
      return module;
    })
    .catch(error => {
      loadingState.delete(moduleName);
      console.error(`❌ Failed to load module '${moduleName}':`, error);
      throw error;
    });

  loadingState.set(moduleName, loadPromise);
  return loadPromise;
}

/**
 * Load Dashboard Stats Module (lazy)
 */
export async function loadDashboardStatsModule() {
  return loadModule('dashboard-stats', () => import('./dashboard-stats.js'));
}

/**
 * Load Customers Module (lazy)
 */
export async function loadCustomersModule() {
  return loadModule('customers', () => import('./customers.js'));
}

/**
 * Load Customers Page Module (lazy)
 */
export async function loadCustomersPageModule() {
  return loadModule('pages-customers', () => import('./pages-customers.js'));
}

/**
 * Load Customer Profile Page Module (lazy)
 */
export async function loadCustomerProfileModule() {
  return loadModule('pages-customer-profile', () => import('./pages-customer-profile.js'));
}

/**
 * Load Sales Module (lazy)
 */
export async function loadSalesModule() {
  return loadModule('sales', () => import('./sales.js'));
}

/**
 * Load Sales Page Module (lazy)
 */
export async function loadSalesPageModule() {
  return loadModule('pages-sales', () => import('./pages-sales.js'));
}

/**
 * Load Inventory Module (lazy)
 */
export async function loadInventoryModule() {
  return loadModule('inventory', () => import('./inventory.js'));
}

/**
 * Load Inventory Page Module (lazy)
 */
export async function loadInventoryPageModule() {
  return loadModule('pages-inventory', () => import('./pages-inventory.js'));
}

/**
 * Load Production Module (lazy)
 */
export async function loadProductionModule() {
  return loadModule('production', () => import('./production.js'));
}

/**
 * Load Production Page Module (lazy)
 */
export async function loadProductionPageModule() {
  return loadModule('pages-production', () => import('./pages-production.js'));
}

/**
 * Load Reports Module (lazy)
 */
export async function loadReportsModule() {
  return loadModule('reports', () => import('./reports.js'));
}

/**
 * Load Reports Page Module (lazy)
 */
export async function loadReportsPageModule() {
  return loadModule('pages-reports', () => import('./pages-reports.js'));
}

/**
 * Load Settings Module (lazy)
 */
export async function loadSettingsModule() {
  return loadModule('settings', () => import('./settings.js'));
}

/**
 * Load Settings Page Module (lazy)
 */
export async function loadSettingsPageModule() {
  return loadModule('pages-settings', () => import('./pages-settings.js'));
}

/**
 * Preload a module in the background (for predictive loading)
 * @param {string} moduleName - Name of module
 * @param {Function} importFn - Import function
 */
export function preloadModule(moduleName, importFn) {
  if (!moduleCache.has(moduleName) && !loadingState.has(moduleName)) {
    console.log(`🔮 Preloading module '${moduleName}' in background...`);
    loadModule(moduleName, importFn).catch(() => {
      // Silently fail for preloads
    });
  }
}

/**
 * Get loading statistics
 * @returns {object} Stats about loaded modules
 */
export function getLoadingStats() {
  return {
    cachedModules: Array.from(moduleCache.keys()),
    loadingModules: Array.from(loadingState.keys()),
    totalCached: moduleCache.size,
    totalLoading: loadingState.size
  };
}

/**
 * Clear module cache (useful for development/hot reload)
 */
export function clearCache() {
  const count = moduleCache.size;
  moduleCache.clear();
  loadingState.clear();
  console.log(`🗑️ Cleared ${count} cached modules`);
}

/**
 * Show loading spinner while module loads
 * @param {HTMLElement} container - Container to show spinner in
 */
export function showModuleLoadingSpinner(container) {
  if (!container) return;
  
  container.innerHTML = `
    <div class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-indigo-600 mb-4"></div>
        <p class="text-gray-600 text-lg font-medium">تحميل البيانات...</p>
        <p class="text-gray-400 text-sm mt-2">Loading module...</p>
      </div>
    </div>
  `;
}

/**
 * Predictive preloading based on current page
 * Load likely next pages in background
 */
export function predictivePreload(currentPage) {
  const preloadMap = {
    'customers': ['pages-customer-profile', 'sales'],
    'sales': ['customers', 'inventory'],
    'inventory': ['production', 'sales'],
    'production': ['inventory'],
    'reports': ['customers', 'sales', 'inventory'],
    'settings': []
  };

  const toPreload = preloadMap[currentPage] || [];
  toPreload.forEach(moduleName => {
    // Map module names to their loader functions
    const loaders = {
      'pages-customer-profile': loadCustomerProfileModule,
      'sales': loadSalesModule,
      'customers': loadCustomersModule,
      'inventory': loadInventoryModule,
      'production': loadProductionModule
    };

    const loader = loaders[moduleName];
    if (loader) {
      setTimeout(() => loader(), 100); // Small delay to not block current page
    }
  });
}
