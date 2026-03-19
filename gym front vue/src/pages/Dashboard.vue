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
          <p v-else class="text-[11px] sm:text-[12px] text-slate-500 font-medium">
            Aucune donnée de revenus disponible pour le moment.
          </p>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200/60 flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-[13px] sm:text-[14px] font-extrabold text-slate-900 tracking-tight">Derniers Inscrits</h2>
          <button class="text-[10px] sm:text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md transition-colors">Voir tout</button>
        </div>
        <div class="space-y-2 flex-1">
          <div
            v-if="loading"
            class="text-[11px] sm:text-[12px] text-slate-500 font-medium text-center py-4 border border-dashed border-slate-200 rounded-lg bg-slate-50/60"
          >
            Chargement...
          </div>
          <div
            v-else-if="recentMembers.length === 0"
            class="text-[11px] sm:text-[12px] text-slate-500 font-medium text-center py-4 border border-dashed border-slate-200 rounded-lg bg-slate-50/60"
          >
            Aucun membre récent pour le moment.
          </div>
          <div
            v-else
            v-for="member in recentMembers"
            :key="member.id"
            class="flex items-center justify-between p-2 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-lg transition-all cursor-pointer group"
          >
            <div class="flex items-center">
              <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 text-[10px] sm:text-[11px] font-bold mr-2.5 shadow-sm group-hover:shadow-md transition-shadow">
                {{ member.initials }}
              </div>
              <div>
                <p class="text-[11px] sm:text-[12px] font-bold text-slate-900">{{ member.name }}</p>
                <p class="text-[9px] sm:text-[10px] font-medium text-slate-500 mt-0.5">{{ member.time }}</p>
              </div>
            </div>
            <div
              v-if="member.badge"
              class="text-[8px] sm:text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded"
            >
              {{ member.badge }}
            </div>
          </div>
        </div>
        <button class="w-full mt-3 py-2 border border-slate-200/60 rounded-lg text-[11px] sm:text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
          Ajouter un membre
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

const recentMembers = ref<{ id: number; name: string; time: string; initials: string; badge?: string }[]>([]);
const hasRevenueData = ref(false);

const statCards = computed(() => [
  { title: 'Adhérents', value: stats.value.members, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', trend: trends.value.members },
  { title: 'Abonnements', value: stats.value.activeSubscriptions, icon: ActivityIcon, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', trend: trends.value.subscriptions },
  { title: 'Tickets', value: stats.value.ticketsSold, icon: Ticket, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', trend: trends.value.tickets },
  { title: 'Revenus', value: `${stats.value.dailyRevenue} €`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', trend: trends.value.revenue },
]);

function toValidDate(value: unknown): Date | null {
  if (!value) return null;
  const d = new Date(value as any);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatTrend(current: number, previous: number): string {
  if (current === 0 && previous === 0) return '—';
  if (previous <= 0 && current > 0) return '+100%';
  if (previous <= 0) return '—';
  const pct = ((current - previous) / previous) * 100;
  const rounded = Math.round(pct);
  const sign = rounded > 0 ? '+' : '';
  return `${sign}${rounded}%`;
}

const chartData = ref({
  labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  datasets: [
    {
      label: 'Revenus (€)',
      backgroundColor: (context: any) => {
        const bg = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
        bg.addColorStop(0, 'rgba(79, 70, 229, 0.3)');
        bg.addColorStop(1, 'rgba(79, 70, 229, 0)');
        return bg;
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
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      backgroundColor: '#fff',
      titleColor: '#0F172A',
      bodyColor: '#64748B',
      borderColor: '#E2E8F0',
      borderWidth: 1,
      padding: 8,
      bodyFont: {
        weight: 'bold' as const,
      },
    },
  },
  scales: {
    y: {
      grid: {
        display: true,
        drawBorder: false,
        color: '#F1F5F9',
      },
      ticks: {
        callback: (value: any) => value + '€',
        font: {
          size: 10,
          weight: 600,
        },
        color: '#64748B',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 10,
          weight: 600,
        },
        color: '#64748B',
      },
    },
  },
};

onMounted(async () => {
  loading.value = true;
  errorMessage.value = null;
  let hadJsonParseIssue = false;

  async function fetchJsonArray(url: string): Promise<any[]> {
    const headers = { Authorization: `Bearer ${authStore.token}` };
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} sur ${url}`);
    }
    const text = await res.text();
    if (!text || !text.trim()) {
      hadJsonParseIssue = true;
      return [];
    }
    try {
      return JSON.parse(text);
    } catch {
      // Cas typique: réponse vide -> "Unexpected end of JSON input"
      hadJsonParseIssue = true;
      return [];
    }
  }

  try {
    const [membersData, ticketsData, transactionsData] = await Promise.all([
      fetchJsonArray('/api/members'),
      fetchJsonArray('/api/tickets'),
      fetchJsonArray('/api/transactions'),
    ]);

    if (hadJsonParseIssue) {
      errorMessage.value = 'Certaines données du tableau de bord n\'ont pas pu être lues correctement.';
    }

    const now = new Date();

    const startToday = new Date(now);
    startToday.setHours(0, 0, 0, 0);
    const endToday = new Date(startToday);
    endToday.setDate(endToday.getDate() + 1);

    const startLast7 = new Date(now);
    startLast7.setHours(0, 0, 0, 0);
    startLast7.setDate(startLast7.getDate() - 6);
    const endLast7 = new Date(now);
    endLast7.setHours(23, 59, 59, 999);

    const startPrev7 = new Date(startLast7);
    startPrev7.setDate(startPrev7.getDate() - 7);
    const endPrev7 = new Date(startLast7);

    const prevNow = new Date(now);
    prevNow.setDate(prevNow.getDate() - 7);

    const memberRegDate = (m: any) => toValidDate(m.registrationDate || m.registration_date);
    const memberExpiryDate = (m: any) => toValidDate(m.expiryDate || m.expiry_date);

    const membersLast7 = membersData.filter((m: any) => {
      const d = memberRegDate(m);
      return d && d >= startLast7 && d <= endLast7;
    }).length;

    const membersPrev7 = membersData.filter((m: any) => {
      const d = memberRegDate(m);
      return d && d >= startPrev7 && d < endPrev7;
    }).length;

    const isActiveAt = (m: any, at: Date) => {
      const reg = memberRegDate(m);
      const expiry = memberExpiryDate(m);
      if (!expiry) return false;
      if (expiry < at) return false;
      return reg ? reg <= at : true;
    };

    const activeSubscriptionsNow = membersData.filter((m: any) => isActiveAt(m, now)).length;
    const activeSubscriptionsPrev = membersData.filter((m: any) => isActiveAt(m, prevNow)).length;

    const ticketsCreatedAt = (t: any) => toValidDate(t.createdAt || t.created_at);
    const ticketsLast7 = ticketsData.filter((t: any) => {
      const d = ticketsCreatedAt(t);
      return d && d >= startLast7 && d <= endLast7;
    }).length;

    const ticketsPrev7 = ticketsData.filter((t: any) => {
      const d = ticketsCreatedAt(t);
      return d && d >= startPrev7 && d < endPrev7;
    }).length;

    const txDate = (t: any) => toValidDate(t.date);
    const incomeTransactions = transactionsData.filter((t: any) => t.type === 'income' && txDate(t));

    const dailyRevenue = incomeTransactions
      .filter((t: any) => {
        const d = txDate(t);
        return d && d >= startToday && d < endToday;
      })
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

    const revenueLast7 = incomeTransactions
      .filter((t: any) => {
        const d = txDate(t);
        return d && d >= startLast7 && d <= endLast7;
      })
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

    const revenuePrev7 = incomeTransactions
      .filter((t: any) => {
        const d = txDate(t);
        return d && d >= startPrev7 && d < endPrev7;
      })
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

    stats.value = {
      members: membersData.length,
      activeSubscriptions: activeSubscriptionsNow,
      ticketsSold: ticketsData.length,
      dailyRevenue,
    };

    trends.value = {
      members: formatTrend(membersLast7, membersPrev7),
      subscriptions: formatTrend(activeSubscriptionsNow, activeSubscriptionsPrev),
      tickets: formatTrend(ticketsLast7, ticketsPrev7),
      revenue: formatTrend(revenueLast7, revenuePrev7),
    };

    // Recent members
    const sortedMembers = [...membersData].sort((a: any, b: any) => {
      const da = memberRegDate(a)?.getTime() ?? 0;
      const db = memberRegDate(b)?.getTime() ?? 0;
      return db - da;
    });

    recentMembers.value = sortedMembers.slice(0, 4).map((m: any) => {
      const first = m.firstName || m.first_name || '';
      const last = m.lastName || m.last_name || '';
      const fullName = `${first} ${last}`.trim();
      const reg = memberRegDate(m);
      const badge = reg && reg >= startLast7 ? 'Nouveau' : undefined;
      return {
        id: m.id,
        name: fullName || '—',
        time: reg ? reg.toLocaleDateString() : '—',
        initials: `${(first || '?').charAt(0)}${(last || '?').charAt(0)}`,
        badge,
      };
    });

    // Build weekly revenue chart from real income transactions (last 7 days)
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const revenueByDay: Record<string, number> = {
      Lun: 0, Mar: 0, Mer: 0, Jeu: 0, Ven: 0, Sam: 0, Dim: 0,
    };

    incomeTransactions
      .filter((t: any) => {
        const d = txDate(t);
        return d && d >= startLast7 && d <= endLast7;
      })
      .forEach((t: any) => {
        const d = txDate(t)!;
        const label = days[d.getDay()];
        if (label in revenueByDay) {
          revenueByDay[label] += t.amount || 0;
        }
      });

    const values = chartData.value.labels.map((label: any) => revenueByDay[label] || 0);
    chartData.value = {
      ...chartData.value,
      datasets: chartData.value.datasets.map((ds: any) => ({
        ...ds,
        data: values,
      })),
    };

    hasRevenueData.value = values.some((v) => v > 0);
  } catch (error) {
    console.error('Error fetching stats:', error);
    errorMessage.value = 'Impossible de charger les données du tableau de bord.';
  } finally {
    loading.value = false;
  }
});
</script>
