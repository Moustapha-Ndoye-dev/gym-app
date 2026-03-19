<template>
  <div class="space-y-4 sm:space-y-5">
    <div
      v-if="errorMessage"
      class="text-[11px] sm:text-[12px] text-red-600 font-bold bg-red-50 border border-red-100/50 rounded-xl px-3 py-2"
    >
      {{ errorMessage }}
    </div>
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 sm:p-6 text-white shadow-sm relative overflow-hidden">
      <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-1/4 w-24 h-24 bg-indigo-400 opacity-20 rounded-full blur-2xl"></div>
      <div class="relative z-10">
        <h1 class="text-lg sm:text-xl font-extrabold mb-1 tracking-tight">Bonjour, {{ authStore.user?.username }} 👋</h1>
        <p class="text-indigo-100 text-[11px] sm:text-[12px] font-medium max-w-xl leading-relaxed">Voici un résumé de l'activité de votre salle de sport aujourd'hui.</p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div v-for="(stat, index) in statCards" :key="index" class="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-slate-200/60 hover:shadow-md hover:border-slate-300 transition-all group flex flex-col justify-between">
        <div class="flex justify-between items-start mb-2 sm:mb-3">
          <div :class="cn('p-1.5 sm:p-2 rounded-lg border group-hover:scale-110 transition-transform', stat.bg, stat.border)">
            <component :is="stat.icon" :class="cn('h-3.5 w-3.5 sm:h-4 sm:w-4', stat.color)" />
          </div>
          <div class="flex items-center text-emerald-600 text-[9px] sm:text-[10px] font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">
            {{ stat.trend }}
            <ArrowUpRight class="h-2.5 w-2.5 ml-0.5" />
          </div>
        </div>
        <div>
          <p class="text-[10px] sm:text-[11px] font-bold text-slate-500 mb-0.5">{{ stat.title }}</p>
          <p class="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Charts / Lists area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
      <div class="lg:col-span-2 bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200/60">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-[13px] sm:text-[14px] font-extrabold text-slate-900 tracking-tight">Revenus de la semaine</h2>
          </div>
          <select class="bg-slate-50 border border-slate-200/60 text-slate-700 text-[10px] sm:text-[11px] font-bold rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-100">
            <option>Cette semaine</option>
            <option>Semaine dernière</option>
          </select>
        </div>
        <div class="h-[180px] sm:h-[220px] w-full flex items-center justify-center">
          <div v-if="loading" class="text-[11px] sm:text-[12px] text-slate-500 font-medium">
            Chargement...
          </div>
          <div v-else-if="hasRevenueData" class="w-full h-full">
            <Line :data="chartData" :options="chartOptions" />
          </div>
          <p v-else class="text-[11px] sm:text-[12px] text-slate-500 font-medium text-center">
            Aucune donnée de revenus disponible pour le moment.
          </p>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200/60 flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-[13px] sm:text-[14px] font-extrabold text-slate-900 tracking-tight">Derniers Adhérents</h2>
          <button @click="$router.push('/members')" class="text-[10px] sm:text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md transition-colors">Voir tout</button>
        </div>
        <div class="space-y-2 flex-1">
          <div
            v-if="loading"
            class="text-[11px] sm:text-[12px] text-slate-500 font-medium text-center py-4 rounded-lg"
          >
            Chargement...
          </div>
          <div
            v-else-if="recentMembers.length === 0"
            class="text-[11px] sm:text-[12px] text-slate-500 font-medium text-center py-4 border border-dashed border-slate-200 rounded-lg bg-slate-50/60"
          >
            Aucun adhérent récent pour le moment.
          </div>
          <div
            v-else
            v-for="member in recentMembers"
            :key="member.id"
            @click="$router.push('/members')"
            class="flex items-center justify-between p-2 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-lg transition-all cursor-pointer group"
          >
            <div class="flex items-center">
              <div v-if="member.photo" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden mr-2.5 shadow-sm border border-slate-100">
                 <img :src="member.photo" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] sm:text-[11px] font-bold mr-2.5 shadow-sm group-hover:shadow-md transition-shadow uppercase">
                {{ (member.firstName || member.first_name || '?').charAt(0) }}{{ (member.lastName || member.last_name || '?').charAt(0) }}
              </div>
              <div>
                <p class="text-[11px] sm:text-[12px] font-bold text-slate-900">{{ member.firstName || member.first_name }} {{ member.lastName || member.last_name }}</p>
                <p class="text-[9px] sm:text-[10px] font-medium text-slate-500 mt-0.5">
                  {{ member.subscriptionName || 'Membre' }} • {{ formatDate(member.registrationDate || member.registration_date) }}
                </p>
              </div>
            </div>
            <div class="text-[8px] sm:text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">
              Actif
            </div>
          </div>
        </div>
        <button @click="$router.push('/members')" class="w-full mt-3 py-2 bg-slate-900 text-white rounded-lg text-[11px] sm:text-[12px] font-bold hover:bg-indigo-600 transition-colors shadow-sm shadow-slate-200">
          Nouveau membre
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { Users, Ticket, TrendingUp, ArrowUpRight, Activity as ActivityIcon } from 'lucide-vue-next';
import { cn } from '../lib/utils';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, Filler } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, Filler);

const authStore = useAuthStore();

const stats = ref({
  members: 0,
  activeSubscriptions: 0,
  ticketsSold: 0,
  dailyRevenue: 0,
});

const loading = ref(true);
const errorMessage = ref<string | null>(null);
const trends = ref({
  members: '—',
  subscriptions: '—',
  tickets: '—',
  revenue: '—',
});

const recentMembers = ref<any[]>([]);
const hasRevenueData = ref(false);

const statCards = computed(() => [
  { title: 'Adhérents', value: stats.value.members, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', trend: trends.value.members },
  { title: 'Abonnements', value: stats.value.activeSubscriptions, icon: ActivityIcon, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', trend: trends.value.subscriptions },
  { title: 'Tickets', value: stats.value.ticketsSold, icon: Ticket, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', trend: trends.value.tickets },
  { title: 'Revenus', value: `${stats.value.dailyRevenue} FCFA`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', trend: trends.value.revenue },
]);

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleDateString('fr-FR');
};

const chartData = ref({
  labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  datasets: [
    {
      label: 'Revenus (FCFA)',
      backgroundColor: (context: any) => {
        const chart = context.chart;
        const {ctx, chartArea} = chart;
        if (!chartArea) return null;
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(79, 70, 229, 0)');
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0.3)');
        return gradient;
      },
      borderColor: '#4F46E5',
      pointBackgroundColor: '#4F46E5',
      data: [] as number[],
      fill: true,
      tension: 0.4,
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      backgroundColor: '#fff',
      titleColor: '#0F172A',
      bodyColor: '#64748B',
      borderColor: '#E2E8F0',
      borderWidth: 1,
      padding: 8,
      bodyFont: { weight: 'bold' as const },
    },
  },
  scales: {
    y: {
      grid: { display: true, drawBorder: false, color: '#F1F5F9' },
      ticks: {
        callback: (value: any) => value + 'FCFA',
        font: { size: 10, weight: 600 },
        color: '#64748B',
      },
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 10, weight: 600 }, color: '#64748B' },
    },
  },
};

onMounted(async () => {
  loading.value = true;
  errorMessage.value = null;

  try {
    const headers = { Authorization: `Bearer ${authStore.token}` };
    const statsRes = await fetch('/api/stats', { headers });
    const statsData = await statsRes.json();

    if (statsRes.ok) {
      stats.value = {
        members: statsData.members.value,
        activeSubscriptions: statsData.subscriptions.value,
        ticketsSold: statsData.tickets.value,
        dailyRevenue: statsData.revenue.value,
      };
      trends.value = {
        members: statsData.members.trend,
        subscriptions: statsData.subscriptions.trend,
        tickets: statsData.tickets.trend,
        revenue: statsData.revenue.trend,
      };
      recentMembers.value = statsData.recentMembers || [];
    }

    // Chart Data (Simple fetch from transactions)
    const txRes = await fetch('/api/transactions', { headers });
    const transactions = await txRes.json();

    if (txRes.ok && Array.isArray(transactions)) {
      const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      const revenueByDay: Record<string, number> = labels.reduce((acc, l) => ({ ...acc, [l]: 0 }), {});

      const now = new Date();
      const startOf7Days = new Date();
      startOf7Days.setDate(now.getDate() - 6);

      transactions
        .filter(t => t.type === 'income' && new Date(t.date) >= startOf7Days)
        .forEach(t => {
          const label = labels[ (new Date(t.date).getDay() + 6) % 7 ]; // Align with Mon-Sun
          if (label in revenueByDay) revenueByDay[label] += t.amount;
        });

      const values = labels.map(l => revenueByDay[l]);
      chartData.value = {
        ...chartData.value,
        datasets: [{ ...chartData.value.datasets[0], data: values }]
      };
      hasRevenueData.value = values.some(v => v > 0);
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    errorMessage.value = 'Erreur lors du chargement des statistiques.';
  } finally {
    loading.value = false;
  }
});
</script>
