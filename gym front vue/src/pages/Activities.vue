<template>
  <div class="space-y-4 sm:space-y-5">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Activités</h1>
        <p class="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Gérez les activités proposées par la salle.</p>
      </div>
      <button
        @click="openAddModal"
        class="bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold w-full sm:w-auto"
      >
        <Plus class="h-3.5 w-3.5 mr-1.5" />
        Nouvelle Activité
      </button>
    </div>

    <!-- Mobile View (Cards) -->
    <div class="lg:hidden space-y-2.5">
      <div
        v-if="activities.length === 0"
        class="bg-white p-8 rounded-xl shadow-sm border border-slate-200/60 text-center"
      >
        <Dumbbell class="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <p class="text-[13px] font-bold text-slate-900 leading-tight">Aucune activité trouvée</p>
        <p class="text-[11px] text-slate-500 mt-1">Commencez par ajouter votre première activité.</p>
      </div>
      <div v-else v-for="activity in activities" :key="activity.id" class="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 flex flex-col gap-2.5">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm shrink-0">
              <Dumbbell class="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <div class="text-[13px] font-bold text-slate-900 leading-tight mb-0.5">{{ activity.name }}</div>
              <div class="text-[11px] font-medium text-slate-500 line-clamp-1">{{ activity.description }}</div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100 mt-1">
          <div>
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Capacité</div>
            <div class="text-[11px] font-bold text-slate-700">{{ activity.capacity }} pers.</div>
          </div>
          <div>
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Durée</div>
            <div class="text-[11px] font-bold text-slate-700">{{ activity.duration }} min</div>
          </div>
        </div>
        <div class="flex gap-2 pt-2.5 border-t border-slate-100 mt-1">
          <button @click="openEditModal(activity)" class="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-bold hover:bg-indigo-100 transition-colors border border-indigo-100">
            <Edit class="h-3.5 w-3.5" /> Modifier
          </button>
          <button @click="handleDelete(activity.id)" class="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold hover:bg-red-100 transition-colors border border-red-100">
            <Trash2 class="h-3.5 w-3.5" /> Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop View (Table) -->
    <div class="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div v-if="activities.length === 0" class="px-4 py-12 text-center">
        <Dumbbell class="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <p class="text-[13px] font-bold text-slate-900 leading-tight">Aucune activité trouvée</p>
        <p class="text-[11px] text-slate-500 mt-1">Commencez par ajouter votre première activité.</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100">
          <thead class="bg-slate-50/80">
            <tr>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Activité</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Description</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Capacité</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Durée</th>
              <th class="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100/80">
            <tr v-for="activity in activities" :key="activity.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-2.5 shadow-sm">
                    <Dumbbell class="h-4 w-4 text-indigo-500" />
                  </div>
                  <div class="text-[12px] font-bold text-slate-900">{{ activity.name }}</div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="text-[11px] font-medium text-slate-600 line-clamp-1 max-w-xs">{{ activity.description }}</div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-2 py-1 inline-flex text-[10px] font-bold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  {{ activity.capacity }} pers.
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-700">
                {{ activity.duration }} min
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right text-[11px] font-medium">
                <button @click="openEditModal(activity)" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors mr-1">
                  <Edit class="h-3.5 w-3.5" />
                </button>
                <button @click="handleDelete(activity.id)" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
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
        <h2 class="text-lg font-extrabold text-slate-900 mb-4 tracking-tight">{{ currentActivity.id ? 'Modifier' : 'Ajouter' }} une activité</h2>
        <form @submit.prevent="handleSave" class="space-y-3">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Nom de l'activité</label>
            <input v-model="currentActivity.name" type="text" required class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" placeholder="Ex: CrossFit" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
            <textarea v-model="currentActivity.description" required class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none resize-none h-20" placeholder="Description courte..."></textarea>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Capacité (pers.)</label>
              <input v-model.number="currentActivity.capacity" type="number" required min="1" class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Durée (min)</label>
              <input v-model.number="currentActivity.duration" type="number" required min="1" class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
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
import { Plus, Edit, Trash2, Dumbbell } from 'lucide-vue-next';
import { useConfirmStore } from '../stores/confirm';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';

const authStore = useAuthStore();

type Activity = {
  id: number;
  name: string;
  description: string;
  capacity: number;
  duration: number;
};

const activities = ref<Activity[]>([]);

const isModalOpen = ref(false);
const currentActivity = ref<Partial<Activity>>({});
const confirmStore = useConfirmStore();
const notificationStore = useNotificationStore();

const fetchActivities = async () => {
  try {
    const res = await fetch('/api/activities', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    const data = await res.json();
    if (res.ok) {
      activities.value = data;
    }
  } catch (error) {
    console.error('Error fetching activities:', error);
  }
};

onMounted(fetchActivities);

const openAddModal = () => {
  currentActivity.value = { name: '', description: '', capacity: 0, duration: 0 };
  isModalOpen.value = true;
};

const openEditModal = (activity: Activity) => {
  currentActivity.value = { ...activity };
  isModalOpen.value = true;
};

const handleSave = async () => {
  const method = currentActivity.value.id ? 'PUT' : 'POST';
  const url = currentActivity.value.id ? `/api/activities/${currentActivity.value.id}` : '/api/activities';
  
  try {
    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(currentActivity.value),
    });
    if (!res.ok) throw new Error();
    isModalOpen.value = false;
    fetchActivities();
    notificationStore.showNotification('Activité enregistrée', 'success');
  } catch (error) {
    notificationStore.showNotification('Erreur lors de l\'enregistrement', 'error');
  }
};

const handleDelete = (id: number) => {
  confirmStore.confirm({
    title: 'Supprimer l\'activité',
    message: 'Êtes-vous sûr de vouloir supprimer cette activité ?',
    confirmText: 'Supprimer',
    onConfirm: async () => {
      try {
        const res = await fetch(`/api/activities/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authStore.token}` }
        });
        if (!res.ok) throw new Error();
        fetchActivities();
        notificationStore.showNotification('Activité supprimée', 'success');
      } catch (error) {
        notificationStore.showNotification('Erreur lors de la suppression', 'error');
      }
    }
  });
};
</script>
