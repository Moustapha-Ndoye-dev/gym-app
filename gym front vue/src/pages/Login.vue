<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden font-sans">
    <!-- SaaS Background Pattern -->
    <div class="absolute inset-0 z-0 opacity-10" style="background-image: radial-gradient(#1e293b 1px, transparent 1px); background-size: 24px 24px"></div>
    
    <!-- Dynamic Background Blob -->
    <div class="absolute top-[-10%] left-[-5%] w-[35%] h-[35%] bg-indigo-600/20 rounded-full blur-[100px]"></div>
    
    <div class="container max-w-[850px] w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10 p-6">
      
      <!-- Left Side: Professional SaaS Branding -->
      <div class="hidden lg:flex flex-col space-y-6 text-white pr-10 border-r border-white/5">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
            <Dumbbell class="h-4 w-4 text-white" />
          </div>
          <span class="text-md font-black tracking-tight uppercase tracking-widest">GYM <span class="text-indigo-400">PRO</span></span>
        </div>
        
        <div class="space-y-3">
          <h1 class="text-3xl font-black leading-tight tracking-tight">L'excellence de la <span class="text-indigo-400">gestion fitness.</span></h1>
          <p class="text-[13px] text-slate-400 font-medium max-w-sm">Automatisez votre salle avec Gym Pro.</p>
        </div>

        <div class="grid grid-cols-1 gap-3 pt-2">
          <div v-for="(f, i) in features" :key="i" class="flex items-center gap-2 text-slate-400">
            <component :is="f.icon" class="h-3.5 w-3.5 text-indigo-500" />
            <span class="text-[11px] font-bold uppercase tracking-wider">{{ f.title }}</span>
          </div>
        </div>
      </div>

      <!-- Right Side: Ultra Compact Form -->
      <div class="w-full max-w-[320px] mx-auto animate-in fade-in zoom-in duration-500">
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          <div class="p-6 sm:p-8">
            
            <div class="text-center mb-6">
              <h2 class="text-lg font-black text-slate-900 tracking-tight">
                {{ mode === 'login' ? 'Connexion' : 'Nouvelle salle' }}
              </h2>
              <p class="text-[11px] text-slate-500 font-medium">GYM PRO Management</p>
            </div>

            <!-- Toggler Compact -->
            <div class="flex p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200/50">
              <button 
                @click="mode = 'login'"
                :class="['flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all', mode === 'login' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700']"
              >
                Connexion
              </button>
              <button 
                @click="mode = 'register'"
                :class="['flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all', mode === 'register' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700']"
              >
                Inscription
              </button>
            </div>

            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform -translate-y-2 opacity-0" enter-to-class="transform translate-y-0 opacity-100">
              <div v-if="error" class="mb-4 p-2.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex items-center gap-2">
                <XCircle class="h-3.5 w-3.5 shrink-0" />
                <p class="text-[10px] font-bold">{{ error }}</p>
              </div>
            </Transition>

            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform -translate-y-2 opacity-0" enter-to-class="transform translate-y-0 opacity-100">
              <div v-if="success" class="mb-4 p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-center gap-2">
                <CheckCircle2 class="h-3.5 w-3.5 shrink-0" />
                <p class="text-[10px] font-bold">Salle créée !</p>
              </div>
            </Transition>

            <!-- Forms -->
            <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="space-y-3.5">
              <div class="space-y-1">
                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Utilisateur</label>
                <div class="relative">
                  <UserIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    v-model="loginData.username"
                    type="text"
                    required
                    class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 text-[12px] font-bold transition-all outline-none text-slate-900"
                    placeholder="admin"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <div class="flex justify-between items-center ml-1">
                  <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pass</label>
                  <a href="#" class="text-[9px] font-black text-indigo-600">Oublié ?</a>
                </div>
                <div class="relative">
                  <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    v-model="loginData.password"
                    type="password"
                    required
                    class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 text-[12px] font-bold transition-all outline-none text-slate-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full py-2.5 flex items-center justify-center bg-slate-900 text-white rounded-xl shadow-xl hover:bg-slate-800 active:scale-[0.98] transition-all text-[11px] font-black uppercase tracking-widest mt-6 group disabled:opacity-70"
              >
                <div v-if="loading" class="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <template v-else>
                  Accéder
                  <ArrowRight class="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </template>
              </button>
            </form>

            <form v-else @submit.prevent="handleRegister" class="space-y-2.5">
              <input v-model="registerData.gymName" type="text" required class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600/20 text-[11px] font-bold outline-none text-slate-900" placeholder="Nom de la salle" />
              <input v-model="registerData.gymEmail" type="email" required class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600/20 text-[11px] font-bold outline-none text-slate-900" placeholder="Email contact" />
              <input v-model="registerData.adminUsername" type="text" required class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600/20 text-[11px] font-bold outline-none text-slate-900" placeholder="Identifiant Admin" />
              <div class="grid grid-cols-2 gap-2">
                <input v-model="registerData.adminPassword" type="password" required class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600/20 text-[11px] font-bold outline-none text-slate-900" placeholder="Pass" />
                <input v-model="registerData.confirmPassword" type="password" required class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600/20 text-[11px] font-bold outline-none text-slate-900" placeholder="Conf" />
              </div>
              <button type="submit" :disabled="loading" class="w-full py-2.5 bg-indigo-600 text-white rounded-xl shadow-xl hover:bg-indigo-700 transition-all text-[11px] font-black uppercase tracking-widest mt-4">S'enregistrer</button>
            </form>
          </div>
          
          <div class="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
            <span class="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-1.5">
              <ShieldCheck class="h-3 w-3 text-emerald-500" />
              Sécurisé & Chiffré
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Dumbbell, Lock, User as UserIcon, ArrowRight, ShieldCheck, Zap, LayoutDashboard, XCircle, CheckCircle2 } from 'lucide-vue-next';

const route = useRoute();
const mode = ref<'login' | 'register'>((route.meta.initialMode as 'login' | 'register') || 'login');
const loading = ref(false);
const error = ref('');
const success = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const features = [
  { icon: Zap, title: "OS ultra-rapide" },
  { icon: LayoutDashboard, title: "Pilotage temps réel" },
  { icon: ShieldCheck, title: "Cloud sécurisé" }
];

const loginData = ref({ username: '', password: '' });
const registerData = ref({
  gymEmail: '',
  gymName: '',
  adminUsername: '',
  adminPassword: '',
  confirmPassword: ''
});

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData.value)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Identifiants incorrects');
    authStore.login(data.user, data.token);
    router.push('/');
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  if (registerData.value.adminPassword !== registerData.value.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas';
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch('/api/auth/register-gym', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gymName: registerData.value.gymName,
        gymEmail: registerData.value.gymEmail,
        adminUsername: registerData.value.adminUsername,
        adminPassword: registerData.value.adminPassword
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur lors de l\'inscription');
    success.value = true;
    setTimeout(() => { mode.value = 'login'; success.value = false; }, 2000);
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
