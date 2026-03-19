<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-slate-50 font-sans p-4">
    
    <div class="w-full max-w-[400px]">
      <!-- Branding Area -->
      <div class="flex flex-col items-center mb-8">
        <div class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 mb-4">
          <Dumbbell class="h-6 w-6 text-white" />
        </div>
        <h1 class="text-xl font-black text-slate-900 tracking-tighter uppercase italic">LGL <span class="text-indigo-600">GYM</span></h1>
        <p class="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1">Plateforme de Gestion</p>
      </div>

      <!-- Main Login Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div class="p-6 sm:p-8">
          
          <!-- Header & Toggle -->
          <div class="mb-6">
            <div class="flex p-1 bg-slate-100 rounded-xl mb-6">
              <button 
                @click="mode = 'login'"
                :class="['flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all', mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
              >
                Connexion
              </button>
              <button 
                @click="mode = 'register'"
                :class="['flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all', mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
              >
                Inscription
              </button>
            </div>

            <h2 class="text-lg font-extrabold text-slate-900 tracking-tight">
              {{ mode === 'login' ? 'Heureux de vous revoir !' : 'Rejoindre l\'aventure' }}
            </h2>
            <p class="text-[11px] text-slate-500 font-medium mt-1">
              {{ mode === 'login' ? 'Saisissez vos identifiants pour continuer.' : 'Complétez vos informations pour commencer.' }}
            </p>
          </div>

          <!-- Alert Messages -->
          <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform -translate-y-2 opacity-0" enter-to-class="transform translate-y-0 opacity-100">
            <div v-if="error" class="mb-5 p-3 bg-red-50 border border-red-100/50 text-red-600 rounded-xl flex items-center gap-2.5">
              <div class="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></div>
              <p class="text-[10px] font-bold leading-tight">{{ error }}</p>
            </div>
          </Transition>
          <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="transform -translate-y-2 opacity-0" enter-to-class="transform translate-y-0 opacity-100">
            <div v-if="success" class="mb-5 p-3 bg-emerald-50 border border-emerald-100/50 text-emerald-600 rounded-xl flex items-center gap-2.5">
              <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></div>
              <p class="text-[10px] font-bold leading-tight">Inscription réussie ! Redirection...</p>
            </div>
          </Transition>

          <!-- Login Form -->
          <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Utilisateur</label>
              <div class="relative group">
                <UserIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  v-model="loginData.username"
                  type="text"
                  required
                  class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[12px] font-semibold transition-all outline-none text-slate-900 placeholder:text-slate-400"
                  placeholder="admin"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between items-center ml-1">
                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mot de passe</label>
                <a href="#" class="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">Oublié ?</a>
              </div>
              <div class="relative group">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  v-model="loginData.password"
                  type="password"
                  required
                  class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[12px] font-semibold transition-all outline-none text-slate-900 placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full h-11 flex items-center justify-center bg-indigo-600 text-white rounded-xl shadow-sm shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all text-[12px] font-bold mt-6 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              <template v-else>
                Accéder au Dashboard
                <ArrowRight class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </template>
            </button>
          </form>

            <!-- Simplified Register Form -->
          <form v-else @submit.prevent="handleRegister" class="space-y-3.5">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
              <div class="relative group">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  v-model="registerData.email"
                  type="email"
                  required
                  class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[12px] font-semibold transition-all outline-none text-slate-900"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Identifiant</label>
              <div class="relative group">
                <UserIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  v-model="registerData.username"
                  type="text"
                  required
                  minlength="3"
                  class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[12px] font-semibold transition-all outline-none text-slate-900"
                  placeholder="Nom d'utilisateur"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Mot de passe</label>
                <input
                  v-model="registerData.password"
                  type="password"
                  required
                  minlength="5"
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[12px] font-semibold transition-all outline-none text-slate-900"
                  placeholder="••••••••"
                />
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Confirmer</label>
                <input
                  v-model="registerData.confirmPassword"
                  type="password"
                  required
                  minlength="5"
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[12px] font-semibold transition-all outline-none text-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full h-11 flex items-center justify-center bg-indigo-600 text-white rounded-xl shadow-sm shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all text-[12px] font-bold mt-4 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              <template v-else>
                Créer mon compte
                <ArrowRight class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </template>
            </button>
          </form>
        </div>
        
        <!-- Secure Info Footer -->
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center flex items-center justify-center gap-2">
          <Lock class="h-3 w-3 text-slate-400" />
          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Connexion sécurisée SSL</span>
        </div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-[10px] text-slate-400 font-medium">
          &copy; {{ new Date().getFullYear() }} LGL Gym Management. Tous droits réservés.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Dumbbell, Lock, User as UserIcon, ArrowRight, Mail, Phone, CheckCircle2 } from 'lucide-vue-next';

const route = useRoute();
const mode = ref<'login' | 'register'>((route.meta.initialMode as 'login' | 'register') || 'login');
const loading = ref(false);
const error = ref('');
const success = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const loginData = ref({
  username: '',
  password: ''
});

const registerData = ref({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  gymId: 1
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
    const text = await res.text();
    let data: { user?: any; token?: string; message?: string } = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        error.value = 'Réponse serveur invalide. Vérifiez que le backend est démarré (port 5000).';
        return;
      }
    }
    if (!res.ok) throw new Error(data.message || 'Identifiants incorrects');
    if (!data.user || !data.token) {
      error.value = 'Réponse serveur incomplète. Vérifiez que le backend est démarré (port 5000).';
      return;
    }
    authStore.login(data.user, data.token);
    router.push('/');
  } catch (err: any) {
    error.value = err.message || 'Erreur de connexion. Vérifiez que le backend est démarré (port 5000).';
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  if (registerData.value.password !== registerData.value.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = false;
  try {
    const res = await fetch('/api/auth/register-member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData.value)
    });
    const text = await res.text();
    let data: { message?: string; errors?: { path: string; message: string }[] } = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        error.value = 'Réponse serveur invalide. Vérifiez que le backend est démarré (port 5000).';
        return;
      }
    }

    if (!res.ok) {
      if (data.errors && data.errors.length > 0) {
        throw new Error(`${data.errors[0].path}: ${data.errors[0].message}`);
      }
      throw new Error(data.message || 'Erreur lors de l\'inscription');
    }

    success.value = true;
    setTimeout(() => {
      mode.value = 'login';
      success.value = false;
    }, 2500);
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Scoped styles if needed, currently using Tailwind classes for everything */
</style>
