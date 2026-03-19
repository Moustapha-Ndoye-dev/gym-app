<template>
  <div class="flex h-screen bg-[#F8FAFC] text-[#0F172A] overflow-hidden font-sans">
    
    <!-- Mobile Slide-over Menu -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-50 lg:hidden">
      <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" @click="isMobileMenuOpen = false" />
      <div class="fixed inset-y-0 left-0 w-[240px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        <SidebarContent @close="isMobileMenuOpen = false" />
      </div>
    </div>

    <!-- Desktop Sidebar -->
    <aside class="hidden lg:flex flex-col w-[220px] bg-white border-r border-slate-200/60 z-40 shrink-0">
      <SidebarContent />
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden relative">
      <!-- Top Navbar -->
      <header class="h-14 px-3 lg:px-6 flex items-center justify-between z-10 backdrop-blur-md bg-white/70 border-b border-slate-200/50 sticky top-0 shrink-0">
        <div class="flex items-center flex-1">
          <div class="flex items-center lg:hidden mr-2">
            <div class="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200">
              <Dumbbell class="h-3.5 w-3.5 text-white" />
            </div>
          </div>
          <div class="hidden sm:flex items-center bg-slate-100/50 rounded-full px-3 py-1.5 border border-slate-200/60 w-56 focus-within:bg-white focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <Search class="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              class="bg-transparent border-none outline-none text-[11px] w-full text-slate-700 placeholder-slate-400 font-medium"
            />
          </div>
        </div>

        <div class="flex items-center space-x-2 sm:space-x-4">
          <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200/60 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all relative">
            <Bell class="h-3.5 w-3.5" />
            <span class="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          <div class="h-5 w-px bg-slate-200 hidden sm:block"></div>
          
          <div class="flex items-center bg-white rounded-full p-1 pr-1 sm:pr-2.5 shadow-sm border border-slate-200/60 cursor-pointer hover:shadow-md transition-all">
            <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold uppercase shadow-sm shrink-0">
              {{ authStore.user?.username?.charAt(0) || 'G' }}
            </div>
            <div class="ml-2 mr-2 hidden sm:block">
              <p class="text-[11px] font-bold text-slate-700 leading-tight">{{ authStore.user?.username || 'Gérant' }}</p>
              <p class="text-[8px] font-bold text-slate-400 uppercase tracking-wider leading-tight mt-0.5">
                {{ authStore.user?.role === 'admin' ? 'Administrateur' : authStore.user?.role === 'cashier' ? 'Caissier' : authStore.user?.role === 'controller' ? 'Contrôleur' : 'Membre Staff' }}
              </p>
            </div>
            <button
              @click="handleLogout"
              class="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 ml-1 sm:ml-0"
              title="Déconnexion"
            >
              <LogOut class="h-3 w-3" />
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-3 pb-20 lg:p-6 lg:pb-6">
        <router-view />
      </main>

      <!-- Mobile Bottom Navigation -->
      <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/60 flex justify-around items-center h-14 z-40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <router-link to="/" :class="cn('flex flex-col items-center justify-center w-full h-full transition-colors', $route.path === '/' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600')">
          <LayoutDashboard class="h-4 w-4 mb-0.5" />
          <span class="text-[9px] font-bold">Accueil</span>
        </router-link>
        <router-link to="/members" :class="cn('flex flex-col items-center justify-center w-full h-full transition-colors', $route.path === '/members' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600')">
          <Users class="h-4 w-4 mb-0.5" />
          <span class="text-[9px] font-bold">Membres</span>
        </router-link>
        <router-link to="/access" :class="cn('flex flex-col items-center justify-center w-full h-full transition-colors', $route.path === '/access' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600')">
          <QrCode class="h-4 w-4 mb-0.5" />
          <span class="text-[9px] font-bold">Scan</span>
        </router-link>
        <button @click="isMobileMenuOpen = true" class="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-slate-600 transition-colors">
          <Menu class="h-4 w-4 mb-0.5" />
          <span class="text-[9px] font-bold">Menu</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { 
  Dumbbell, Users, CreditCard, Ticket, QrCode, Settings, LogOut, LayoutDashboard, Bell, Search, Menu, X, ShoppingBag
} from 'lucide-vue-next';
import { cn } from '../lib/utils';
import SidebarContent from './SidebarContent.vue';
import NotificationContainer from './NotificationContainer.vue';
import ConfirmDialog from './ConfirmDialog.vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const isMobileMenuOpen = ref(false);

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
