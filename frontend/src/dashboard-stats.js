// Dashboard Statistics API and UI
// Week 4 - Day 1: Real-time Dashboard with KPIs and Charts

import Chart from 'chart.js/auto';

const BASE_URL = 'http://localhost:8080/api/v1'

// Chart instances to destroy on re-render
let revenueChart = null;
let topProductsChart = null;
let orderStatusChart = null;
let inventoryChart = null;

// Dashboard Stats API
export const DashboardAPI = {
  async getStats() {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${BASE_URL}/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }
}

// Auto-refresh manager
let refreshInterval = null

export function startAutoRefresh(callback, intervalMs = 30000) {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
  
  // Initial load
  callback()
  
  // Set up interval
  refreshInterval = setInterval(callback, intervalMs)
  
  console.log(`✅ Dashboard auto-refresh enabled (every ${intervalMs/1000}s)`)
}

export function stopAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
    console.log('⏸️ Dashboard auto-refresh stopped')
  }
}

// Format numbers with commas
export function formatNumber(num) {
  if (num === null || num === undefined) return '0'
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

// Format currency
export function formatMoney(amount) {
  if (amount === null || amount === undefined) return '0.00'
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Get trend icon and color
export function getTrendIndicator(value) {
  if (value > 0) {
    return { icon: '↑', color: 'text-green-600', bg: 'bg-green-50' }
  } else if (value < 0) {
    return { icon: '↓', color: 'text-red-600', bg: 'bg-red-50' }
  }
  return { icon: '→', color: 'text-gray-600', bg: 'bg-gray-50' }
}

// Create KPI card HTML
export function createKPICard(config) {
  const { title, value, subtitle, icon, trend, loading } = config
  
  if (loading) {
    return `
      <div class="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div class="flex items-center justify-between mb-4">
          <div class="h-4 bg-gray-200 rounded w-24"></div>
          <div class="h-10 w-10 bg-gray-200 rounded"></div>
        </div>
        <div class="h-8 bg-gray-200 rounded w-32 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    `
  }
  
  const trendIndicator = trend !== undefined ? getTrendIndicator(trend) : null
  
  return `
    <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-600">${title}</h3>
        <div class="p-2 rounded-lg ${icon.bg}">
          <span class="text-2xl">${icon.emoji}</span>
        </div>
      </div>
      <div class="text-3xl font-bold text-gray-900 mb-2">${value}</div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500">${subtitle}</span>
        ${trendIndicator ? `
          <span class="${trendIndicator.bg} ${trendIndicator.color} px-2 py-1 rounded-full font-medium">
            ${trendIndicator.icon} ${Math.abs(trend).toFixed(1)}%
          </span>
        ` : ''}
      </div>
    </div>
  `
}

// Render dashboard stats
export async function renderDashboardStats(container) {
  // Show loading state
  container.innerHTML = `
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">📊 Dashboard Overview</h2>
        <div class="text-sm text-gray-500">
          <span class="inline-flex items-center">
            <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Auto-refreshing every 30s
          </span>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        ${[...Array(8)].map(() => createKPICard({ loading: true })).join('')}
      </div>
    </div>
  `
  
  try {
    const result = await DashboardAPI.getStats()
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to load dashboard stats')
    }
    
    const stats = result.data
    
    // Render KPI cards
    const kpiCards = [
      {
        title: 'Total Customers',
        value: formatNumber(stats.total_customers),
        subtitle: `${formatNumber(stats.active_customers)} active`,
        icon: { emoji: '👥', bg: 'bg-blue-50' },
        trend: stats.customer_growth_rate
      },
      {
        title: 'Sales Today',
        value: formatMoney(stats.total_sales_today),
        subtitle: 'Today\'s revenue',
        icon: { emoji: '💰', bg: 'bg-green-50' },
      },
      {
        title: 'Sales This Month',
        value: formatMoney(stats.total_sales_this_month),
        subtitle: `${formatNumber(stats.total_orders_this_month)} orders`,
        icon: { emoji: '📈', bg: 'bg-purple-50' },
        trend: stats.sales_growth_rate
      },
      {
        title: 'Pending Orders',
        value: formatNumber(stats.pending_orders_count),
        subtitle: 'Awaiting processing',
        icon: { emoji: '⏳', bg: 'bg-amber-50' },
      },
      {
        title: 'Total Products',
        value: formatNumber(stats.total_products),
        subtitle: `${formatNumber(stats.low_stock_products_count)} low stock`,
        icon: { emoji: '📦', bg: 'bg-indigo-50' },
      },
      {
        title: 'Inventory Value',
        value: formatMoney(stats.total_inventory_value),
        subtitle: 'Total stock worth',
        icon: { emoji: '💼', bg: 'bg-cyan-50' },
      },
      {
        title: 'Production Orders',
        value: formatNumber(stats.production_orders_in_progress),
        subtitle: 'In progress',
        icon: { emoji: '⚙️', bg: 'bg-orange-50' },
      },
      {
        title: 'Average Order',
        value: formatMoney(stats.average_order_value),
        subtitle: 'Per order value',
        icon: { emoji: '💳', bg: 'bg-pink-50' },
      },
    ]
    
    container.innerHTML = `
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">📊 Dashboard Overview</h2>
          <div class="text-sm text-gray-500">
            <span class="inline-flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Auto-refreshing every 30s
            </span>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          ${kpiCards.map(card => createKPICard(card)).join('')}
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">🏆 Top Selling Products</h3>
            <button onclick="window.exportChartImage('topProductsChart', 'top-products')" 
                    class="text-sm text-blue-600 hover:text-blue-800 font-medium">
              📥 Export
            </button>
          </div>
          <div class="relative" style="height: 300px;">
            <canvas id="topProductsChart"></canvas>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">📋 Orders Overview</h3>
            <button onclick="window.exportChartImage('orderStatusChart', 'order-status')" 
                    class="text-sm text-blue-600 hover:text-blue-800 font-medium">
              📥 Export
            </button>
          </div>
          <div class="relative" style="height: 300px;">
            <canvas id="orderStatusChart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">📊 Inventory Stock Levels</h3>
          <button onclick="window.exportChartImage('inventoryChart', 'inventory-levels')" 
                  class="text-sm text-blue-600 hover:text-blue-800 font-medium">
            📥 Export
          </button>
        </div>
        <div class="relative" style="height: 300px;">
          <canvas id="inventoryChart"></canvas>
        </div>
      </div>
      
      ${renderRevenueTrend(stats.revenue_trend)}
    `
    
    // Create charts after DOM is updated
    setTimeout(() => {
      if (stats.top_selling_products && stats.top_selling_products.length > 0) {
        createTopProductsChart(stats.top_selling_products);
      }
      createOrderStatusChart(stats);
      createInventoryChart(stats);
      if (stats.revenue_trend && stats.revenue_trend.length > 0) {
        createRevenueChart(stats.revenue_trend);
      }
    }, 100);
    
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)
    container.innerHTML = `
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <span class="text-4xl mb-4 block">⚠️</span>
        <h3 class="text-lg font-semibold text-red-900 mb-2">Failed to Load Dashboard</h3>
        <p class="text-red-700 mb-4">${error.message}</p>
        <button onclick="location.reload()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Retry
        </button>
      </div>
    `
  }
}

// Render revenue trend section
function renderRevenueTrend(trend) {
  if (!trend || trend.length === 0) {
    return ''
  }
  
  return `
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">📈 Revenue Trend (Last 7 Days)</h3>
        <button onclick="window.exportChartImage('revenueChart', 'revenue-trend')" 
                class="text-sm text-blue-600 hover:text-blue-800 font-medium">
          📥 Export
        </button>
      </div>
      <div class="relative" style="height: 300px;">
        <canvas id="revenueChart"></canvas>
      </div>
    </div>
  `
}

// Create revenue trend chart
function createRevenueChart(trend) {
  // Destroy previous chart if exists
  if (revenueChart) {
    revenueChart.destroy();
  }
  
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;
  
  const labels = trend.map(d => {
    const date = new Date(d.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  
  const revenueData = trend.map(d => d.revenue);
  const ordersData = trend.map(d => d.orders);
  
  revenueChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Revenue',
          data: revenueData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Orders',
          data: ordersData,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              weight: '500'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.datasetIndex === 0) {
                label += formatMoney(context.parsed.y);
              } else {
                label += context.parsed.y;
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Revenue',
            font: {
              weight: '600'
            }
          },
          ticks: {
            callback: function(value) {
              return formatMoney(value);
            }
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Orders',
            font: {
              weight: '600'
            }
          },
          grid: {
            drawOnChartArea: false,
          },
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Create top products chart
function createTopProductsChart(products) {
  // Destroy previous chart if exists
  if (topProductsChart) {
    topProductsChart.destroy();
  }
  
  const ctx = document.getElementById('topProductsChart');
  if (!ctx) return;
  
  const labels = products.map(p => p.product_name.length > 20 ? p.product_name.substring(0, 20) + '...' : p.product_name);
  const quantities = products.map(p => p.quantity_sold);
  const revenues = products.map(p => p.revenue);
  
  // Generate gradient colors
  const colors = [
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(16, 185, 129, 0.8)',   // Green
    'rgba(245, 158, 11, 0.8)',   // Amber
    'rgba(139, 92, 246, 0.8)',   // Purple
    'rgba(236, 72, 153, 0.8)',   // Pink
  ];
  
  topProductsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Quantity Sold',
        data: quantities,
        backgroundColor: colors,
        borderColor: colors.map(c => c.replace('0.8', '1')),
        borderWidth: 2,
        borderRadius: 6,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            afterLabel: function(context) {
              const revenue = revenues[context.dataIndex];
              return 'Revenue: ' + formatMoney(revenue);
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Quantity Sold',
            font: {
              weight: '600'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Create order status pie chart
function createOrderStatusChart(stats) {
  // Destroy previous chart if exists
  if (orderStatusChart) {
    orderStatusChart.destroy();
  }
  
  const ctx = document.getElementById('orderStatusChart');
  if (!ctx) return;
  
  const data = {
    labels: ['Pending', 'Completed Today', 'Total This Month'],
    datasets: [{
      data: [
        stats.pending_orders_count,
        stats.completed_orders_today,
        stats.total_orders_this_month
      ],
      backgroundColor: [
        'rgba(245, 158, 11, 0.8)',  // Amber for pending
        'rgba(16, 185, 129, 0.8)',  // Green for completed
        'rgba(59, 130, 246, 0.8)',  // Blue for total
      ],
      borderColor: [
        'rgb(245, 158, 11)',
        'rgb(16, 185, 129)',
        'rgb(59, 130, 246)',
      ],
      borderWidth: 2,
    }]
  };
  
  orderStatusChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12,
              weight: '500'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          }
        }
      }
    }
  });
}

// Create inventory stock levels chart (Bar Chart)
function createInventoryChart(stats) {
  // Destroy previous chart if exists
  if (inventoryChart) {
    inventoryChart.destroy();
  }
  
  const ctx = document.getElementById('inventoryChart');
  if (!ctx) return;
  
  const data = {
    labels: ['Total Products', 'In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [{
      label: 'Products Count',
      data: [
        stats.total_products,
        stats.total_products - stats.low_stock_products_count - stats.out_of_stock_count,
        stats.low_stock_products_count,
        stats.out_of_stock_count
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.6)',   // Blue - Total
        'rgba(16, 185, 129, 0.6)',   // Green - In Stock
        'rgba(245, 158, 11, 0.6)',   // Amber - Low Stock
        'rgba(239, 68, 68, 0.6)',    // Red - Out of Stock
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)',
      ],
      borderWidth: 2,
      borderRadius: 8,
    }]
  };
  
  inventoryChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function(context) {
              const value = context.parsed.y;
              const total = stats.total_products;
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${value} products (${percentage}%)`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Products',
            font: {
              weight: '600'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Export chart as image
window.exportChartImage = function(chartId, filename) {
  const canvas = document.getElementById(chartId);
  if (!canvas) {
    console.error('Chart not found:', chartId);
    return;
  }
  
  // Create a link element
  const link = document.createElement('a');
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}


