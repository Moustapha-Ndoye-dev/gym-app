<template>
  <div class="h-14 flex items-center justify-between px-5 border-b border-slate-100/50 shrink-0">
    <div class="flex items-center">
      <div class="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200 mr-2.5">
        <Dumbbell class="h-3.5 w-3.5 text-white" />
      </div>
      <span class="text-lg font-extrabold tracking-tight text-slate-900">Gym<span class="text-indigo-600">Fit</span></span>
    </div>
    <button class="lg:hidden text-slate-400 hover:text-slate-600 p-1.5" @click="$emit('close')">
      <X class="h-4 w-4" />
    </button>
  </div>
  
  <nav class="flex-1 overflow-y-auto py-4 px-3">
    <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Menu Principal</div>
    <ul class="space-y-1">
      <li v-for="item in filteredNavItems" :key="item.path">
        <router-link
          :to="item.path"
          @click="$emit('close')"
          :class="cn(
            'flex items-center px-3 py-2.5 lg:py-2 rounded-lg text-[12px] font-bold transition-all duration-200 group',
            $route.path === item.path 
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200/50' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
          )"
        >
          <component 
            :is="item.icon" 
            :class="cn('h-4 w-4 lg:h-3.5 lg:w-3.5 mr-2.5 transition-colors', $route.path === item.path ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600')" 
          />
          {{ item.name }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { 
  Dumbbell, Users, CreditCard, Ticket, QrCode, Settings, LayoutDashboard, ShoppingBag, X
} from 'lucide-vue-next';
import { cn } from '../lib/utils';

const emit = defineEmits(['close']);
const authStore = useAuthStore();

const navItems = [
  { name: 'Tableau de bord', path: '/', icon: LayoutDashboard, roles: ['admin', 'cashier', 'controller', 'member'] },
  { name: 'Activités', path: '/activities', icon: Dumbbell, roles: ['admin'] },
  { name: 'Boutique', path: '/shop', icon: ShoppingBag, roles: ['admin', 'cashier', 'controller'] },
  { name: 'Abonnements', path: '/subscriptions', icon: CreditCard, roles: ['admin', 'cashier'] },
  { name: 'Adhérents', path: '/members', icon: Users, roles: ['admin', 'cashier'] },
  { name: 'Tickets', path: '/tickets', icon: Ticket, roles: ['admin', 'cashier'] },
  { name: 'Contrôle d\'accès', path: '/access', icon: QrCode, roles: ['admin', 'controller'] },
  { name: 'Caisse', path: '/cash-register', icon: CreditCard, roles: ['admin', 'cashier'] },
  { name: 'Utilisateurs', path: '/users', icon: Settings, roles: ['admin'] },
];

const normalizedUserRole = computed(() => {
  const role = authStore.user?.role;
  return role ? String(role).trim().toLowerCase() : null;
});

const filteredNavItems = computed(() => {
  if (!normalizedUserRole.value) {
    return navItems;
  }
  const filtered = navItems.filter((item) => item.roles.includes(normalizedUserRole.value as any));
  // Evite une sidebar vide si le rôle ne match pas exactement la liste attendue.
  return filtered.length ? filtered : navItems;
});
</script>
