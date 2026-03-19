<template>
  <div class="space-y-4 sm:space-y-5">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Adhérents</h1>
        <p class="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Gérez les membres et leurs abonnements.</p>
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
        class="bg-white p-8 rounded-xl shadow-sm border border-slate-200/60 text-center"
      >
        <User class="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <p class="text-[13px] font-bold text-slate-900 leading-tight">Aucun adhérent trouvé</p>
        <p class="text-[11px] text-slate-500 mt-1">Commencez par ajouter votre premier membre.</p>
      </div>
      <div v-else v-for="member in filteredMembers" :key="member.id" class="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 flex flex-col gap-3">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2.5">
            <div v-if="member.photo" class="w-9 h-9 rounded-full overflow-hidden border border-slate-100 shrink-0">
               <img :src="member.photo" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 text-[12px] font-bold shadow-sm border border-indigo-200/50 shrink-0 uppercase">
              {{ member.firstName?.[0] || member.first_name?.[0] }}{{ member.lastName?.[0] || member.last_name?.[0] }}
            </div>
            <div>
              <div class="text-[13px] font-bold text-slate-900 leading-tight">{{ member.firstName || member.first_name }} {{ member.lastName || member.last_name }}</div>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span :class="['text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter border', isExpired(member.expiryDate || member.expiry_date) ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100']">
                  {{ isExpired(member.expiryDate || member.expiry_date) ? 'Expiré' : 'Actif' }}
                </span>
                <span class="text-[10px] font-medium text-slate-500">#{{ member.id }}</span>
              </div>
            </div>
          </div>
          <button @click="handleDelete(member.id)" class="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
            <Trash2 class="h-3.5 w-3.5" />
          </button>
        </div>
        <div class="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100">
          <div>
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Téléphone</div>
            <div class="text-[11px] font-bold text-slate-700">{{ member.phone }}</div>
          </div>
          <div>
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Expiration</div>
            <div :class="['text-[11px] font-bold', isExpired(member.expiryDate || member.expiry_date) ? 'text-red-600' : 'text-slate-700']">
              {{ formatDate(member.expiryDate || member.expiry_date) }}
            </div>
          </div>
        </div>
        <div class="flex gap-2 pt-2.5 border-t border-slate-100">
          <button @click="openViewModal(member)" class="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[11px] font-bold hover:bg-slate-100 transition-colors border border-slate-200/60">
            <QrCodeIcon class="h-3.5 w-3.5" /> Carte
          </button>
          <button @click="openEditModal(member)" class="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-bold hover:bg-indigo-100 transition-colors border border-indigo-100">
            <Edit class="h-3.5 w-3.5" /> Modifier
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop View (Table) -->
    <div class="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div v-if="filteredMembers.length === 0" class="p-12 text-center">
        <User class="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <p class="text-[13px] font-bold text-slate-900 leading-tight">Aucun adhérent trouvé</p>
        <p class="text-[11px] text-slate-500 mt-1">Commencez par ajouter votre premier membre.</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100">
          <thead class="bg-slate-50/80">
            <tr>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Membre</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Abonnement</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Expiration</th>
              <th class="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100/80">
            <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <div v-if="member.photo" class="w-8 h-8 rounded-full overflow-hidden border border-slate-100 mr-2.5">
                    <img :src="member.photo" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 text-[11px] font-bold mr-2.5 shadow-sm border border-indigo-200/50 uppercase">
                    {{ member.firstName?.[0] || member.first_name?.[0] }}{{ member.lastName?.[0] || member.last_name?.[0] }}
                  </div>
                  <div>
                    <div class="text-[12px] font-bold text-slate-900">{{ member.firstName || member.first_name }} {{ member.lastName || member.last_name }}</div>
                    <div class="text-[10px] font-medium text-slate-500 mt-0.5">{{ member.phone }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-[11px] font-bold text-slate-700">{{ member.subscription?.name || 'Standard' }}</div>
                <div :class="['text-[9px] font-black px-1.5 py-0.5 rounded-full inline-block mt-1 uppercase tracking-tighter border', isExpired(member.expiryDate || member.expiry_date) ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100']">
                  {{ isExpired(member.expiryDate || member.expiry_date) ? 'Expiré' : 'Actif' }}
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-700">
                {{ formatDate(member.expiryDate || member.expiry_date) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right text-[11px] font-medium">
                <button @click="openViewModal(member)" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors mr-1" title="Voir Carte Membre">
                  <QrCodeIcon class="h-3.5 w-3.5" />
                </button>
                <button @click="openEditModal(member)" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors mr-1">
                  <Edit class="h-3.5 w-3.5" />
                </button>
                <button @click="handleDelete(member.id)" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit/Create Modal (Reduced Size) -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
      <div class="bg-white rounded-2xl p-4 max-w-[340px] w-full shadow-xl border border-slate-100 overflow-y-auto max-h-[95vh]">
        <h2 class="text-md font-extrabold text-slate-900 mb-3 tracking-tight">{{ currentMember.id ? 'Modifier' : 'Ajouter' }} adhérent</h2>
        <form @submit.prevent="handleSave" class="space-y-2.5">
          
          <!-- Photo Upload Section Compact -->
          <div class="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
            <div class="w-14 h-14 rounded-full bg-white border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative shrink-0 group cursor-pointer">
              <img v-if="photoPreview || currentMember.photo" :src="photoPreview || currentMember.photo" class="w-full h-full object-cover" />
              <Plus v-else class="h-4 w-4 text-slate-400" />
              <input type="file" accept="image/*" @change="handlePhotoChange" class="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div class="flex-1">
              <p class="text-[10px] font-black text-slate-700 uppercase tracking-tight">Photo</p>
              <p class="text-[9px] text-slate-500 leading-tight">Cliquez pour {{ currentMember.photo ? 'changer' : 'ajouter' }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-1">Prénom</label>
              <input v-model="currentMember.firstName" type="text" required class="block w-full px-2 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] outline-none" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-1">Nom</label>
              <input v-model="currentMember.lastName" type="text" required class="block w-full px-2 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1">Téléphone</label>
            <input v-model="currentMember.phone" type="text" required class="block w-full px-2 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-1">Abonnement</label>
              <select required v-model="currentMember.subscriptionId" class="block w-full px-2 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] outline-none">
                <option value="">Choisir...</option>
                <option v-for="s in subscriptions" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-1">Durée</label>
              <select v-model="durationMonths" class="block w-full px-2 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] outline-none">
                <option :value="1">1 Mois</option>
                <option :value="3">3 Mois</option>
                <option :value="6">6 Mois</option>
                <option :value="12">12 Mois</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
            <button type="button" @click="isModalOpen = false" class="px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-100">Annuler</button>
            <button type="submit" class="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[11px] font-bold shadow-sm hover:bg-indigo-700">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Modal (Carte Membre) -->
    <div v-if="isViewModalOpen && currentMember.id" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
      <div class="bg-white rounded-2xl p-0 max-w-[280px] w-full text-center shadow-2xl relative overflow-hidden border border-slate-100 animate-in zoom-in duration-200">
        <div :class="['h-20 w-full relative', isExpired(currentMember.expiryDate || currentMember.expiry_date) ? 'bg-slate-400' : 'bg-gradient-to-br from-indigo-600 to-purple-700']">
          <div class="absolute top-3 right-4 opacity-20">
            <QrCodeIcon class="h-12 w-12 text-white" />
          </div>
        </div>
        
        <div class="px-5 pb-6 -mt-10 relative z-10">
          <div class="w-20 h-20 mx-auto bg-white rounded-2xl p-1.5 shadow-xl mb-3 border border-slate-50 overflow-hidden">
            <img v-if="currentMember.photo" :src="currentMember.photo" class="w-full h-full object-cover rounded-xl" />
            <div v-else class="w-full h-full rounded-xl bg-slate-50 flex items-center justify-center text-3xl font-black text-indigo-600 border border-slate-100 uppercase">
              {{ currentMember.firstName?.[0] || currentMember.first_name?.[0] }}{{ currentMember.lastName?.[0] || member.last_name?.[0] }}
            </div>
          </div>
          
          <h2 class="text-lg font-black text-slate-900 tracking-tight">{{ currentMember.firstName || currentMember.first_name }} {{ currentMember.lastName || currentMember.last_name }}</h2>
          <div class="flex items-center justify-center gap-2 mt-1 mb-4">
            <span :class="['text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider border', isExpired(currentMember.expiryDate || currentMember.expiry_date) ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100']">
              {{ isExpired(currentMember.expiryDate || currentMember.expiry_date) ? 'Expiré' : 'Membre Actif' }}
            </span>
            <span class="text-[9px] font-bold text-slate-400">#{{ currentMember.id }}</span>
          </div>

          <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-5 flex flex-col items-center">
            <div class="bg-white p-1.5 rounded-lg border border-slate-200/60 shadow-sm mb-2">
              <QRCodeVue :value="'MEMBER-' + currentMember.id" :size="110" level="H" />
            </div>
            <div class="grid grid-cols-2 w-full gap-2 mt-1">
              <div class="text-left">
                <p class="text-[8px] font-black text-slate-400 uppercase">Émis le</p>
                <p class="text-[10px] font-bold text-slate-700">{{ formatDate(currentMember.registrationDate || currentMember.registration_date) }}</p>
              </div>
              <div class="text-right">
                <p class="text-[8px] font-black text-slate-400 uppercase">Validité</p>
                <p :class="['text-[10px] font-bold', isExpired(currentMember.expiryDate || currentMember.expiry_date) ? 'text-red-600' : 'text-slate-700']">
                  {{ formatDate(currentMember.expiryDate || currentMember.expiry_date) }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <button @click="window.print()" class="flex-1 px-3 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-bold shadow-sm shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5">
               <Printer class="h-4 w-4" /> Imprimer
            </button>
            <button type="button" @click="isViewModalOpen = false" class="px-5 py-2.5 bg-slate-100 rounded-xl text-[10px] font-bold text-slate-700 hover:bg-slate-200 transition-colors">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Plus, Edit, Search, QrCode as QrCodeIcon, Trash2, User, Printer } from 'lucide-vue-next';
import QRCodeVue from 'qrcode.vue';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

type Subscription = {
  id: number;
  name: string;
  price: number;
  durationMonths: number;
};

type Member = {
  id: number;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  phone: string;
  email: string;
  registrationDate?: string;
  registration_date?: string;
  expiryDate?: string;
  expiry_date?: string;
  photo?: string;
  subscription?: Subscription;
  subscriptionId?: number;
};

const members = ref<Member[]>([]);
const subscriptions = ref<Subscription[]>([]);
const searchTerm = ref('');
const isModalOpen = ref(false);
const isViewModalOpen = ref(false);
const currentMember = ref<Partial<Member>>({});
const durationMonths = ref(1);
const photoPreview = ref<string | null>(null);

const fetchMembers = async () => {
  try {
    const res = await fetch('/api/members', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    const data = await res.json();
    if (res.ok) members.value = data;
  } catch (error) {
    console.error('Error fetching members:', error);
  }
};

const fetchSubscriptions = async () => {
  try {
    const res = await fetch('/api/subscriptions', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    const data = await res.json();
    if (res.ok) subscriptions.value = data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
  }
};

onMounted(() => {
  fetchMembers();
  fetchSubscriptions();
});

const filteredMembers = computed(() => {
  return members.value.filter(m => {
    const fn = m.firstName || m.first_name || '';
    const ln = m.lastName || m.last_name || '';
    return fn.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
           ln.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
           m.phone.includes(searchTerm.value);
  });
});

const handlePhotoChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      photoPreview.value = reader.result as string;
      currentMember.value.photo = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const openAddModal = () => {
  currentMember.value = { firstName: '', lastName: '', phone: '', email: '', subscriptionId: undefined };
  durationMonths.value = 1;
  photoPreview.value = null;
  isModalOpen.value = true;
};

const openEditModal = (member: Member) => {
  currentMember.value = { ...member };
  photoPreview.value = member.photo || null;
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
    durationMonths: durationMonths.value,
    registration_date: currentMember.value.registrationDate || currentMember.value.registration_date || new Date().toISOString()
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
    photoPreview.value = null;
    fetchMembers();
    notificationStore.showNotification('Adhérent enregistré', 'success');
  } catch (error) {
    notificationStore.showNotification('Erreur lors de l\'enregistrement', 'error');
  }
};

const handleDelete = async (id: number) => {
  if (!window.confirm('Voulez-vous vraiment supprimer cet adhérent ?')) return;
  try {
    const res = await fetch(`/api/members/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    if (res.ok) {
      fetchMembers();
      notificationStore.showNotification('Adhérent supprimé', 'success');
    }
  } catch (error) {
    notificationStore.showNotification('Erreur lors de la suppression', 'error');
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('fr-FR');
};

const isExpired = (expiryDate?: string) => {
  if (!expiryDate) return true;
  return new Date(expiryDate) < new Date();
};
</script>
