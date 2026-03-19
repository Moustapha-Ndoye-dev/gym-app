<template>
  <div class="flex flex-col xl:flex-row gap-5 h-full">
    <!-- Products Section -->
    <div class="flex-1 space-y-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Boutique</h1>
          <p class="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Vendez des produits et compléments.</p>
        </div>
        <div class="flex items-center bg-white rounded-lg px-2.5 py-2 shadow-sm border border-slate-200/60 w-full sm:w-56 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <Search class="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Rechercher un produit..."
            class="bg-transparent border-none outline-none text-[11px] w-full text-slate-700 font-medium placeholder-slate-400"
          />
        </div>
      </div>

      <!-- Categories -->
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="activeCategory = cat"
          :class="[
            'px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border',
            activeCategory === cat 
              ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-4">
        <div v-for="product in filteredProducts" :key="product.id" class="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden group hover:shadow-md hover:border-indigo-200 transition-all flex flex-col">
          <div class="relative h-28 sm:h-36 bg-slate-100 overflow-hidden">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200/50">
              Stock: {{ product.stock }}
            </div>
          </div>
          <div class="p-3 flex flex-col flex-1 justify-between">
            <div>
              <h3 class="text-[12px] font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{{ product.name }}</h3>
              <p class="text-[10px] font-bold text-indigo-600 bg-indigo-50 inline-block px-1.5 py-0.5 rounded-md mb-2">{{ product.price.toFixed(2) }} €</p>
            </div>
            <button
              @click="addToCart(product)"
              :disabled="product.stock === 0"
              :class="[
                'w-full py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all',
                product.stock === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-sm'
              ]"
            >
              <Plus class="h-3.5 w-3.5 mr-1" />
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cart Sidebar -->
    <div class="w-full xl:w-[320px] bg-white rounded-2xl shadow-sm border border-slate-200/60 flex flex-col h-[500px] xl:h-[calc(100vh-8rem)] shrink-0 sticky top-6">
      <div class="p-4 border-b border-slate-100/80 flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-2.5">
            <ShoppingBag class="h-4 w-4" />
          </div>
          <h2 class="text-[14px] font-extrabold text-slate-900">Panier Courant</h2>
        </div>
        <span class="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full">
          {{ cartItemCount }} items
        </span>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400">
          <ShoppingCart class="h-10 w-10 text-slate-300 mb-3" />
          <p class="text-[12px] font-bold">Le panier est vide</p>
          <p class="text-[10px] font-medium mt-1 text-center">Ajoutez des produits pour commencer une vente.</p>
        </div>
        <div v-else v-for="item in cart" :key="item.product.id" class="bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-sm flex items-center gap-3">
          <img :src="item.product.image" class="w-10 h-10 rounded-md object-cover border border-slate-100" />
          <div class="flex-1 min-w-0">
            <h4 class="text-[11px] font-bold text-slate-900 truncate">{{ item.product.name }}</h4>
            <p class="text-[10px] font-extrabold text-indigo-600 mt-0.5">{{ (item.product.price * item.quantity).toFixed(2) }} €</p>
          </div>
          <div class="flex flex-col items-center border border-slate-200 rounded-md bg-slate-50 shrink-0">
            <button @click="updateQuantity(item.product.id, 1)" class="p-1 hover:bg-slate-200 text-slate-600 rounded-t-md"><Plus class="h-3 w-3" /></button>
            <span class="text-[10px] font-bold w-6 text-center py-0.5 border-y border-slate-200/50 bg-white">{{ item.quantity }}</span>
            <button @click="item.quantity === 1 ? removeFromCart(item.product.id) : updateQuantity(item.product.id, -1)" class="p-1 hover:bg-slate-200 text-slate-600 rounded-b-md"><Minus class="h-3 w-3" /></button>
          </div>
        </div>
      </div>

      <div class="p-4 border-t border-slate-100/80 bg-white rounded-b-2xl">
        <div class="flex justify-between items-end mb-4">
          <span class="text-[12px] font-bold text-slate-500 uppercase">Total à payer</span>
          <span class="text-2xl font-extrabold text-slate-900 tracking-tight">{{ cartTotal.toFixed(2) }} €</span>
        </div>
        <button 
          :disabled="cart.length === 0"
          @click="handleCheckout"
          class="w-full bg-slate-900 hover:bg-indigo-600 text-white py-3 rounded-xl font-bold text-[12px] flex items-center justify-center transition-all shadow-md shadow-slate-200 disabled:opacity-50 disabled:shadow-none"
        >
          <CreditCard class="h-4 w-4 mr-2" />
          Encaisser {{ cartTotal.toFixed(2) }} €
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ShoppingBag, Plus, Minus, Search, CreditCard, ShoppingCart } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { useConfirmStore } from '../stores/confirm';
import { parseJsonSafe } from '../lib/utils';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const confirmStore = useConfirmStore();

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
};

const products = ref<Product[]>([]);
const searchTerm = ref('');
const activeCategory = ref('Tous');
const cart = ref<{product: Product, quantity: number}[]>([]);

const fetchProducts = async () => {
  try {
    const res = await fetch('/api/products', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    const data = await parseJsonSafe(res, []);
    if (res.ok) products.value = data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

onMounted(fetchProducts);

const categories = computed(() => ['Tous', ...new Set(products.value.map(p => p.category))]);

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesCat = activeCategory.value === 'Tous' || p.category === activeCategory.value;
    return matchesSearch && matchesCat;
  });
});

const cartItemCount = computed(() => cart.value.reduce((a, b) => a + b.quantity, 0));
const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0));

const addToCart = (product: Product) => {
  const existing = cart.value.find(item => item.product.id === product.id);
  if (existing) {
    if (existing.quantity >= product.stock) {
      notificationStore.showNotification(`Stock insuffisant pour ${product.name}`, 'warning');
      return;
    }
    existing.quantity++;
  } else {
    cart.value.push({ product, quantity: 1 });
  }
  notificationStore.showNotification(`${product.name} ajouté au panier`, 'success', 2000);
};

const updateQuantity = (productId: number, delta: number) => {
  const item = cart.value.find(i => i.product.id === productId);
  if (item) {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock) {
      notificationStore.showNotification('Stock maximum atteint', 'warning');
      return;
    }
    item.quantity = newQuantity;
  }
};

const removeFromCart = (productId: number) => {
  cart.value = cart.value.filter(item => item.product.id !== productId);
};

const handleCheckout = () => {
  if (cart.value.length === 0) return;
  
  confirmStore.confirm({
    title: 'Encaisser la commande',
    message: `Voulez-vous valider cet encaissement de ${cartTotal.value.toFixed(2)} € ?`,
    confirmText: 'Payer & Valider',
    variant: 'info',
    onConfirm: async () => {
      try {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
          body: JSON.stringify({
            description: `Vente boutique: ${cart.value.map(i => i.product.name).join(', ')}`,
            amount: cartTotal.value,
            type: 'income',
            date: new Date().toISOString()
          }),
        });
        if (!res.ok) throw new Error();
        cart.value = [];
        fetchProducts();
        notificationStore.showNotification('Vente validée avec succès !', 'success');
      } catch (error) {
        notificationStore.showNotification('Erreur lors de la validation de la vente', 'error');
      }
    }
  });
};
</script>
