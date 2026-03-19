<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100 shadow-sm shrink-0">
           <ShoppingBag class="h-6 w-6" />
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Boutique</h1>
          <p class="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Vendez des produits et compléments.</p>
        </div>
      </div>
      
      <div class="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto self-end sm:self-center">
        <button 
          @click="mode = 'sell'"
          :class="['flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5', mode === 'sell' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700']"
        >
          <CreditCard class="h-3.5 w-3.5" /> Vente
        </button>
        <button 
          @click="mode = 'manage'"
          :class="['flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5', mode === 'manage' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700']"
        >
          <Settings class="h-3.5 w-3.5" /> Stock
        </button>
      </div>
    </div>

    <div v-if="mode === 'sell'" class="flex flex-col xl:flex-row gap-5 h-full">
      <!-- Products Section -->
      <div class="flex-1 space-y-4">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm">
          <div class="flex gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="activeCategory = cat"
              :class="['px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border', activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50']"
            >
              {{ cat }}
            </button>
          </div>
          <div class="flex items-center bg-slate-50 rounded-xl px-2.5 py-2 border border-slate-200/60 w-full sm:w-56 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-600 focus-within:border-transparent transition-all">
            <Search class="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Chercher..."
              class="bg-transparent border-none outline-none text-[11px] w-full text-slate-700 font-bold placeholder-slate-400"
            />
          </div>
        </div>

        <div v-if="filteredProducts.length === 0" class="col-span-full bg-white p-12 rounded-2xl shadow-sm border border-slate-200/60 text-center">
          <ShoppingBag class="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p class="text-[13px] font-black text-slate-900 leading-tight">Aucun produit disponible</p>
          <p class="text-[11px] text-slate-500 mt-1">Changez de catégorie ou recherchez un autre nom.</p>
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-4">
          <div v-for="product in filteredProducts" :key="product.id" class="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden group hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col relative animate-in fade-in zoom-in duration-300">
            <div class="relative h-28 sm:h-36 bg-slate-50 flex items-center justify-center p-4">
              <img v-if="product.image" :src="product.image" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
              <Package v-else class="h-12 w-12 text-slate-200 group-hover:scale-110 transition-transform duration-500" />
              <div :class="['absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm', product.stock > 0 ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100']">
                {{ product.stock > 0 ? `Stock: ${product.stock}` : 'Rupture' }}
              </div>
            </div>
            <div class="p-4 flex flex-col flex-1">
              <div class="mb-3">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ product.category || 'Général' }}</p>
                <h3 class="text-[13px] font-black text-slate-900 leading-tight line-clamp-2 min-h-[2.5rem]">{{ product.name }}</h3>
              </div>
              <div class="flex items-center justify-between mt-auto pt-3 border-t border-slate-100/60">
                <span class="text-[14px] font-black text-slate-900">{{ product.price.toFixed(0) }} FCFA</span>
                <button
                  @click="addToCart(product)"
                  :disabled="product.stock === 0"
                  :class="['p-2 rounded-xl transition-all', product.stock === 0 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100']"
                >
                  <Plus class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart Sidebar -->
      <div class="w-full xl:w-[340px] bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col h-[550px] xl:h-[calc(100vh-9rem)] shrink-0 sticky top-6 overflow-hidden">
        <div class="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
              <ShoppingCart class="h-4.5 w-4.5" />
            </div>
            <h2 class="text-[15px] font-black text-slate-900 tracking-tight">Vente en cours</h2>
          </div>
          <button @click="cart = []" class="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-wider">Vider</button>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 p-8">
            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart class="h-8 w-8 text-slate-200" />
            </div>
            <p class="text-[13px] font-black text-slate-900">Le panier est vide</p>
            <p class="text-[11px] text-slate-500 mt-1 text-center font-medium">Cliquez sur un produit pour l'ajouter à la vente.</p>
          </div>
          <div v-else v-for="item in cart" :key="item.product.id" class="group bg-slate-50 p-3 rounded-2xl border border-transparent hover:border-slate-200 transition-all flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-white border border-slate-100 p-1 shrink-0 overflow-hidden flex items-center justify-center">
              <img v-if="item.product.image" :src="item.product.image" class="w-full h-full object-contain" />
              <Package v-else class="h-6 w-6 text-slate-200" />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-[12px] font-black text-slate-900 truncate">{{ item.product.name }}</h4>
              <p class="text-[11px] font-bold text-indigo-600 mt-0.5">{{ item.product.price.toFixed(0) }} FCFA</p>
            </div>
            <div class="flex items-center bg-white p-1 rounded-lg border border-slate-200/60 shadow-sm shrink-0">
              <button @click="item.quantity === 1 ? removeFromCart(item.product.id) : updateQuantity(item.product.id, -1)" class="p-1 hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"><Minus class="h-3.5 w-3.5" /></button>
              <span class="text-[12px] font-black w-7 text-center text-slate-900">{{ item.quantity }}</span>
              <button @click="updateQuantity(item.product.id, 1)" class="p-1 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"><Plus class="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-slate-50 bg-slate-50/80">
          <div class="flex justify-between items-center mb-5">
            <span class="text-[12px] font-black text-slate-500 uppercase tracking-widest">Total</span>
            <span class="text-2xl font-black text-slate-900 tracking-tighter">{{ cartTotal.toFixed(0) }} FCFA</span>
          </div>
          <button 
            :disabled="cart.length === 0"
            @click="handleCheckout"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-[13px] uppercase tracking-wider flex items-center justify-center transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:shadow-none"
          >
            Valider l'encaissement
          </button>
        </div>
      </div>
    </div>

    <!-- Manage Mode -->
    <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden animate-in fade-in duration-300">
      <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 class="text-[14px] font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Package class="h-4 w-4 text-indigo-500" />
          Liste des Produits en Stock
        </h2>
        <button 
          @click="openAddProductModal"
          class="bg-indigo-600 text-white px-3 py-2 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all text-[11px] font-black uppercase tracking-wider"
        >
          <PlusCircle class="h-3.5 w-3.5 mr-2" />
          Nouveau Produit
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100">
          <thead class="bg-slate-50/30">
            <tr>
              <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Produit</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
              <th class="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-50">
            <tr v-if="products.length === 0">
              <td colSpan="5" class="px-6 py-12 text-center">
                <Package class="h-10 w-10 text-slate-200 mx-auto mb-3" />
                <p class="text-[13px] font-black text-slate-900">Aucun produit configuré</p>
                <p class="text-[11px] text-slate-500 mt-1 font-medium">Commencez par ajouter votre inventaire.</p>
              </td>
            </tr>
            <tr v-else v-for="p in products" :key="p.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
                     <img v-if="p.image" :src="p.image" class="w-full h-full object-contain" />
                     <Package v-else class="h-5 w-5 text-slate-300" />
                  </div>
                  <span class="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{{ p.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">{{ p.category || 'Non classé' }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-[13px] font-black text-slate-900">{{ p.price.toFixed(0) }} FCFA</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                   <span :class="['text-[12px] font-black', p.stock <= 0 ? 'text-red-500' : p.stock < 5 ? 'text-amber-500' : 'text-emerald-500']">
                      {{ p.stock }}
                   </span>
                   <AlertCircle v-if="p.stock <= 0" class="h-3.5 w-3.5 text-red-500" />
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-[11px] font-medium">
                <button @click="openEditProductModal(p)" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all mr-1">
                  <Edit class="h-4 w-4" />
                </button>
                <button @click="handleDeleteProduct(p.id)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Product Modal (Reduced Size) -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50">
      <div class="bg-white rounded-2xl p-4 max-w-[320px] w-full shadow-2xl border border-slate-100 animate-in zoom-in duration-200 overflow-y-auto max-h-[95vh]">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-md font-black text-slate-900 tracking-tight">{{ currentProduct.id ? 'Modifier' : 'Ajouter' }} produit</h2>
          <button @click="isModalOpen = false" class="p-1 hover:bg-slate-100 rounded-full transition-colors"><X class="h-4 w-4 text-slate-400" /></button>
        </div>
        <form @submit.prevent="handleSaveProduct" class="space-y-3">
          
          <!-- Product Photo Upload Compact -->
          <div class="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
            <div class="w-14 h-14 rounded-xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative shrink-0 group cursor-pointer">
              <img v-if="photoPreview || currentProduct.image" :src="photoPreview || currentProduct.image" class="w-full h-full object-contain" />
              <PlusCircle v-else class="h-5 w-5 text-slate-300" />
              <input type="file" accept="image/*" @change="handlePhotoChange" class="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div class="flex-1">
              <p class="text-[10px] font-black text-slate-700 uppercase tracking-tight">Image produit</p>
              <p class="text-[9px] text-slate-500 leading-tight">Optionnel</p>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Nom du produit</label>
            <input required v-model="currentProduct.name" type="text" class="block w-full px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] font-bold text-slate-900 outline-none" placeholder="Ex: Whey Protein" />
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Prix</label>
              <input required v-model.number="currentProduct.price" type="number" class="block w-full px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] font-bold text-slate-900 outline-none" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Stock</label>
              <input required v-model.number="currentProduct.stock" type="number" class="block w-full px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] font-bold text-slate-900 outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Catégorie</label>
            <input v-model="currentProduct.category" type="text" class="block w-full px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] font-bold text-slate-900 outline-none" placeholder="Ex: Nutrition" />
          </div>

          <div class="flex gap-2 mt-4 pt-3 border-t border-slate-50">
            <button type="button" @click="isModalOpen = false" class="flex-1 py-2 rounded-xl text-[11px] font-black text-slate-500 hover:bg-slate-50 uppercase tracking-wider">Annuler</button>
            <button type="submit" class="flex-[2] py-2 bg-indigo-600 text-white rounded-xl text-[11px] font-black shadow-lg hover:bg-indigo-700 uppercase tracking-wider">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ShoppingBag, Plus, Minus, Search, CreditCard, ShoppingCart, Settings, Package, Edit, Trash2, X, PlusCircle, AlertCircle } from 'lucide-vue-next';
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
  image?: string;
};

const mode = ref<'sell' | 'manage'>('sell');
const products = ref<Product[]>([]);
const searchTerm = ref('');
const activeCategory = ref('Tous');
const cart = ref<{product: Product, quantity: number}[]>([]);
const isModalOpen = ref(false);
const currentProduct = ref<Partial<Product>>({});
const photoPreview = ref<string | null>(null);

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

const categories = computed(() => ['Tous', ...new Set(products.value.map(p => p.category).filter(Boolean))]);

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesCat = activeCategory.value === 'Tous' || p.category === activeCategory.value;
    return matchesSearch && matchesCat;
  });
});

const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0));
const cartItemCount = computed(() => cart.value.reduce((a, b) => a + b.quantity, 0));

const handlePhotoChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      photoPreview.value = reader.result as string;
      currentProduct.value.image = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

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
  notificationStore.showNotification(`${product.name} ajouté`, 'success', 1000);
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
    message: `Voulez-vous valider cet encaissement de ${cartTotal.value.toFixed(0)} FCFA ?`,
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
            amount: cartTotal.value,
            type: 'income',
            description: `Vente boutique: ${cart.value.map(c => c.quantity + 'x ' + c.product.name).join(', ')}`,
            date: new Date().toISOString()
          }),
        });
        if (!res.ok) throw new Error();
        cart.value = [];
        fetchProducts();
        notificationStore.showNotification('Vente validée avec succès !', 'success');
      } catch (error) {
        notificationStore.showNotification('Erreur lors de l\'enregistrement de la vente', 'error');
      }
    }
  });
};

const openAddProductModal = () => {
  currentProduct.value = { name: '', price: 0, stock: 0, category: '' };
  photoPreview.value = null;
  isModalOpen.value = true;
};

const openEditProductModal = (product: Product) => {
  currentProduct.value = { ...product };
  photoPreview.value = product.image || null;
  isModalOpen.value = true;
};

const handleSaveProduct = async () => {
  const method = currentProduct.value.id ? 'PUT' : 'POST';
  const url = currentProduct.value.id ? `/api/products/${currentProduct.value.id}` : '/api/products';
  
  try {
    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(currentProduct.value),
    });
    if (!res.ok) throw new Error();
    isModalOpen.value = false;
    photoPreview.value = null;
    fetchProducts();
    notificationStore.showNotification(`Produit ${currentProduct.value.id ? 'mis à jour' : 'créé'}`, 'success');
  } catch (error) {
    notificationStore.showNotification('Erreur lors de l\'enregistrement', 'error');
  }
};

const handleDeleteProduct = async (id: number) => {
  confirmStore.confirm({
    title: 'Supprimer le produit',
    message: 'Voulez-vous vraiment supprimer ce produit ?',
    confirmText: 'Supprimer',
    variant: 'danger',
    onConfirm: async () => {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authStore.token}` }
        });
        if (res.ok) {
          fetchProducts();
          notificationStore.showNotification('Produit supprimé', 'success');
        }
      } catch (error) {
        notificationStore.showNotification('Erreur lors de la suppression', 'error');
      }
    }
  });
};
</script>
