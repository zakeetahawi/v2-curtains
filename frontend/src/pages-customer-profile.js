import { t, formatCurrency } from './i18n.js';

const CustomerProfilePage = (customer, orders, activities = [], documents = []) => {
  const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const lastOrderDate = orders.length > 0 ? new Date(orders[0].created_at).toLocaleDateString() : '-';

  // Sort activities by date desc
  const sortedActivities = activities ? activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];

  return `
    <div class="space-y-6">
      <!-- Header with Tabs -->
      <div class="bg-white rounded-xl shadow-sm p-6 pb-0">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <button onclick="navigateTo('customers')" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">${customer.name}</h1>
              <p class="text-gray-600 mt-1">${customer.code} • ${t('customers.type')}: ${customer.type}</p>
            </div>
          </div>
          <div class="flex gap-3">
             ${customer.phone ? `
            <a href="https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-8.683-2.03-9.676-.272-.099-.47-.149-.669-.149-.198 0-.42.001-.644.001-.223 0-.586.085-.892.41-.307.325-1.18.324-1.18 2.766 0 1.441 1.05 2.833 1.197 3.033.149.2 2.067 3.156 5.013 4.426.701.302 1.248.483 1.676.618.704.223 1.346.191 1.854.116.57-.084 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
              WhatsApp
            </a>
          ` : ''}
          ${(customer.city || customer.governorate) ? `
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${customer.address || ''} ${customer.city || ''} ${customer.governorate || ''} Egypt`)}" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Location
            </a>
          ` : ''}
            <button onclick="editCustomer(${customer.id})" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
              Edit
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex gap-6 border-b border-gray-200">
          <button onclick="switchProfileTab('overview')" id="tab-overview" class="pb-4 px-2 border-b-2 border-indigo-600 text-indigo-600 font-medium whitespace-nowrap">
            Overview
          </button>
          <button onclick="switchProfileTab('activities')" id="tab-activities" class="pb-4 px-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap">
            Activity Log
          </button>
          <button onclick="switchProfileTab('documents')" id="tab-documents" class="pb-4 px-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap">
            Documents
          </button>
        </div>
      </div>

      <!-- Overview Content -->
      <div id="content-overview" class="space-y-6">
        <!-- Info Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Customer Details -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-gray-500 text-sm font-medium uppercase mb-4">Contact Info</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span class="text-gray-900">${customer.email || '-'}</span>
              </div>
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span class="text-gray-900">${customer.phone || '-'}</span>
              </div>
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span class="text-gray-900">${customer.city || ''}, ${customer.governorate || 'Egypt'}</span>
              </div>
            </div>
          </div>

          <!-- Financial Summary -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-gray-500 text-sm font-medium uppercase mb-4">Financials</h3>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Total Spent</span>
                <span class="text-xl font-bold text-gray-900">${formatCurrency(totalSpent)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total Orders</span>
                <span class="font-semibold text-gray-900">${orders.length}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Last Order</span>
                <span class="text-gray-900">${lastOrderDate}</span>
              </div>
            </div>
          </div>

           <!-- Status -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-gray-500 text-sm font-medium uppercase mb-4">Status</h3>
             <div class="flex gap-2">
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">${customer.type}</span>
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">${customer.status}</span>
             </div>
          </div>
        </div>

        <!-- Order History -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-bold text-gray-900">Recent Orders</h3>
          </div>
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${orders.map(order => `
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm font-medium text-indigo-600">${order.order_number}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">${new Date(order.created_at).toLocaleDateString()}</td>
                  <td class="px-6 py-4"><span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">${order.status}</span></td>
                  <td class="px-6 py-4 text-sm font-bold text-gray-900">${formatCurrency(order.total_amount)}</td>
                </tr>
              `).join('')}
              ${orders.length === 0 ? '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No orders found</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Activities Content -->
      <div id="content-activities" class="hidden space-y-6">
        <!-- ... (Keep exisiting activities content) ... -->
        <!-- Add Activity Form & Feed -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">${t('crm.addActivity')}</h3>
            <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">${t('crm.activityHelp')}</span>
          </div>
          <div class="space-y-4">
             <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="activityType" value="note" checked class="text-indigo-600 focus:ring-indigo-500" onchange="toggleReminderDate()">
                    <span class="text-sm text-gray-700">${t('crm.activityTypes.note')}</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="activityType" value="call" class="text-indigo-600 focus:ring-indigo-500" onchange="toggleReminderDate()">
                    <span class="text-sm text-gray-700">${t('crm.activityTypes.call')}</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="activityType" value="meeting" class="text-indigo-600 focus:ring-indigo-500" onchange="toggleReminderDate()">
                    <span class="text-sm text-gray-700">${t('crm.activityTypes.meeting')}</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="activityType" value="alert" class="text-indigo-600 focus:ring-indigo-500" onchange="toggleReminderDate()">
                    <span class="text-sm text-gray-700 flex items-center gap-1">
                      ${t('crm.activityTypes.alert')}
                      <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.03-.967-.272-.099-.47-.149-.669.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
                    </span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="activityType" value="reminder" class="text-indigo-600 focus:ring-indigo-500" onchange="toggleReminderDate()">
                    <span class="text-sm text-gray-700 flex items-center gap-1">
                      ${t('crm.activityTypes.reminder')}
                      <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </span>
                  </label>
                </div>
             </div>
             
             <!-- Reminder Date/Time Field (Hidden by default) -->
             <div id="reminderDateField" class="hidden">
               <label class="block text-sm font-medium text-gray-700 mb-1">
                 ${t('crm.reminderDate')}
                 <span class="text-red-500">*</span>
               </label>
               <input type="datetime-local" id="reminderDate" 
                 class="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                 min="${new Date().toISOString().slice(0, 16)}">
               <p class="text-xs text-gray-500 mt-1">${t('crm.reminderHelp')}</p>
             </div>
             
             <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">
                 ${t('crm.description')}
                 <span class="text-red-500">*</span>
               </label>
               <textarea id="activityDesc" rows="3" 
                 class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" 
                 placeholder="${t('crm.descriptionPlaceholder')}"></textarea>
             </div>
             <div class="flex justify-end gap-2">
               <button type="button" onclick="document.getElementById('activityDesc').value=''; document.getElementById('reminderDate').value=''; document.querySelector('input[name=activityType][value=note]').checked=true; toggleReminderDate();" 
                 class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                 ${t('common.clear')}
               </button>
               <button onclick="saveActivity(${customer.id})" 
                 class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                 ${t('common.save')}
               </button>
             </div>
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">${t('crm.activityHistory')}</h3>
          <div class="space-y-4">
            ${sortedActivities.length > 0 ? sortedActivities.map(activity => `
               <div class="bg-gray-50 rounded-xl p-4 border-l-4 ${getActivityColor(activity.type)} hover:shadow-md transition-shadow">
                 <div class="flex justify-between items-start">
                   <div class="flex items-center gap-3 mb-2">
                     <span class="px-3 py-1 text-xs font-bold capitalize rounded-full ${getActivityBadge(activity.type)}">
                       ${t('crm.activityTypes.' + activity.type)}
                     </span>
                     <span class="text-xs text-gray-500">${new Date(activity.created_at).toLocaleString()}</span>
                     ${activity.reminder_date && !activity.is_completed ? `
                       <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center gap-1">
                         <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         ${new Date(activity.reminder_date).toLocaleString()}
                       </span>
                     ` : ''}
                     ${activity.is_completed ? `
                       <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                         ${t('crm.completed')}
                       </span>
                     ` : ''}
                   </div>
                 </div>
                 <p class="text-gray-700 whitespace-pre-wrap">${activity.description}</p>
               </div>
            `).join('') : `
               <div class="text-center py-12 text-gray-400">
                 <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 <p>${t('crm.noActivities')}</p>
               </div>
            `}
          </div>
        </div>
      </div>

      <!-- Documents Content -->
      <div id="content-documents" class="hidden space-y-6">
        <!-- Upload Form -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Upload Document</h3>
          <div class="flex gap-4 items-end">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
              <input type="text" id="docTitle" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" placeholder="e.g. Contract, CR, ID">
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">File</label>
              <input type="file" id="docFile" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all">
            </div>
            <button onclick="uploadDocument(${customer.id})" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors h-10">
              Upload
            </button>
          </div>
        </div>

        <!-- Documents Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${documents && documents.length > 0 ? documents.map(doc => `
            <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div class="h-32 bg-gray-50 flex items-center justify-center border-b border-gray-100 relative group">
                ${doc.file_path.match(/\.(jpg|jpeg|png|gif)$/i) ? `
                  <img src="http://localhost:8080${doc.file_path}" alt="${doc.title}" class="h-full w-full object-cover">
                ` : `
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                `}
                <a href="http://localhost:8080${doc.file_path}" target="_blank" class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                    <span class="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">View</span>
                </a>
              </div>
              <div class="p-4">
                <h4 class="font-bold text-gray-900 truncate">${doc.title}</h4>
                <p class="text-xs text-gray-500 mt-1">${new Date(doc.uploaded_at).toLocaleDateString()}</p>
              </div>
            </div>
          `).join('') : `
            <div class="col-span-3 text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
              No documents uploaded yet.
            </div>
          `}
        </div>
      </div>
    </div>
  `;
};

const getActivityColor = (type) => {
  switch (type) {
    case 'call': return 'border-blue-500';
    case 'meeting': return 'border-purple-500';
    case 'alert': return 'border-red-500';
    case 'reminder': return 'border-yellow-500';
    default: return 'border-gray-400';
  }
};

const getActivityBadge = (type) => {
  switch (type) {
    case 'note': return 'bg-gray-200 text-gray-800';
    case 'call': return 'bg-blue-100 text-blue-800';
    case 'meeting': return 'bg-purple-100 text-purple-800';
    case 'alert': return 'bg-red-100 text-red-800';
    case 'reminder': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-200 text-gray-800';
  }
};

// Toggle Reminder Date Field
window.toggleReminderDate = () => {
  const selectedType = document.querySelector('input[name="activityType"]:checked').value;
  const reminderField = document.getElementById('reminderDateField');
  
  if (selectedType === 'reminder') {
    reminderField.classList.remove('hidden');
    document.getElementById('reminderDate').required = true;
  } else {
    reminderField.classList.add('hidden');
    document.getElementById('reminderDate').required = false;
  }
};

export { CustomerProfilePage };
