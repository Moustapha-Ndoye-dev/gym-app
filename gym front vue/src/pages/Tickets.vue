<template>
  <div class="space-y-4 sm:space-y-5">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Tickets d'accès</h1>
        <p class="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Générez des accès ponctuels pour vos clients.</p>
      </div>
      <button
        @click="openModal"
        class="bg-indigo-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all text-[11px] font-black uppercase tracking-wider w-full sm:w-auto"
      >
        <Plus class="h-4 w-4 mr-2" />
        Nouveau ticket
      </button>
    </div>

    <!-- Mobile View (Cards) -->
    <div class="lg:hidden space-y-3">
      <div
        v-if="tickets.length === 0"
        class="bg-white p-12 rounded-2xl shadow-sm border border-slate-200/60 text-center"
      >
        <TicketIcon class="h-10 w-10 text-slate-200 mx-auto mb-3" />
        <p class="text-[13px] font-black text-slate-900 leading-tight">Aucun ticket généré</p>
        <p class="text-[11px] text-slate-500 mt-1">Créez un ticket pour commencer.</p>
      </div>
      <div v-else v-for="ticket in tickets" :key="ticket.id" class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col gap-3">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm shrink-0">
              <TicketIcon class="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <div class="text-[14px] font-black text-slate-900 leading-tight mb-0.5">{{ ticket.type }}</div>
              <div class="text-[11px] font-bold text-slate-500">#{{ ticket.id }}</div>
            </div>
          </div>
          <div v-html="getStatusBadgeHTML(ticket.status)"></div>
        </div>
        <div class="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 mt-1">
          <div>
            <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Prix</div>
            <div class="text-[14px] font-black text-slate-900">{{ ticket.price.toFixed(0) }} FCFA</div>
          </div>
          <div>
            <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</div>
            <div class="text-[11px] font-bold text-slate-700">{{ formatDate(ticket.created_at) }}</div>
          </div>
        </div>
        <div class="flex gap-2 pt-3 border-t border-slate-100 mt-1">
          <button @click="openViewModal(ticket)" class="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 text-slate-700 rounded-xl text-[11px] font-black uppercase hover:bg-slate-200 transition-colors">
            <QrCode class="h-4 w-4" /> Voir QR
          </button>
          <button @click="handleDelete(ticket.id)" class="px-3 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors border border-red-100">
            <Trash2 class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop View (Table) -->
    <div class="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100">
          <thead class="bg-slate-50/50">
            <tr>
              <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type de Ticket</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date de création</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
              <th class="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-50">
            <tr v-if="tickets.length === 0">
              <td colspan="6" class="px-6 py-12 text-center">
                <TicketIcon class="h-12 w-12 text-slate-100 mx-auto mb-3" />
                <p class="text-[14px] font-black text-slate-900 leading-tight">Aucun ticket disponible</p>
                <p class="text-[12px] text-slate-500 mt-1">Commencez par générer un nouveau ticket d'accès.</p>
              </td>
            </tr>
            <tr v-else v-for="ticket in tickets" :key="ticket.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4 whitespace-nowrap text-[12px] font-black text-slate-400">
                #{{ ticket.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <TicketIcon class="h-4.5 w-4.5" />
                  </div>
                  <span class="text-[13px] font-black text-slate-900">{{ ticket.type }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-[13px] font-black text-slate-900">
                  {{ ticket.price.toFixed(0) }} FCFA
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-[12px] font-bold text-slate-500">
                {{ formatDate(ticket.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-html="getStatusBadgeHTML(ticket.status)"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-[11px] font-medium">
                <button @click="openViewModal(ticket)" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all mr-1" title="Visualiser le ticket">
                  <QrCode class="h-4 w-4" />
                </button>
                <button @click="handleDelete(ticket.id)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal: Generation -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50">
      <div class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-in zoom-in duration-200">
        <template v-if="!generatedTicketId">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-black text-slate-900 tracking-tight">Générer un ticket</h2>
            <button @click="isModalOpen = false" class="p-2 hover:bg-slate-100 rounded-full transition-colors"><X class="h-5 w-5 text-slate-400" /></button>
          </div>
          <form @submit.prevent="handleGenerate" class="space-y-4">
            <div>
              <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Type d'accès</label>
              <select v-model="newTicket.type" class="block w-full px-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[13px] font-bold text-slate-900 transition-all outline-none">
                <option value="Séance Unique">Séance Unique</option>
                <option value="Pass Journée">Pass Journée</option>
                <option value="Semaine Découverte">Semaine Découverte</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Prix (FCFA)</label>
              <input v-model.number="newTicket.price" type="number" required min="0" class="block w-full px-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[13px] font-bold text-slate-900 transition-all outline-none" />
            </div>
            <div class="flex gap-3 mt-8 pt-4 border-t border-slate-50">
              <button type="button" @click="isModalOpen = false" class="flex-1 px-4 py-3 rounded-2xl text-[12px] font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-wider">Annuler</button>
              <button type="submit" class="flex-[2] px-4 py-3 bg-indigo-600 text-white rounded-2xl text-[12px] font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-wider">Générer</button>
            </div>
          </form>
        </template>
        <template v-else>
          <div class="text-center py-4">
            <div class="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
              <CheckCircle class="h-8 w-8" />
            </div>
            <h2 class="text-xl font-black text-slate-900 mb-1 tracking-tight">Ticket Prêt !</h2>
            <p class="text-[12px] font-bold text-slate-500 mb-6">Le ticket #{{ generatedTicketId }} a été créé.</p>
            
            <div class="space-y-2">
              <button @click="viewGeneratedTicket" class="w-full bg-indigo-600 text-white px-4 py-3.5 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all text-[12px] font-black uppercase tracking-wider">
                <QrCode class="h-4 w-4 mr-2" />
                Voir le ticket
              </button>
              <button @click="isModalOpen = false" class="w-full bg-slate-100 text-slate-600 px-4 py-3.5 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-all text-[12px] font-black uppercase tracking-wider">
                Fermer
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal: View Ticket (Visual) -->
    <div v-if="isViewModalOpen && currentTicket" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50">
      <div class="bg-white rounded-[2.5rem] p-0 max-w-xs w-full shadow-2xl relative overflow-hidden border border-slate-100 animate-in zoom-in duration-300">
        <!-- Header Ticket Section -->
        <div class="bg-slate-900 p-8 pb-12 text-center relative">
           <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-600 opacity-20 rounded-full -mr-16 -mt-16"></div>
           <div class="absolute bottom-0 left-0 w-24 h-24 bg-purple-600 opacity-20 rounded-full -ml-12 -mb-12"></div>
           <h3 class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3 relative z-10">Access Pass</h3>
           <div class="text-white text-3xl font-black tracking-tighter relative z-10 mb-1">{{ currentTicket.type }}</div>
           <div class="text-slate-400 text-[11px] font-bold relative z-10">Valable pour une personne</div>
        </div>
        
        <!-- Ticket Body Section (Detachable look) -->
        <div class="bg-white px-8 pb-8 -mt-6 relative z-10 rounded-t-[2rem]">
           <div class="flex justify-center -mt-10 mb-6">
              <div class="bg-white p-3 rounded-2xl shadow-xl border border-slate-50">
                 <QRCodeVue :value="'TICKET-' + currentTicket.id" :size="160" level="H" />
              </div>
           </div>

           <div class="space-y-4 mb-8">
              <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                 <span class="text-[10px] font-black text-slate-400 uppercase">ID Ticket</span>
                 <span class="text-[13px] font-black text-slate-900">#{{ currentTicket.id }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                 <span class="text-[10px] font-black text-slate-400 uppercase">Émis le</span>
                 <span class="text-[11px] font-bold text-slate-900">{{ formatDate(currentTicket.created_at) }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                 <span class="text-[10px] font-black text-slate-400 uppercase">Prix</span>
                 <span class="text-[14px] font-black text-indigo-600">{{ currentTicket.price.toFixed(0) }} FCFA</span>
              </div>
           </div>

           <div class="flex gap-2">
              <button @click="window.print()" class="flex-1 bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                 <Printer class="h-4 w-4 mr-2" />
                 <span class="text-[11px] font-black uppercase tracking-wider">Imprimer</span>
              </button>
              <button @click="isViewModalOpen = false" class="px-5 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors">
                 <X class="h-5 w-5" />
              </button>
           </div>
           
           <p class="mt-6 text-[9px] text-slate-400 text-center font-bold uppercase tracking-widest">
              Merci de présenter ce code à l'entrée
           </p>
        </div>
        
        <!-- Scalloped edge effect decoration -->
        <div class="absolute top-[35%] left-0 w-4 h-8 bg-slate-900/60 rounded-r-full -ml-2"></div>
        <div class="absolute top-[35%] right-0 w-4 h-8 bg-slate-900/60 rounded-l-full -mr-2"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus, Trash2, Ticket as TicketIcon, QrCode, Smartphone, Send, Printer, X, CheckCircle } from 'lucide-vue-next';
import QRCodeVue from 'qrcode.vue';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { useConfirmStore } from '../stores/confirm';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const confirmStore = useConfirmStore();

type Ticket = {
  id: number;
  type: string;
  price: number;
  status: 'valid' | 'used' | 'expired';
  created_at: string;
};

const tickets = ref<Ticket[]>([]);
const isModalOpen = ref(false);
const isViewModalOpen = ref(false);
const newTicket = ref({ type: 'Séance Unique', price: 1000 });
const currentTicket = ref<Ticket | null>(null);
const generatedTicketId = ref<number | null>(null);

const fetchTickets = async () => {
  try {
    const res = await fetch('/api/tickets', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    const data = await res.json();
    if (res.ok) tickets.value = data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
  }
};

onMounted(fetchTickets);

const openModal = () => {
  generatedTicketId.value = null;
  isModalOpen.value = true;
};

const handleGenerate = async () => {
  try {
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(newTicket.value),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    generatedTicketId.value = data.id;
    fetchTickets();
    notificationStore.showNotification('Ticket généré', 'success');
  } catch (error: any) {
    notificationStore.showNotification(error.message || 'Erreur lors de la génération', 'error');
  }
};

const openViewModal = (ticket: Ticket) => {
  currentTicket.value = ticket;
  isViewModalOpen.value = true;
};

const viewGeneratedTicket = () => {
  const ticket = tickets.value.find(t => t.id === generatedTicketId.value);
  if (ticket) {
    currentTicket.value = ticket;
    generatedTicketId.value = null;
    isModalOpen.value = false;
    isViewModalOpen.value = true;
  }
};

const handleDelete = (id: number) => {
  confirmStore.confirm({
    title: 'Supprimer le ticket',
    message: 'Êtes-vous sûr de vouloir supprimer ce ticket ?',
    confirmText: 'Supprimer',
    variant: 'danger',
    onConfirm: async () => {
      try {
        const res = await fetch(`/api/tickets/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authStore.token}` }
        });
        if (!res.ok) throw new Error();
        fetchTickets();
        notificationStore.showNotification('Ticket supprimé', 'success');
      } catch (error) {
        notificationStore.showNotification('Erreur lors de la suppression', 'error');
      }
    }
  });
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getStatusBadgeHTML = (status: string) => {
  switch (status) {
    case 'valid': return '<span class="px-2 py-0.5 inline-flex text-[9px] font-black uppercase tracking-tighter rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">Valide</span>';
    case 'used': return '<span class="px-2 py-0.5 inline-flex text-[9px] font-black uppercase tracking-tighter rounded-full bg-slate-100 text-slate-600 border border-slate-200">Utilisé</span>';
    case 'expired': return '<span class="px-2 py-0.5 inline-flex text-[9px] font-black uppercase tracking-tighter rounded-full bg-red-50 text-red-600 border-red-100">Expiré</span>';
    default: return '';
  }
};
</script>
