<template>
  <div class="space-y-4 sm:space-y-5">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Utilisateurs</h1>
        <p class="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Gérez les accès au système.</p>
      </div>
      <button
        @click="openAddModal"
        class="bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold w-full sm:w-auto"
      >
        <Plus class="h-3.5 w-3.5 mr-1.5" />
        Nouvel Utilisateur
      </button>
    </div>

    <!-- Mobile View (Cards) -->
    <div class="lg:hidden space-y-2.5">
      <div
        v-if="users.length === 0"
        class="bg-white p-8 rounded-xl shadow-sm border border-slate-200/60 text-center"
      >
        <UserIcon class="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <p class="text-[13px] font-bold text-slate-900 leading-tight">Aucun utilisateur trouvé</p>
        <p class="text-[11px] text-slate-500 mt-1">Cliquez sur « Nouvel Utilisateur » pour commencer.</p>
      </div>
      <div v-else v-for="user in users" :key="user.id" class="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 flex flex-col gap-2.5">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm shrink-0">
              <UserIcon class="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <div class="text-[13px] font-bold text-slate-900 leading-tight mb-0.5">{{ user.username }}</div>
              <div class="text-[10px] font-medium text-slate-500">ID: #{{ user.id }}</div>
            </div>
          </div>
          <span :class="['px-2 py-0.5 inline-flex text-[9px] font-bold rounded border items-center shrink-0', user.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100']">
            <Shield v-if="user.role === 'admin'" class="h-3 w-3 mr-1" />
            {{ user.role === 'admin' ? 'Admin' : 'Caissier' }}
          </span>
        </div>
        <div class="pt-2.5 border-t border-slate-100 mt-1">
          <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Créé le</div>
          <div class="text-[11px] font-bold text-slate-700">{{ new Date(user.created_at).toLocaleDateString('fr-FR') }}</div>
        </div>
        <div class="flex gap-2 pt-2.5 border-t border-slate-100 mt-1">
          <button @click="openEditModal(user)" class="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-bold hover:bg-indigo-100 transition-colors border border-indigo-100">
            <Edit class="h-3.5 w-3.5" /> Modifier
          </button>
          <button 
            @click="handleDelete(user.id)" 
            :disabled="user.username === 'admin'"
            :class="['flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors border', user.username === 'admin' ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100']"
          >
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
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Utilisateur</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Rôle</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Date de création</th>
              <th class="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100/80">
            <tr v-if="users.length === 0">
              <td colspan="4" class="px-4 py-12 text-center">
                <UserIcon class="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p class="text-[13px] font-bold text-slate-900 leading-tight">Aucun utilisateur trouvé</p>
                <p class="text-[11px] text-slate-500 mt-1">Utilisez le bouton en haut pour ajouter un utilisateur.</p>
              </td>
            </tr>
            <tr v-else v-for="user in users" :key="user.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-2.5 shadow-sm">
                    <UserIcon class="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <div class="text-[12px] font-bold text-slate-900">{{ user.username }}</div>
                    <div class="text-[10px] font-medium text-slate-500 mt-0.5">ID: #{{ user.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span :class="['px-2 py-1 inline-flex text-[9px] font-bold rounded-md border items-center', user.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100']">
                  <Shield v-if="user.role === 'admin'" class="h-3 w-3 mr-1" />
                  {{ user.role === 'admin' ? 'Administrateur' : 'Caissier' }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-700">
                {{ new Date(user.created_at).toLocaleDateString('fr-FR') }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right text-[11px] font-medium">
                <button @click="openEditModal(user)" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors mr-1">
                  <Edit class="h-3.5 w-3.5" />
                </button>
                <button @click="handleDelete(user.id)" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" :disabled="user.username === 'admin'">
                  <Trash2 :class="['h-3.5 w-3.5', user.username === 'admin' ? 'opacity-50 cursor-not-allowed' : '']" />
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
        <h2 class="text-lg font-extrabold text-slate-900 mb-4 tracking-tight">{{ currentUser.id ? 'Modifier' : 'Ajouter' }} un utilisateur</h2>
        <form @submit.prevent="handleSave" class="space-y-3">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Nom d'utilisateur</label>
            <input v-model="currentUser.username" type="text" required class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" :disabled="currentUser.username === 'admin'" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Mot de passe {{ currentUser.id ? '(laisser vide pour ne pas changer)' : '' }}</label>
            <input v-model="password" type="password" :required="!currentUser.id" class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Rôle</label>
            <select v-model="currentUser.role" required class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" :disabled="currentUser.username === 'admin'">
              <option value="cashier">Caissier</option>
              <option value="admin">Administrateur</option>
            </select>
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
import { Plus, Edit, Trash2, Shield, User as UserIcon } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { useConfirmStore } from '../stores/confirm';
import { parseJsonSafe } from '../lib/utils';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const confirmStore = useConfirmStore();

type User = {
  id: number;
  username: string;
  role: string;
  created_at: string;
};

const users = ref<User[]>([]);

const isModalOpen = ref(false);
const currentUser = ref<Partial<User>>({ role: 'cashier' });
const password = ref('');
// Initialized above

const fetchUsers = async () => {
  try {
    const res = await fetch('/api/users', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    const data = await parseJsonSafe(res, []);
    if (res.ok) {
      users.value = data;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

onMounted(fetchUsers);

const openAddModal = () => {
  currentUser.value = { role: 'cashier', username: '' };
  password.value = '';
  isModalOpen.value = true;
};

const openEditModal = (user: User) => {
  currentUser.value = { ...user };
  password.value = '';
  isModalOpen.value = true;
};

const handleSave = async () => {
  const method = currentUser.value.id ? 'PUT' : 'POST';
  const url = currentUser.value.id ? `/api/users/${currentUser.value.id}` : '/api/users';
  
  const dataToSave = {
    ...currentUser.value,
    password: password.value || undefined,
    gymId: currentUser.value.gymId || authStore.user?.gymId,
    created_at: currentUser.value.created_at || new Date().toISOString()
  };

  try {
    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(dataToSave),
    });
    if (!res.ok) throw new Error();
    isModalOpen.value = false;
    password.value = '';
    fetchUsers();
    notificationStore.showNotification('Utilisateur enregistré', 'success');
  } catch (error) {
    notificationStore.showNotification('Erreur lors de l\'enregistrement', 'error');
  }
};

const handleDelete = (id: number) => {
  confirmStore.confirm({
    title: 'Supprimer l\'utilisateur',
    message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
    confirmText: 'Supprimer',
    onConfirm: async () => {
      try {
        const res = await fetch(`/api/users/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authStore.token}` }
        });
        if (!res.ok) throw new Error();
        fetchUsers();
        notificationStore.showNotification('Utilisateur supprimé', 'success');
      } catch (error) {
        notificationStore.showNotification('Erreur lors de la suppression', 'error');
      }
    }
  });
};
</script>
