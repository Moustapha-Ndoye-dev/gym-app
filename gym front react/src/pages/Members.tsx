import React, { useState, useEffect } from 'react';
import { Plus, Edit, Search, Eye, User, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import axiosInstance from '../api/axiosInstance';

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
  createdAt?: string;
};

// Mock data removed

export const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<Member>>({});

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axiosInstance.get('/api/members');
      const data = res.data;
      if (data && data.length > 0) {
        setMembers(data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentMember.id ? 'PUT' : 'POST';
    const url = currentMember.id ? `/api/members/${currentMember.id}` : '/api/members';
    
    const dataToSave = {
      ...currentMember,
      registration_date: currentMember.registration_date || currentMember.registrationDate || new Date().toISOString().split('T')[0]
    };

    try {
      await axiosInstance[method.toLowerCase() as 'put' | 'post'](url, dataToSave);
      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      // Removed mock fallback
    }
  };

  const filteredMembers = members.filter(m => {
    const fn = m.firstName || m.first_name || '';
    const ln = m.lastName || m.last_name || '';
    return fn.toLowerCase().includes(searchTerm.toLowerCase()) ||
           ln.toLowerCase().includes(searchTerm.toLowerCase()) ||
           m.phone?.includes(searchTerm);
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Adhérents</h1>
          <p className="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Gérez les membres de votre salle.</p>
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
            onClick={() => { setCurrentMember({}); setIsModalOpen(true); }}
            className="bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold w-full sm:w-auto whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Nouvel Adhérent
          </button>
        </div>
      </div>

      {/* Mobile View (Cards) */}
      <div className="lg:hidden space-y-2.5">
        {filteredMembers.map((m) => (
          <div key={m.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 text-[12px] font-bold shadow-sm border border-indigo-200/50 shrink-0 uppercase">
                  {(m.firstName || m.first_name)?.[0]}{(m.lastName || m.last_name)?.[0]}
                </div>
                <div>
                  <div className="text-[13px] font-bold text-slate-900 leading-tight">{(m.firstName || m.first_name)} {(m.lastName || m.last_name)}</div>
                  <div className="text-[10px] font-medium text-slate-500 mt-0.5">ID: #{m.id}</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100">
              <div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Téléphone</div>
                <div className="text-[11px] font-bold text-slate-700">{m.phone}</div>
              </div>
              <div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Inscription</div>
                <div className="text-[11px] font-bold text-slate-700">{new Date(m.registrationDate || m.registration_date || m.createdAt || '').toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
            <div className="flex gap-2 pt-2.5 border-t border-slate-100">
              <button onClick={() => { setCurrentMember(m); setIsViewModalOpen(true); }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[11px] font-bold hover:bg-slate-100 transition-colors border border-slate-200/60">
                <QrCode className="h-3.5 w-3.5" /> QR Code
              </button>
              <button onClick={() => { setCurrentMember(m); setIsModalOpen(true); }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-bold hover:bg-indigo-100 transition-colors border border-indigo-100">
                <Edit className="h-3.5 w-3.5" /> Modifier
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Membre</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Date d'inscription</th>
                <th className="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100/80">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 text-[11px] font-bold mr-2.5 shadow-sm border border-indigo-200/50 uppercase">
                        {(m.firstName || m.first_name)?.[0]}{(m.lastName || m.last_name)?.[0]}
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-slate-900">{m.firstName || m.first_name} {m.lastName || m.last_name}</div>
                        <div className="text-[10px] font-medium text-slate-500 mt-0.5">ID: #{m.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-[11px] font-bold text-slate-700">{m.phone}</div>
                    <div className="text-[10px] font-medium text-slate-500 mt-0.5">{m.email || 'Non renseigné'}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-700">
                    {new Date(m.registrationDate || m.registration_date || m.createdAt || '').toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-[11px] font-medium">
                    <button onClick={() => { setCurrentMember(m); setIsViewModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors mr-1" title="Générer QR Code">
                      <QrCode className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => { setCurrentMember(m); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl border border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4 tracking-tight">{currentMember.id ? 'Modifier' : 'Ajouter'} un adhérent</h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Prénom</label>
                  <input type="text" required value={currentMember.firstName || currentMember.first_name || ''} onChange={e => setCurrentMember({...currentMember, first_name: e.target.value})} className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nom</label>
                  <input type="text" required value={currentMember.lastName || currentMember.last_name || ''} onChange={e => setCurrentMember({...currentMember, last_name: e.target.value})} className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Téléphone</label>
                <input type="text" required value={currentMember.phone || ''} onChange={e => setCurrentMember({...currentMember, phone: e.target.value})} className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Email (optionnel)</label>
                <input type="email" value={currentMember.email || ''} onChange={e => setCurrentMember({...currentMember, email: e.target.value})} className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
              </div>
              <div className="flex justify-end space-x-2 mt-6 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-2 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-colors">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[11px] font-bold shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && currentMember.id && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full text-center shadow-xl relative overflow-hidden border border-slate-100">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-br from-indigo-500 to-purple-600"></div>
            
            <div className="relative z-10 mt-6">
              <div className="w-20 h-20 mx-auto bg-white rounded-full p-1 shadow-md mb-3">
                <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center text-2xl font-extrabold text-indigo-600 border border-slate-100">
                  {currentMember.first_name?.charAt(0)}{currentMember.last_name?.charAt(0)}
                </div>
              </div>
              
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{(currentMember.firstName || currentMember.first_name)} {(currentMember.lastName || currentMember.last_name)}</h2>
              <p className="text-[11px] font-bold text-indigo-600 mb-4 bg-indigo-50 inline-block px-2.5 py-0.5 rounded-full mt-1.5 border border-indigo-100">Membre #{currentMember.id}</p>
              
              <div className="bg-white p-3 rounded-xl inline-block mb-4 border border-slate-200/60 shadow-sm">
                <QRCodeSVG value={`MEMBER-${currentMember.id}`} size={120} />
              </div>
              
              <p className="text-[10px] font-medium text-slate-500 mb-6 px-2">
                Présentez ce QR Code à l'accueil pour accéder à la salle.
              </p>

              <button type="button" onClick={() => setIsViewModalOpen(false)} className="w-full px-3 py-2 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-200 transition-colors">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
