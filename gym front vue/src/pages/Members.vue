<template>
  <div class="space-y-4 sm:space-y-5">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Adhérents</h1>
        <p class="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Gérez les membres de votre salle.</p>
      </div>
      <div class="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
        <div class="flex items-center bg-white rounded-lg px-2.5 py-2 shadow-sm border border-slate-200/60 w-full sm:w-56 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <Search class="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Rechercher un membre..."
            class="bg-transparent border-none outline-none text-[11px] w-full text-slate-700 font-medium placeholder-slate-400"
          />
        </div>
        <button
          @click="openAddModal"
          class="bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold w-full sm:w-auto whitespace-nowrap"
        >
          <Plus class="h-3.5 w-3.5 mr-1.5" />
          Nouvel Adhérent
        </button>
      </div>
    </div>

    <!-- Mobile View (Cards) -->
    <div class="lg:hidden space-y-2.5">
      <div
        v-if="filteredMembers.length === 0"
        class="bg-white p-4 rounded-xl shadow-sm border border-dashed border-slate-200/70 text-center text-[11px] font-medium text-slate-500"
      >
        Aucun adhérent pour le moment. Ajoutez votre premier membre avec le bouton ci-dessus.
      </div>
      <div v-else v-for="member in filteredMembers" :key="member.id" class="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 flex flex-col gap-3">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 text-[12px] font-bold shadow-sm border border-indigo-200/50 shrink-0">
              {{ member.first_name.charAt(0) }}{{ member.last_name.charAt(0) }}
            </div>
            <div>
              <div class="text-[13px] font-bold text-slate-900 leading-tight">{{ member.first_name }} {{ member.last_name }}</div>
              <div class="text-[10px] font-medium text-slate-500 mt-0.5">ID: #{{ member.id }}</div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100">
          <div>
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Téléphone</div>
            <div class="text-[11px] font-bold text-slate-700">{{ member.phone }}</div>
          </div>
          <div>
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Inscription</div>
            <div class="text-[11px] font-bold text-slate-700">{{ new Date(member.registration_date).toLocaleDateString('fr-FR') }}</div>
          </div>
        </div>
        <div class="flex gap-2 pt-2.5 border-t border-slate-100">
          <button @click="openViewModal(member)" class="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[11px] font-bold hover:bg-slate-100 transition-colors border border-slate-200/60">
            <QrCodeIcon class="h-3.5 w-3.5" /> QR Code
          </button>
          <button @click="openEditModal(member)" class="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-bold hover:bg-indigo-100 transition-colors border border-indigo-100">
            <Edit class="h-3.5 w-3.5" /> Modifier
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop View (Table) -->
    <div class="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div v-if="filteredMembers.length === 0" class="p-6 text-center text-[12px] text-slate-500 font-medium">
        Aucun adhérent trouvé. Cliquez sur « Nouvel Adhérent » pour en créer un.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100">
          <thead class="bg-slate-50/80">
            <tr>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Membre</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Contact</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Date d'inscription</th>
              <th class="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100/80">
            <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 text-[11px] font-bold mr-2.5 shadow-sm border border-indigo-200/50">
                    {{ member.first_name.charAt(0) }}{{ member.last_name.charAt(0) }}
                  </div>
                  <div>
                    <div class="text-[12px] font-bold text-slate-900">{{ member.first_name }} {{ member.last_name }}</div>
                    <div class="text-[10px] font-medium text-slate-500 mt-0.5">ID: #{{ member.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-[11px] font-bold text-slate-700">{{ member.phone }}</div>
                <div class="text-[10px] font-medium text-slate-500 mt-0.5">{{ member.email || 'Non renseigné' }}</div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-700">
                {{ new Date(member.registration_date).toLocaleDateString('fr-FR') }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right text-[11px] font-medium">
                <button @click="openViewModal(member)" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors mr-1" title="Générer QR Code">
                  <QrCodeIcon class="h-3.5 w-3.5" />
                </button>
                <button @click="openEditModal(member)" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                  <Edit class="h-3.5 w-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit/Create Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
      <div class="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl border border-slate-100">
        <h2 class="text-lg font-extrabold text-slate-900 mb-4 tracking-tight">{{ currentMember.id ? 'Modifier' : 'Ajouter' }} un adhérent</h2>
        <form @submit.prevent="handleSave" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Prénom</label>
              <input v-model="currentMember.first_name" type="text" required class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Nom</label>
              <input v-model="currentMember.last_name" type="text" required class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Téléphone</label>
            <input v-model="currentMember.phone" type="text" required class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Email (optionnel)</label>
            <input v-model="currentMember.email" type="email" class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
          </div>
          <div class="flex justify-end space-x-2 mt-6 pt-3 border-t border-slate-100">
            <button type="button" @click="isModalOpen = false" class="px-3 py-2 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-colors">Annuler</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[11px] font-bold shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="isViewModalOpen && currentMember.id" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
      <div class="bg-white rounded-2xl p-5 max-w-xs w-full text-center shadow-xl relative overflow-hidden border border-slate-100">
        <div class="absolute top-0 left-0 w-full h-20 bg-gradient-to-br from-indigo-500 to-purple-600"></div>
        
        <div class="relative z-10 mt-6">
          <div class="w-20 h-20 mx-auto bg-white rounded-full p-1 shadow-md mb-3">
            <div class="w-full h-full rounded-full bg-slate-50 flex items-center justify-center text-2xl font-extrabold text-indigo-600 border border-slate-100">
              {{ currentMember.first_name?.charAt(0) }}{{ currentMember.last_name?.charAt(0) }}
            </div>
          </div>
          
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">{{ currentMember.first_name }} {{ currentMember.last_name }}</h2>
          <p class="text-[11px] font-bold text-indigo-600 mb-4 bg-indigo-50 inline-block px-2.5 py-0.5 rounded-full mt-1.5 border border-indigo-100">Membre #{{ currentMember.id }}</p>
          
          <div class="bg-white p-3 rounded-xl inline-block mb-4 border border-slate-200/60 shadow-sm">
            <QRCodeVue :value="'MEMBER-' + currentMember.id" :size="120" level="H" />
          </div>
          
          <p class="text-[10px] font-medium text-slate-500 mb-6 px-2">
            Présentez ce QR Code à l'accueil pour accéder à la salle.
          </p>

          <button type="button" @click="isViewModalOpen = false" class="w-full px-3 py-2 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-200 transition-colors">
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Plus, Edit, Search, QrCode as QrCodeIcon } from 'lucide-vue-next';
import QRCodeVue from 'qrcode.vue';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';

const authStore = useAuthStore();

type Member = {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  registration_date: string;
};

const members = ref<Member[]>([]);

const searchTerm = ref('');
const isModalOpen = ref(false);
const isViewModalOpen = ref(false);
const currentMember = ref<Partial<Member>>({});
const notificationStore = useNotificationStore();

const fetchMembers = async () => {
  try {
    const res = await fetch('/api/members', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    const data = await res.json();
    if (res.ok) {
      members.value = data;
    }
  } catch (error) {
    console.error('Error fetching members:', error);
  }
};

onMounted(fetchMembers);

const filteredMembers = computed(() => {
  return members.value.filter(m => 
    m.first_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    m.last_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    m.phone.includes(searchTerm.value)
  );
});

const openAddModal = () => {
  currentMember.value = { first_name: '', last_name: '', phone: '', email: '' };
  isModalOpen.value = true;
};

const openEditModal = (member: Member) => {
  currentMember.value = { ...member };
  isModalOpen.value = true;
};

const openViewModal = (member: Member) => {
  currentMember.value = { ...member };
  isViewModalOpen.value = true;
};

const handleSave = async () => {
  const method = currentMember.value.id ? 'PUT' : 'POST';
  const url = currentMember.value.id ? `/api/members/${currentMember.value.id}` : '/api/members';
  
  const dataToSave = {
    ...currentMember.value,
    registration_date: currentMember.value.registration_date || new Date().toISOString().split('T')[0]
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
    fetchMembers();
    notificationStore.showNotification('Adhérent enregistré', 'success');
  } catch (error) {
    notificationStore.showNotification('Erreur lors de l\'enregistrement', 'error');
  }
};
</script>
