import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, Search, CreditCard, ShoppingCart, Settings, Package, Edit, Trash2, X, PlusCircle, AlertCircle } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useConfirm } from '../context/ConfirmContext';
import axiosInstance from '../api/axiosInstance';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
};

export const Shop: React.FC = () => {
  const [mode, setMode] = useState<'sell' | 'manage'>('sell');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Tous']);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { showNotification } = useNotification();
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/api/products');
      const data = res.data;
      setProducts(data || []);
      if (data && data.length > 0) {
        setCategories(['Tous', ...Array.from(new Set(data.map((p: Product) => p.category).filter(Boolean))) as string[]]);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(base64String);
        setCurrentProduct({ ...currentProduct, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentProduct.id ? 'put' : 'post';
    const url = currentProduct.id ? `/api/products/${currentProduct.id}` : '/api/products';
    
    try {
      await axiosInstance[method](url, currentProduct);
      setIsModalOpen(false);
      setPhotoPreview(null);
      fetchProducts();
      showNotification(`Produit ${currentProduct.id ? 'mis à jour' : 'créé'} avec succès`, 'success');
    } catch (error) {
      showNotification('Erreur lors de l\'enregistrement du produit', 'error');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    confirm({
      title: 'Supprimer le produit',
      message: 'Voulez-vous vraiment supprimer ce produit de la boutique ?',
      confirmText: 'Supprimer',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`/api/products/${id}`);
          fetchProducts();
          showNotification('Produit supprimé', 'success');
        } catch (error) {
          showNotification('Erreur lors de la suppression', 'error');
        }
      }
    });
  };

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
    showNotification(`${product.name} ajouté`, 'success', 1000);
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
      message: `Voulez-vous valider cet encaissement de ${cartTotal.toFixed(2)} FCFA ?`,
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
          
          fetchProducts();
          setCart([]);
          showNotification('Vente validée avec succès !', 'success');
        } catch (error) {
          showNotification('Erreur lors de l\'enregistrement de la vente', 'error');
        }
      }
    });
  };

  const openAddProductModal = () => {
    setCurrentProduct({ stock: 0, price: 0 });
    setPhotoPreview(null);
    setIsModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setCurrentProduct({ ...product });
    setPhotoPreview(product.image || null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100 shadow-sm shrink-0">
             <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Boutique</h1>
            <p className="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Vendez des produits et compléments.</p>
          </div>
        </div>
        
        <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto self-end sm:self-center">
          <button 
            onClick={() => setMode('sell')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${mode === 'sell' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <CreditCard className="h-3.5 w-3.5" /> Vente
          </button>
          <button 
            onClick={() => setMode('manage')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${mode === 'manage' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Settings className="h-3.5 w-3.5" /> Stock
          </button>
        </div>
      </div>

      {mode === 'sell' ? (
        <div className="flex flex-col xl:flex-row gap-5 h-full">
          {/* Products Section */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="flex gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                      activeCategory === cat 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex items-center bg-slate-50 rounded-xl px-2.5 py-2 border border-slate-200/60 w-full sm:w-56 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-600 focus-within:border-transparent transition-all">
                <Search className="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Chercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-[11px] w-full text-slate-700 font-bold placeholder-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-4">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full bg-white p-12 rounded-2xl shadow-sm border border-slate-200/60 text-center">
                  <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-[13px] font-black text-slate-900 leading-tight">Aucun produit disponible</p>
                  <p className="text-[11px] text-slate-500 mt-1">Changez de catégorie ou recherchez un autre nom.</p>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden group hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col relative animate-in fade-in zoom-in duration-300">
                    <div className="relative h-28 sm:h-36 bg-slate-50 flex items-center justify-center p-4">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <Package className="h-12 w-12 text-slate-200 group-hover:scale-110 transition-transform duration-500" />
                      )}
                      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm ${product.stock > 0 ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        {product.stock > 0 ? `Stock: ${product.stock}` : 'Rupture'}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="mb-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{product.category || 'Général'}</p>
                        <h3 className="text-[13px] font-black text-slate-900 leading-tight line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100/60">
                        <span className="text-[14px] font-black text-slate-900">{product.price.toFixed(0)} FCFA</span>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className={`p-2 rounded-xl transition-all ${
                            product.stock === 0
                              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100'
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="w-full xl:w-[340px] bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col h-[550px] xl:h-[calc(100vh-9rem)] shrink-0 sticky top-6 overflow-hidden">
            <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                  <ShoppingCart className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-[15px] font-black text-slate-900 tracking-tight">Vente en cours</h2>
              </div>
              <button onClick={() => setCart([])} className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-wider">Vider</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="h-8 w-8 text-slate-200" />
                  </div>
                  <p className="text-[13px] font-black text-slate-900">Le panier est vide</p>
                  <p className="text-[11px] text-slate-500 mt-1 text-center font-medium">Cliquez sur un produit pour l'ajouter à la vente.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="group bg-slate-50 p-3 rounded-2xl border border-transparent hover:border-slate-200 transition-all flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                      {item.product.image ? <img src={item.product.image} className="w-full h-full object-contain" /> : <Package className="h-6 w-6 text-slate-200" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[12px] font-black text-slate-900 truncate">{item.product.name}</h4>
                      <p className="text-[11px] font-bold text-indigo-600 mt-0.5">{item.product.price.toFixed(0)} FCFA</p>
                    </div>
                    <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200/60 shadow-sm shrink-0">
                      <button onClick={() => item.quantity === 1 ? removeFromCart(item.product.id) : updateQuantity(item.product.id, -1)} className="p-1 hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="text-[12px] font-black w-7 text-center text-slate-900">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-slate-50 bg-slate-50/80">
              <div className="flex justify-between items-center mb-5">
                <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest">Total</span>
                <span className="text-2xl font-black text-slate-900 tracking-tighter">{cartTotal.toFixed(0)} FCFA</span>
              </div>
              <button 
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-[13px] uppercase tracking-wider flex items-center justify-center transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:shadow-none"
              >
                Valider l'encaissement
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden animate-in fade-in duration-300">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-[14px] font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Package className="h-4 w-4 text-indigo-500" />
              Liste des Produits en Stock
            </h2>
            <button 
              onClick={openAddProductModal}
              className="bg-indigo-600 text-white px-3 py-2 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all text-[11px] font-black uppercase tracking-wider"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-2" />
              Nouveau Produit
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/30">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Produit</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Package className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                      <p className="text-[13px] font-black text-slate-900">Aucun produit configuré</p>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium">Commencez par ajouter votre inventaire.</p>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
                             {p.image ? <img src={p.image} className="w-full h-full object-contain" /> : <Package className="h-5 w-5 text-slate-300" />}
                          </div>
                          <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">{p.category || 'Non classé'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-black text-slate-900">{p.price.toFixed(0)} FCFA</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                           <span className={`text-[12px] font-black ${p.stock <= 0 ? 'text-red-500' : p.stock < 5 ? 'text-amber-500' : 'text-emerald-500'}`}>
                              {p.stock}
                           </span>
                           {p.stock <= 0 && <AlertCircle className="h-3.5 w-3.5 text-red-500" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-[11px] font-medium">
                        <button onClick={() => openEditProductModal(p)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all mr-1">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-2xl p-4 max-w-[320px] w-full shadow-2xl border border-slate-100 animate-in zoom-in duration-200 overflow-y-auto max-h-[95vh]">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-md font-black text-slate-900 tracking-tight">{currentProduct.id ? 'Modifier' : 'Ajouter'} produit</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-3">
              
              {/* Product Photo Upload Compact */}
              <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                <div className="w-14 h-14 rounded-xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative shrink-0 group cursor-pointer">
                  {photoPreview || currentProduct.image ? (
                    <img src={photoPreview || currentProduct.image} className="w-full h-full object-contain" alt="Produit" />
                  ) : (
                    <PlusCircle className="h-5 w-5 text-slate-300" />
                  )}
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">Image produit</p>
                  <p className="text-[9px] text-slate-500 leading-tight">Optionnel</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Nom du produit</label>
                <input required type="text" value={currentProduct.name || ''} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="block w-full px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] font-bold text-slate-900 outline-none" placeholder="Ex: Whey Protein" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Prix</label>
                  <input required type="number" value={currentProduct.price || ''} onChange={e => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})} className="block w-full px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] font-bold text-slate-900 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Stock</label>
                  <input required type="number" value={currentProduct.stock || ''} onChange={e => setCurrentProduct({...currentProduct, stock: parseInt(e.target.value)})} className="block w-full px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] font-bold text-slate-900 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Catégorie</label>
                <input type="text" value={currentProduct.category || ''} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} className="block w-full px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] font-bold text-slate-900 outline-none" placeholder="Ex: Nutrition" />
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-slate-50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-xl text-[11px] font-black text-slate-500 hover:bg-slate-50 uppercase tracking-wider">Annuler</button>
                <button type="submit" className="flex-[2] py-2 bg-indigo-600 text-white rounded-xl text-[11px] font-black shadow-lg hover:bg-indigo-700 uppercase tracking-wider">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};