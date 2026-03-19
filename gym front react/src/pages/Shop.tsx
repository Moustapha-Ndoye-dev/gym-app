import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, Search, CreditCard, ShoppingCart, QrCode } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useConfirm } from '../context/ConfirmContext';
import axiosInstance from '../api/axiosInstance';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
};

export const Shop: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Tous']);
  
  const { showNotification } = useNotification();
  const { confirm } = useConfirm();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/api/products');
        const data = res.data;
        if (data && data.length > 0) {
          setProducts(data);
          setCategories(['Tous', ...Array.from(new Set(data.map((p: Product) => p.category).filter(Boolean))) as string[]]);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'Tous' || p.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          showNotification(`Stock insuffisant pour ${product.name}`, 'warning');
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showNotification(`${product.name} ajouté au panier`, 'success', 2000);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return item;
        if (newQuantity > item.product.stock) {
          showNotification('Stock maximum atteint', 'warning');
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    confirm({
      title: 'Encaisser la commande',
      message: `Voulez-vous valider cet encaissement de ${cartTotal.toFixed(2)} € ?`,
      confirmText: 'Payer & Valider',
      variant: 'info',
      onConfirm: async () => {
        try {
          await axiosInstance.post('/api/transactions', {
            amount: cartTotal,
            type: 'income',
            description: `Vente boutique: ${cart.map(c => c.quantity + 'x ' + c.product.name).join(', ')}`,
            date: new Date().toISOString()
          });
          setCart([]);
          showNotification('Vente validée avec succès ! Montant ajouté à la caisse.', 'success');
        } catch (error) {
          showNotification('Erreur lors de l\'enregistrement de la vente', 'error');
        }
      }
    });
  };

  return (
    <div className="flex flex-col xl:flex-row gap-5 h-full">
      {/* Products Section */}
      <div className="flex-1 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Boutique</h1>
            <p className="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Vendez des produits et compléments.</p>
          </div>
          <div className="flex items-center bg-white rounded-lg px-2.5 py-2 shadow-sm border border-slate-200/60 w-full sm:w-56 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <Search className="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] w-full text-slate-700 font-medium placeholder-slate-400"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border ${
                activeCategory === cat 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden group hover:shadow-md hover:border-indigo-200 transition-all flex flex-col">
              <div className="relative h-28 sm:h-36 bg-slate-100 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200/50">
                  Stock: {product.stock}
                </div>
              </div>
              <div className="p-3 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-[12px] font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-[10px] font-bold text-indigo-600 bg-indigo-50 inline-block px-1.5 py-0.5 rounded-md mb-2">{product.price.toFixed(2)} €</p>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`w-full py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all ${
                    product.stock === 0
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-sm'
                  }`}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Ajouter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full xl:w-[320px] bg-white rounded-2xl shadow-sm border border-slate-200/60 flex flex-col h-[500px] xl:h-[calc(100vh-8rem)] shrink-0 sticky top-6">
        <div className="p-4 border-b border-slate-100/80 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-2.5">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <h2 className="text-[14px] font-extrabold text-slate-900">Panier Courant</h2>
          </div>
          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full">
            {cart.reduce((a, b) => a + b.quantity, 0)} items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <ShoppingCart className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-[12px] font-bold">Le panier est vide</p>
              <p className="text-[10px] font-medium mt-1 text-center">Ajoutez des produits pour commencer une vente.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-sm flex items-center gap-3">
                <img src={item.product.image} className="w-10 h-10 rounded-md object-cover border border-slate-100" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-bold text-slate-900 truncate">{item.product.name}</h4>
                  <p className="text-[10px] font-extrabold text-indigo-600 mt-0.5">{(item.product.price * item.quantity).toFixed(2)} €</p>
                </div>
                <div className="flex flex-col items-center border border-slate-200 rounded-md bg-slate-50 shrink-0">
                  <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 hover:bg-slate-200 text-slate-600 rounded-t-md"><Plus className="h-3 w-3" /></button>
                  <span className="text-[10px] font-bold w-6 text-center py-0.5 border-y border-slate-200/50 bg-white">{item.quantity}</span>
                  <button onClick={() => item.quantity === 1 ? removeFromCart(item.product.id) : updateQuantity(item.product.id, -1)} className="p-1 hover:bg-slate-200 text-slate-600 rounded-b-md"><Minus className="h-3 w-3" /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100/80 bg-white rounded-b-2xl">
          <div className="flex justify-between items-end mb-4">
            <span className="text-[12px] font-bold text-slate-500 uppercase">Total à payer</span>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{cartTotal.toFixed(2)} €</span>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-3 rounded-xl font-bold text-[12px] flex items-center justify-center transition-all shadow-md shadow-slate-200 disabled:opacity-50 disabled:shadow-none"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Encaisser {cartTotal.toFixed(2)} €
          </button>
        </div>
      </div>
    </div>
  );
};
