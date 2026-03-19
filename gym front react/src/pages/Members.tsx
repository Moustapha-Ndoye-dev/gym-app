import React, { useState, useEffect } from 'react';
import { Plus, Edit, Search, Eye, User, QrCode, Trash2, Phone, Calendar, Mail, CheckCircle, XCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import axiosInstance from '../api/axiosInstance';
import { useNotification } from '../context/NotificationContext';

type Subscription = {
  id: number;
  name: string;
  price: number;
  durationMonths: number;
};

type Member = {
  id: number;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  phone: string;
  email: string;
  registrationDate?: string;
  registration_date?: string;
  expiryDate?: string;
  expiry_date?: string;
  createdAt?: string;
  subscription?: Subscription;
  subscriptionId?: number;
};

export const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<Member>>({});
  const [durationMonths, setDurationMonths] = useState<number>(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { showNotification } = useNotification();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(base64String);
        setCurrentMember({ ...currentMember, photo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchSubscriptions();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axiosInstance.get('/api/members');
      setMembers(res.data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const res = await axiosInstance.get('/api/subscriptions');
      setSubscriptions(res.data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentMember.id ? 'PUT' : 'POST';
    const url = currentMember.id ? `/api/members/${currentMember.id}` : '/api/members';
    
    const dataToSave = {
      ...currentMember,
      durationMonths: durationMonths, // Custom duration
      registration_date: currentMember.registration_date || currentMember.registrationDate || new Date().toISOString()
    };

    try {
      await axiosInstance[method.toLowerCase() as 'put' | 'post'](url, dataToSave);
      setIsModalOpen(false);
      fetchMembers();
      showNotification(currentMember.id ? 'Adhérent mis à jour' : 'Adhérent enregistré avec succès', 'success');
    } catch (error) {
      console.error('Error saving member:', error);
      showNotification('Erreur lors de l\'enregistrement', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous vraiment rompre l\'abonnement de cet adhérent et le supprimer ?')) return;
    
    try {
      await axiosInstance.delete(`/api/members/${id}`);
      fetchMembers();
      showNotification('Adhérent supprimé avec succès', 'success');
    } catch (error) {
      console.error('Error deleting member:', error);
      showNotification('Erreur lors de la suppression', 'error');
    }
  };

  const filteredMembers = members.filter(m => {
    const fn = m.firstName || m.first_name || '';
    const ln = m.lastName || m.last_name || '';
    return fn.toLowerCase().includes(searchTerm.toLowerCase()) ||
           ln.toLowerCase().includes(searchTerm.toLowerCase()) ||
           m.phone?.includes(searchTerm);
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return true;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Adhérents</h1>
          <p className="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Gérez les membres et leurs abonnements.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center bg-white rounded-lg px-2.5 py-2 shadow-sm border border-slate-200/60 w-full sm:w-56 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <Search className="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Rechercher un membre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] w-full text-slate-700 font-medium placeholder-slate-400"
            />
          </div>
          <button
            onClick={() => { setCurrentMember({}); setDurationMonths(1); setIsModalOpen(true); }}
            className="bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold w-full sm:w-auto whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Nouvel Adhérent
          </button>
        </div>
      </div>

      <div className="lg:hidden space-y-2.5">
        {filteredMembers.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200/60 text-center">
            <User className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-[13px] font-bold text-slate-900 leading-tight">Aucun adhérent trouvé</p>
            <p className="text-[11px] text-slate-500 mt-1">Commencez par ajouter votre premier membre.</p>
          </div>
        ) : (
          filteredMembers.map((m) => {
            const expired = isExpired(m.expiryDate || m.expiry_date);
            return (
              <div key={m.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 text-[12px] font-bold shadow-sm border border-indigo-200/50 shrink-0 uppercase">
                      {(m.firstName || m.first_name)?.[0]}{(m.lastName || m.last_name)?.[0]}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-slate-900 leading-tight">{(m.firstName || m.first_name)} {(m.lastName || m.last_name)}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter border ${expired ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                          {expired ? 'Expiré' : 'Actif'}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">#{m.id}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(m.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100">
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Téléphone</div>
                    <div className="text-[11px] font-bold text-slate-700">{m.phone}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Expiration</div>
                    <div className={`text-[11px] font-bold ${expired ? 'text-red-600' : 'text-slate-700'}`}>
                      {formatDate(m.expiryDate || m.expiry_date)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2.5 border-t border-slate-100">
                  <button onClick={() => { setCurrentMember(m); setIsViewModalOpen(true); }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[11px] font-bold hover:bg-slate-100 transition-colors border border-slate-200/60">
                    <QrCode className="h-3.5 w-3.5" /> Carte
                  </button>
                  <button onClick={() => { setCurrentMember(m); setIsModalOpen(true); }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-bold hover:bg-indigo-100 transition-colors border border-indigo-100">
                    <Edit className="h-3.5 w-3.5" /> Modifier
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Membre</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Abonnement</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Expiration</th>
                <th className="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100/80">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <User className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-[13px] font-bold text-slate-900 leading-tight">Aucun adhérent trouvé</p>
                    <p className="text-[11px] text-slate-500 mt-1">Commencez par ajouter votre premier membre.</p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => {
                  const expired = isExpired(m.expiryDate || m.expiry_date);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 text-[11px] font-bold mr-2.5 shadow-sm border border-indigo-200/50 uppercase">
                            {(m.firstName || m.first_name)?.[0]}{(m.lastName || m.last_name)?.[0]}
                          </div>
                          <div>
                            <div className="text-[12px] font-bold text-slate-900">{m.firstName || m.first_name} {m.lastName || m.last_name}</div>
                            <div className="text-[10px] font-medium text-slate-500 mt-0.5">{m.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-[11px] font-bold text-slate-700">{m.subscription?.name || 'Standard'}</div>
                        <div className={`text-[9px] font-black px-1.5 py-0.5 rounded-full inline-block mt-1 uppercase tracking-tighter border ${expired ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                          {expired ? 'Expiré' : 'Actif'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-700">
                        {formatDate(m.expiryDate || m.expiry_date)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-[11px] font-medium">
                        <button onClick={() => { setCurrentMember(m); setIsViewModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors mr-1" title="Voir Carte Membre">
                          <QrCode className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => { setCurrentMember(m); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors mr-1">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(m.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-2xl p-4 max-w-[340px] w-full shadow-xl border border-slate-100 overflow-y-auto max-h-[95vh]">
            <h2 className="text-md font-extrabold text-slate-900 mb-3 tracking-tight">{currentMember.id ? 'Modifier' : 'Ajouter'} adhérent</h2>
            <form onSubmit={handleSave} className="space-y-2.5">
              {/* Photo Upload Section Compact */}
              <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative shrink-0 group cursor-pointer">
                  {photoPreview || currentMember.photo ? (
                    <img src={photoPreview || currentMember.photo} className="w-full h-full object-cover" alt="Aperçu" />
                  ) : (
                    <Plus className="h-4 w-4 text-slate-400" />
                  )}
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">Photo</p>
                  <p className="text-[9px] text-slate-500 leading-tight">Cliquez pour {currentMember.photo ? 'changer' : 'ajouter'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Prénom</label>
                  <input type="text" required value={currentMember.firstName || currentMember.first_name || ''} onChange={e => setCurrentMember({...currentMember, firstName: e.target.value, first_name: e.target.value})} className="block w-full px-2 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Nom</label>
                  <input type="text" required value={currentMember.lastName || currentMember.last_name || ''} onChange={e => setCurrentMember({...currentMember, lastName: e.target.value, last_name: e.target.value})} className="block w-full px-2 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Téléphone</label>
                <input type="text" required value={currentMember.phone || ''} onChange={e => setCurrentMember({...currentMember, phone: e.target.value})} className="block w-full px-2 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Abonnement</label>
                  <select 
                    required 
                    value={currentMember.subscriptionId || ''} 
                    onChange={e => setCurrentMember({...currentMember, subscriptionId: parseInt(e.target.value)})}
                    className="block w-full px-2 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] outline-none"
                  >
                    <option value="">Choisir...</option>
                    {subscriptions.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Durée</label>
                  <select 
                    value={durationMonths} 
                    onChange={e => setDurationMonths(parseInt(e.target.value))}
                    className="block w-full px-2 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] outline-none"
                  >
                    <option value={1}>1 Mois</option>
                    <option value={3}>3 Mois</option>
                    <option value={6}>6 Mois</option>
                    <option value={12}>12 Mois</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-100">Annuler</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[11px] font-bold shadow-sm hover:bg-indigo-700">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewModalOpen && currentMember.id && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-2xl p-0 max-w-[280px] w-full text-center shadow-2xl relative overflow-hidden border border-slate-100 animate-in zoom-in duration-200">
            {/* Design de la carte */}
            <div className={`h-20 w-full ${isExpired(currentMember.expiryDate || currentMember.expiry_date) ? 'bg-slate-400' : 'bg-gradient-to-br from-indigo-600 to-purple-700'} relative`}>
              <div className="absolute top-3 right-4 opacity-20">
                <QrCode className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <div className="px-5 pb-6 -mt-10 relative z-10">
              <div className="w-20 h-20 mx-auto bg-white rounded-2xl p-1 shadow-xl mb-3 border border-slate-50 overflow-hidden">
                {currentMember.photo ? (
                  <img src={currentMember.photo} className="w-full h-full object-cover rounded-xl" alt="Membre" />
                ) : (
                  <div className="w-full h-full rounded-xl bg-slate-50 flex items-center justify-center text-2xl font-black text-indigo-600 border border-slate-100 uppercase">
                    {(currentMember.firstName || currentMember.first_name)?.[0]}{(currentMember.lastName || currentMember.last_name)?.[0]}
                  </div>
                )}
              </div>
              
              <h2 className="text-lg font-black text-slate-900 tracking-tight">{(currentMember.firstName || currentMember.first_name)} {(currentMember.lastName || currentMember.last_name)}</h2>
              <div className="flex items-center justify-center gap-2 mt-1 mb-4">
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider border ${isExpired(currentMember.expiryDate || currentMember.expiry_date) ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                  {isExpired(currentMember.expiryDate || currentMember.expiry_date) ? 'Expiré' : 'Membre Actif'}
                </span>
                <span className="text-[9px] font-bold text-slate-400">#{currentMember.id}</span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-5 flex flex-col items-center">
                <div className="bg-white p-1.5 rounded-lg border border-slate-200/60 shadow-sm mb-2">
                  <QRCodeSVG value={`MEMBER-${currentMember.id}`} size={110} level="H" />
                </div>
                <div className="grid grid-cols-2 w-full gap-2 mt-1">
                  <div className="text-left">
                    <p className="text-[8px] font-black text-slate-400 uppercase">Émis le</p>
                    <p className="text-[10px] font-bold text-slate-700">{formatDate(currentMember.registrationDate || currentMember.registration_date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-400 uppercase">Validité</p>
                    <p className={`text-[10px] font-bold ${isExpired(currentMember.expiryDate || currentMember.expiry_date) ? 'text-red-600' : 'text-slate-700'}`}>
                      {formatDate(currentMember.expiryDate || currentMember.expiry_date)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => window.print()} className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-bold shadow-sm shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5">
                   Imprimer
                </button>
                <button type="button" onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-bold text-slate-700 hover:bg-slate-200 transition-colors">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
