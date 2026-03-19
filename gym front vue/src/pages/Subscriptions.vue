<template>
  <div class="space-y-4 sm:space-y-5">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Abonnements</h1>
        <p class="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Gérez les formules d'abonnement.</p>
      </div>
      <button
        @click="openAddModal"
        class="bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold w-full sm:w-auto"
      >
        <Plus class="h-3.5 w-3.5 mr-1.5" />
        Nouvel Abonnement
      </button>
    </div>

    <!-- Mobile View (Cards) -->
    <div class="lg:hidden space-y-2.5">
      <div v-for="sub in subscriptions" :key="sub.id" class="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 flex flex-col gap-2.5">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm shrink-0">
              <CreditCard class="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <div class="text-[13px] font-bold text-slate-900 leading-tight mb-0.5">{{ sub.name }}</div>
              <div class="text-[11px] font-medium text-slate-500 line-clamp-1">{{ sub.description }}</div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100 mt-1">
          <div>
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Prix</div>
            <div class="text-[13px] font-extrabold text-emerald-600">{{ sub.price.toFixed(2) }} €</div>
          </div>
          <div>
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Durée</div>
            <div class="text-[11px] font-bold text-slate-700">{{ sub.duration_months }} mois</div>
          </div>
        </div>
        <div class="pt-2.5 border-t border-slate-100 mt-1">
          <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Activités incluses</div>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="actId in sub.activities" :key="actId" class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold border border-slate-200">
              {{ activities.find(a => a.id === actId)?.name }}
            </span>
          </div>
        </div>
        <div class="flex gap-2 pt-2.5 border-t border-slate-100 mt-1">
          <button @click="openEditModal(sub)" class="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-bold hover:bg-indigo-100 transition-colors border border-indigo-100">
            <Edit class="h-3.5 w-3.5" /> Modifier
          </button>
          <button @click="handleDelete(sub.id)" class="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold hover:bg-red-100 transition-colors border border-red-100">
            <Trash2 class="h-3.5 w-3.5" /> Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop View (Table) -->
    <div class="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100">
          <thead class="bg-slate-50/80">
            <tr>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Abonnement</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Prix</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Durée</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Activités</th>
              <th class="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100/80">
            <tr v-for="sub in subscriptions" :key="sub.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-2.5 shadow-sm">
                    <CreditCard class="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <div class="text-[12px] font-bold text-slate-900">{{ sub.name }}</div>
                    <div class="text-[10px] font-medium text-slate-500 mt-0.5 line-clamp-1 max-w-xs">{{ sub.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-[12px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                  {{ sub.price.toFixed(2) }} €
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-700">
                {{ sub.duration_months }} mois
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="actId in sub.activities" :key="actId" class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold border border-slate-200">
                    {{ activities.find(a => a.id === actId)?.name }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right text-[11px] font-medium">
                <button @click="openEditModal(sub)" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors mr-1">
                  <Edit class="h-3.5 w-3.5" />
                </button>
                <button @click="handleDelete(sub.id)" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
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
      <div class="bg-white rounded-2xl p-5 max-md w-full shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <h2 class="text-lg font-extrabold text-slate-900 mb-4 tracking-tight">{{ currentSub.id ? 'Modifier' : 'Ajouter' }} un abonnement</h2>
        <form @submit.prevent="handleSave" class="space-y-3">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Nom de l'abonnement</label>
            <input v-model="currentSub.name" type="text" required class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" placeholder="Ex: Pass Premium" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
            <textarea v-model="currentSub.description" required class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none resize-none h-16" placeholder="Description courte..."></textarea>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Prix (€)</label>
              <input v-model.number="currentSub.price" type="number" step="0.01" required min="0" class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Durée (mois)</label>
              <input v-model.number="currentSub.duration_months" type="number" required min="1" class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
            </div>
          </div>
          
          <div class="pt-2">
            <label class="block text-[11px] font-bold text-slate-700 mb-2">Activités incluses</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
              <label v-for="activity in activities" :key="activity.id" :class="['flex items-center p-2 rounded-lg border cursor-pointer transition-all', currentSub.activities?.includes(activity.id) ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:bg-slate-50']">
                <input 
                  type="checkbox" 
                  class="w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  :value="activity.id"
                  :checked="currentSub.activities?.includes(activity.id)"
                  @change="toggleActivity(activity.id)"
                />
                <span class="ml-2 text-[11px] font-bold text-slate-700">{{ activity.name }}</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end space-x-2 mt-6 pt-3 border-t border-slate-100">
            <button type="button" @click="isModalOpen = false" class="px-3 py-2 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-colors">Annuler</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[11px] font-bold shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus, Edit, Trash2, CreditCard } from 'lucide-vue-next';
import { useConfirmStore } from '../stores/confirm';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { parseJsonSafe } from '../lib/utils';

const authStore = useAuthStore();

type Subscription = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_months: number;
  activities: number[];
};

type Activity = {
  id: number;
  name: string;
};

const subscriptions = ref<Subscription[]>([]);

const activities = ref<Activity[]>([]);

const isModalOpen = ref(false);
const currentSub = ref<Partial<Subscription>>({ activities: [] });
const confirmStore = useConfirmStore();
const notificationStore = useNotificationStore();

const fetchData = async () => {
  try {
    const [subsRes, actsRes] = await Promise.all([
      fetch('/api/subscriptions', { headers: { 'Authorization': `Bearer ${authStore.token}` } }).catch(() => null),
      fetch('/api/activities', { headers: { 'Authorization': `Bearer ${authStore.token}` } }).catch(() => null)
    ]);
    if (subsRes && actsRes) {
      const subsData = subsRes.ok ? await parseJsonSafe(subsRes, []) : [];
      const actsData = actsRes.ok ? await parseJsonSafe(actsRes, []) : [];
      if (subsRes.ok) subscriptions.value = subsData;
      if (actsRes.ok) activities.value = actsData;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(fetchData);

const openAddModal = () => {
  currentSub.value = { activities: [], name: '', description: '', price: 0, duration_months: 0 };
  isModalOpen.value = true;
};

const openEditModal = (sub: Subscription) => {
  currentSub.value = { ...sub, activities: [...sub.activities] };
  isModalOpen.value = true;
};

const handleSave = async () => {
  const method = currentSub.value.id ? 'PUT' : 'POST';
  const url = currentSub.value.id ? `/api/subscriptions/${currentSub.value.id}` : '/api/subscriptions';
  
  try {
    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(currentSub.value),
    });
    if (!res.ok) throw new Error();
    isModalOpen.value = false;
    fetchData();
    notificationStore.showNotification('Abonnement enregistré', 'success');
  } catch (error) {
    notificationStore.showNotification('Erreur lors de l\'enregistrement', 'error');
  }
};

const handleDelete = (id: number) => {
  confirmStore.confirm({
    title: 'Supprimer l\'abonnement',
    message: 'Êtes-vous sûr de vouloir supprimer cet abonnement ?',
    confirmText: 'Supprimer',
    onConfirm: async () => {
      try {
        const res = await fetch(`/api/subscriptions/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authStore.token}` }
        });
        if (!res.ok) throw new Error();
        fetchData();
        notificationStore.showNotification('Abonnement supprimé', 'success');
      } catch (error) {
        notificationStore.showNotification('Erreur lors de la suppression', 'error');
      }
    }
  });
};

const toggleActivity = (activityId: number) => {
  if (!currentSub.value.activities) currentSub.value.activities = [];
  const idx = currentSub.value.activities.indexOf(activityId);
  if (idx > -1) {
    currentSub.value.activities.splice(idx, 1);
  } else {
    currentSub.value.activities.push(activityId);
  }
};
</script>
