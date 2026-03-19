<template>
  <div class="space-y-4 sm:space-y-5">
    <div>
      <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Contrôle d'Accès</h1>
      <p class="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Vérifiez les accès des membres et les tickets.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
      <div class="lg:col-span-1 space-y-4 sm:space-y-5">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 sm:p-5 text-center">
          <div class="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-indigo-100 shadow-sm">
            <QrCodeIcon class="h-6 w-6 text-indigo-600" />
          </div>
          <h2 class="text-[13px] font-extrabold text-slate-900 mb-1 tracking-tight">Scanner un QR Code</h2>
          <p class="text-[10px] font-medium text-slate-500 mb-4">Utilisez la caméra pour scanner le QR code d'un membre ou un ticket.</p>
          
          <div v-if="!isScanning">
            <button
              @click="startScanner"
              class="w-full bg-indigo-600 text-white px-3 py-2.5 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold"
            >
              <QrCodeIcon class="h-3.5 w-3.5 mr-1.5" />
              Démarrer le scanner
            </button>
          </div>
          <div v-else class="space-y-3">
            <div id="reader" class="overflow-hidden rounded-xl border-2 border-indigo-100"></div>
            <button
              @click="stopScanner"
              class="w-full bg-slate-100 text-slate-700 px-3 py-2 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-all text-[11px] font-bold"
            >
              Annuler
            </button>
          </div>

          <div class="mt-5 pt-4 border-t border-slate-100">
            <h3 class="text-[11px] font-bold text-slate-700 mb-2 text-left">Saisie manuelle</h3>
            <form @submit.prevent="handleManualSubmit" class="flex flex-col sm:flex-row gap-2">
              <input
                v-model="manualCode"
                type="text"
                placeholder="Ex: MEMBER-123"
                class="flex-1 px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none"
              />
              <button
                type="submit"
                class="bg-slate-800 text-white px-3 py-2 rounded-lg hover:bg-slate-900 transition-all text-[11px] font-bold shadow-sm shadow-slate-200"
              >
                Vérifier
              </button>
            </form>
          </div>
        </div>

        <div v-if="scanResult" :class="['rounded-2xl p-4 border shadow-sm', scanResult.status === 'granted' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100']">
          <div class="flex flex-col items-center text-center">
            <CheckCircle v-if="scanResult.status === 'granted'" class="h-8 w-8 text-emerald-500 mb-2" />
            <XCircle v-else class="h-8 w-8 text-red-500 mb-2" />
            <h3 :class="['text-[14px] font-extrabold tracking-tight mb-0.5', scanResult.status === 'granted' ? 'text-emerald-800' : 'text-red-800']">
              {{ scanResult.status === 'granted' ? 'Accès Autorisé' : 'Accès Refusé' }}
            </h3>
            <p :class="['text-[11px] font-medium', scanResult.status === 'granted' ? 'text-emerald-600' : 'text-red-600']">
              {{ scanResult.message }}
            </p>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2">
        <!-- Desktop/Mobile Shared Historique -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col h-full">
          <div class="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 class="text-[12px] font-extrabold text-slate-900 tracking-tight flex items-center">
              <Clock class="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              Historique récent
            </h2>
          </div>
          <div class="overflow-x-auto flex-1">
            <table class="min-w-full divide-y divide-slate-100">
              <thead class="bg-slate-50/80">
                <tr>
                  <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Heure</th>
                  <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Identifiant</th>
                  <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-100/80">
                <tr v-for="log in logs" :key="log.id" class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-700">
                    {{ new Date(log.access_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div v-if="log.member_id">
                      <div class="text-[11px] font-bold text-slate-900">{{ log.member_name || `Membre #${log.member_id}` }}</div>
                      <div class="text-[9px] font-medium text-slate-500 mt-0.5">Abonné</div>
                    </div>
                    <div v-else>
                      <div class="text-[11px] font-bold text-slate-900">Ticket #{{ log.ticket_id }}</div>
                      <div class="text-[9px] font-medium text-slate-500 mt-0.5">Visiteur</div>
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span :class="['px-2 py-1 inline-flex text-[9px] font-bold rounded-md border', log.status === 'granted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100']">
                      {{ log.status === 'granted' ? 'Autorisé' : 'Refusé' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { QrCode as QrCodeIcon, CheckCircle, XCircle, Clock } from 'lucide-vue-next';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { parseJsonSafe } from '../lib/utils';

type AccessLog = {
  id: number;
  member_id: number | null;
  ticket_id: number | null;
  access_time: string;
  status: 'granted' | 'denied';
  member_name?: string;
};

const logs = ref<AccessLog[]>([]);

const scanResult = ref<{ status: 'granted' | 'denied', message: string } | null>(null);
const manualCode = ref('');
const isScanning = ref(false);
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
let scanner: Html5QrcodeScanner | null = null;

const fetchLogs = async () => {
  try {
    const res = await fetch('/api/access-logs', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    const data = await parseJsonSafe(res, []);
    if (res.ok) {
      logs.value = data;
    }
  } catch (error) {
    console.error('Error fetching logs:', error);
  }
};

onMounted(fetchLogs);

onUnmounted(() => {
  if (scanner) {
    scanner.clear();
  }
});

const verifyAccess = async (code: string) => {
  try {
    const res = await fetch('/api/verify-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qr_code: code }),
    });
    const data = await parseJsonSafe(res, {});
    
    scanResult.value = {
      status: data.granted ? 'granted' : 'denied',
      message: data.message
    };
    
    fetchLogs();
  } catch (error) {
    console.error('Error verifying access:', error);
    notificationStore.showNotification('Erreur lors de la vérification', 'error');
  }

  setTimeout(() => scanResult.value = null, 5000);
};

const handleManualSubmit = () => {
  if (manualCode.value) {
    verifyAccess(manualCode.value);
    manualCode.value = '';
  }
};

const startScanner = () => {
  isScanning.value = true;
  // Use nextTick equivalent trick with timeout to ensure DOM is ready
  setTimeout(() => {
    scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    
    scanner.render((decodedText: string) => {
      stopScanner();
      verifyAccess(decodedText);
    }, (_error: any) => {
      // Ignore scan errors
    });
  }, 100);
};

const stopScanner = () => {
  if (scanner) {
    scanner.clear();
    scanner = null;
  }
  isScanning.value = false;
};
</script>
