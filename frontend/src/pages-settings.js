
import { t } from './i18n.js';

const SettingsPage = (settings) => {
  return `
    <div class="space-y-6">
      <div class="flex items-center justify-between pb-6 border-b border-gray-200">
        <div>
           <h1 class="text-3xl font-bold text-gray-900">System Settings</h1>
           <p class="text-gray-500 mt-1">Manage your application preferences and integrations.</p>
        </div>
        <button onclick="saveSettings()" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
          Save Changes
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
        <!-- Settings Sidebar -->
        <div class="md:col-span-3 space-y-2">
           <button onclick="switchSettingsSection('general')" id="btn-settings-general" class="w-full text-left px-4 py-3 rounded-lg font-medium transition-all bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-3">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
             General
           </button>
           <button onclick="switchSettingsSection('integrations')" id="btn-settings-integrations" class="w-full text-left px-4 py-3 rounded-lg font-medium transition-all text-gray-600 hover:bg-gray-50 flex items-center gap-3">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
             Integrations
           </button>
        </div>

        <!-- Content Area -->
        <div class="md:col-span-9">
          
          <!-- SECTION: General -->
          <div id="section-settings-general" class="settings-section space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <h3 class="text-xl font-bold text-gray-900 mb-6">General Preferences</h3>
               
               <div class="grid grid-cols-1 gap-6 max-w-2xl">
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
                   <div class="flex items-center gap-4">
                      ${settings['company_logo'] ? `<img src="http://localhost:8080${settings['company_logo']}" class="h-12 w-12 object-contain bg-gray-50 rounded-lg border border-gray-200">` : ''}
                      <input type="file" id="setting_company_logo" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
                   </div>
                   <p class="mt-1 text-xs text-gray-500">Recommended size: 200x200px (PNG, JPG)</p>
                </div>
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                   <input type="text" id="setting_company_name" value="${settings['company_name'] || 'ERP System'}" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5 border">
                   <p class="mt-1 text-xs text-gray-500">This name will appear on invoices and reports.</p>
                </div>
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                    <select id="setting_currency" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5 border">
                       <option value="EGP" ${settings['currency'] === 'EGP' ? 'selected' : ''}>EGP (Egyptian Pound)</option>
                       <option value="USD" ${settings['currency'] === 'USD' ? 'selected' : ''}>USD (US Dollar)</option>
                       <option value="SAR" ${settings['currency'] === 'SAR' ? 'selected' : ''}>SAR (Saudi Riyal)</option>
                    </select>
                </div>
               </div>
             </div>
          </div>

          <!-- SECTION: Integrations -->
          <div id="section-settings-integrations" class="settings-section hidden space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div class="flex items-center justify-between mb-6">
                 <div>
                    <h3 class="text-xl font-bold text-gray-900">WhatsApp Integration</h3>
                    <p class="text-sm text-gray-500">Connect your WhatsApp Business API provided by Meta or 3rd party.</p>
                 </div>
                 <div class="p-2 bg-green-100 text-green-600 rounded-lg">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-8.683-2.03-9.676-.272-.099-.47-.149-.669-.149-.198 0-.42.001-.644.001-.223 0-.586.085-.892.41-.307.325-1.18.324-1.18 2.766 0 1.441 1.05 2.833 1.197 3.033.149.2 2.067 3.156 5.013 4.426.701.302 1.248.483 1.676.618.704.223 1.346.191 1.854.116.57-.084 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
                 </div>
              </div>
              
              <div class="space-y-4 max-w-2xl">
                <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">API Endpoint URL</label>
                   <input type="text" id="setting_whatsapp_api_url" value="${settings['whatsapp_api_url'] || ''}" class="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5 border" placeholder="https://api.whatsapp-provider.com/send">
                </div>
                <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">API Token / Key</label>
                   <input type="password" id="setting_whatsapp_api_token" value="${settings['whatsapp_api_token'] || ''}" class="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5 border" placeholder="Your API Secret Token">
                </div>
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">Sender Phone Number</label>
                   <input type="text" id="setting_whatsapp_sender" value="${settings['whatsapp_sender'] || ''}" class="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5 border" placeholder="+201xxxxxxxxx">
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    `;
};

export { SettingsPage };
