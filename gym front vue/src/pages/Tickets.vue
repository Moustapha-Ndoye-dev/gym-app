<template>
  <div class="space-y-4 sm:space-y-5">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Tickets</h1>
        <p class="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Générez des accès ponctuels.</p>
      </div>
      <button
        @click="openModal"
        class="bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold w-full sm:w-auto"
      >
        <Plus class="h-3.5 w-3.5 mr-1.5" />
        Générer un ticket
      </button>
    </div>

    <!-- Mobile View (Cards) -->
    <div class="lg:hidden space-y-2.5">
      <div
        v-if="tickets.length === 0"
        class="bg-white p-4 rounded-xl shadow-sm border border-dashed border-slate-200/70 text-center text-[11px] font-medium text-slate-500"
      >
        Aucun ticket généré pour le moment. Cliquez sur « Générer un ticket » pour créer le premier.
      </div>
      <div v-else v-for="ticket in tickets" :key="ticket.id" class="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 flex flex-col gap-2.5">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm shrink-0">
              <TicketIcon class="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <div class="text-[13px] font-bold text-slate-900 leading-tight mb-0.5">{{ ticket.type }}</div>
              <div class="text-[10px] font-medium text-slate-500">Ticket #{{ ticket.id }}</div>
            </div>
          </div>
          <component :is="getStatusBadge(ticket.status)" />
        </div>
        <div class="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100 mt-1">
          <div>
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Prix</div>
            <div class="text-[13px] font-extrabold text-emerald-600">{{ ticket.price.toFixed(2) }} €</div>
          </div>
          <div>
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Créé le</div>
            <div class="text-[11px] font-bold text-slate-700">{{ new Date(ticket.created_at).toLocaleDateString('fr-FR') }}</div>
          </div>
        </div>
        <div class="pt-2.5 border-t border-slate-100 mt-1">
          <button @click="handleDelete(ticket.id)" class="w-full flex items-center justify-center gap-1.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold hover:bg-red-100 transition-colors border border-red-100">
            <Trash2 class="h-3.5 w-3.5" /> Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop View (Table) -->
    <div class="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div v-if="tickets.length === 0" class="p-6 text-center text-[12px] text-slate-500 font-medium">
        Aucun ticket trouvé. Utilisez « Générer un ticket » pour en créer un.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100">
          <thead class="bg-slate-50/80">
            <tr>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">ID Ticket</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Type</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Prix</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Date de création</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Statut</th>
              <th class="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100/80">
            <tr v-for="ticket in tickets" :key="ticket.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-900">
                #{{ ticket.id }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-2.5 shadow-sm">
                    <TicketIcon class="h-4 w-4 text-indigo-500" />
                  </div>
                  <span class="text-[12px] font-bold text-slate-900">{{ ticket.type }}</span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-[12px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                  {{ ticket.price.toFixed(2) }} €
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-700">
                {{ new Date(ticket.created_at).toLocaleDateString('fr-FR') }} à {{ new Date(ticket.created_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <component :is="getStatusBadge(ticket.status)" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right text-[11px] font-medium">
                <button @click="handleDelete(ticket.id)" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
      <div class="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl border border-slate-100">
        <template v-if="!generatedTicketId">
          <h2 class="text-lg font-extrabold text-slate-900 mb-4 tracking-tight">Générer un ticket</h2>
          <form @submit.prevent="handleGenerate" class="space-y-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Type de ticket</label>
              <select v-model="newTicket.type" class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none">
                <option value="Séance Unique">Séance Unique</option>
                <option value="Pass Journée">Pass Journée</option>
                <option value="Semaine Découverte">Semaine Découverte</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Prix (€)</label>
              <input v-model.number="newTicket.price" type="number" step="0.01" required min="0" class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
            </div>
            <div class="flex justify-end space-x-2 mt-6 pt-3 border-t border-slate-100">
              <button type="button" @click="isModalOpen = false" class="px-3 py-2 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-colors">Annuler</button>
              <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[11px] font-bold shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all">Générer</button>
            </div>
          </form>
        </template>
        <template v-else>
          <div class="text-center">
            <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TicketIcon class="h-6 w-6 text-emerald-600" />
            </div>
            <h2 class="text-lg font-extrabold text-slate-900 mb-1 tracking-tight">Ticket Généré !</h2>
            <p class="text-[11px] font-medium text-slate-500 mb-4">Ticket #{{ generatedTicketId }}</p>
            
            <div class="bg-white p-3 rounded-xl inline-block mb-4 border border-slate-200/60 shadow-sm">
              <QRCodeVue :value="'TICKET-' + generatedTicketId" :size="120" level="H" />
            </div>
            
            <div class="space-y-2">
              <button class="w-full bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold">
                <Smartphone class="h-3.5 w-3.5 mr-1.5" />
                Envoyer par SMS
              </button>
              <button class="w-full bg-emerald-500 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-emerald-200 hover:bg-emerald-600 transition-all text-[11px] font-bold">
                <Send class="h-3.5 w-3.5 mr-1.5" />
                Envoyer par WhatsApp
              </button>
              <button @click="isModalOpen = false" class="w-full bg-slate-100 text-slate-700 px-3 py-2 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-all text-[11px] font-bold mt-2">
                Fermer
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import { Plus, Trash2, Ticket as TicketIcon, Smartphone, Send } from 'lucide-vue-next';
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
const newTicket = ref({ type: 'Séance Unique', price: 10.00 });
const generatedTicketId = ref<number | null>(null);

const fetchTickets = async () => {
  try {
    const res = await fetch('/api/tickets', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    const data = await res.json();
    if (res.ok) {
      tickets.value = data;
    }
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

const handleDelete = (id: number) => {
  confirmStore.confirm({
    title: 'Supprimer le ticket',
    message: 'Êtes-vous sûr de vouloir supprimer ce ticket ?',
    confirmText: 'Supprimer',
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

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'valid': return h('span', { class: 'px-2 py-0.5 inline-flex text-[9px] font-bold rounded bg-emerald-50 text-emerald-600 border border-emerald-100' }, 'Valide');
    case 'used': return h('span', { class: 'px-2 py-0.5 inline-flex text-[9px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-200' }, 'Utilisé');
    case 'expired': return h('span', { class: 'px-2 py-0.5 inline-flex text-[9px] font-bold rounded bg-red-50 text-red-600 border border-red-100' }, 'Expiré');
    default: return null;
  }
};
</script>
