import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CreditCard, Tag } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

type Subscription = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_months: number;
  activities: number[];
};

type Activity = {
  id: number;
  name: string;
};

// Mock data removed

export const Subscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSub, setCurrentSub] = useState<Partial<Subscription>>({ activities: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subsRes, actsRes] = await Promise.all([
        axiosInstance.get('/api/subscriptions'),
        axiosInstance.get('/api/activities')
      ]);
      const subsData = subsRes.data;
      const actsData = actsRes.data;
      
      if (subsData && subsData.length > 0) setSubscriptions(subsData);
      if (actsData && actsData.length > 0) setActivities(actsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentSub.id ? 'PUT' : 'POST';
    const url = currentSub.id ? `/api/subscriptions/${currentSub.id}` : '/api/subscriptions';
    
    try {
      await axiosInstance[method.toLowerCase() as 'put' | 'post'](url, currentSub);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ?')) {
      try {
        await axiosInstance.delete(`/api/subscriptions/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting subscription:', error);
      }
    }
  };

  const toggleActivity = (activityId: number) => {
    const currentActivities = currentSub.activities || [];
    if (currentActivities.includes(activityId)) {
      setCurrentSub({ ...currentSub, activities: currentActivities.filter(id => id !== activityId) });
    } else {
      setCurrentSub({ ...currentSub, activities: [...currentActivities, activityId] });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Abonnements</h1>
          <p className="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Gérez les formules d'abonnement.</p>
        </div>
        <button
          onClick={() => { setCurrentSub({ activities: [] }); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold w-full sm:w-auto"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Nouvel Abonnement
        </button>
      </div>

      {/* Mobile View (Cards) */}
      <div className="lg:hidden space-y-2.5">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 flex flex-col gap-2.5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm shrink-0">
                  <CreditCard className="h-4 w-4 text-indigo-500" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-slate-900 leading-tight mb-0.5">{sub.name}</div>
                  <div className="text-[11px] font-medium text-slate-500 line-clamp-1">{sub.description}</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100 mt-1">
              <div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Prix</div>
                <div className="text-[13px] font-extrabold text-emerald-600">{sub.price.toFixed(2)} €</div>
              </div>
              <div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Durée</div>
                <div className="text-[11px] font-bold text-slate-700">{sub.duration_months} mois</div>
              </div>
            </div>
            <div className="pt-2.5 border-t border-slate-100 mt-1">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Activités incluses</div>
              <div className="flex flex-wrap gap-1.5">
                {sub.activities.map(actId => {
                  const act = activities.find(a => a.id === actId);
                  return act ? (
                    <span key={actId} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold border border-slate-200">
                      {act.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
            <div className="flex gap-2 pt-2.5 border-t border-slate-100 mt-1">
              <button onClick={() => { setCurrentSub(sub); setIsModalOpen(true); }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-bold hover:bg-indigo-100 transition-colors border border-indigo-100">
                <Edit className="h-3.5 w-3.5" /> Modifier
              </button>
              <button onClick={() => handleDelete(sub.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold hover:bg-red-100 transition-colors border border-red-100">
                <Trash2 className="h-3.5 w-3.5" /> Supprimer
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
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Abonnement</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Prix</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Durée</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Activités</th>
                <th className="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100/80">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-2.5 shadow-sm">
                        <CreditCard className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-slate-900">{sub.name}</div>
                        <div className="text-[10px] font-medium text-slate-500 mt-0.5 line-clamp-1 max-w-xs">{sub.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[12px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                      {sub.price.toFixed(2)} €
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-700">
                    {sub.duration_months} mois
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {sub.activities.map(actId => {
                        const act = activities.find(a => a.id === actId);
                        return act ? (
                          <span key={actId} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold border border-slate-200">
                            {act.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-[11px] font-medium">
                    <button onClick={() => { setCurrentSub(sub); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors mr-1">
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4 tracking-tight">{currentSub.id ? 'Modifier' : 'Ajouter'} un abonnement</h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nom de l'abonnement</label>
                <input type="text" required value={currentSub.name || ''} onChange={e => setCurrentSub({...currentSub, name: e.target.value})} className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" placeholder="Ex: Pass Premium" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                <textarea required value={currentSub.description || ''} onChange={e => setCurrentSub({...currentSub, description: e.target.value})} className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none resize-none h-16" placeholder="Description courte..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Prix (€)</label>
                  <input type="number" step="0.01" required min="0" value={currentSub.price || ''} onChange={e => setCurrentSub({...currentSub, price: parseFloat(e.target.value)})} className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Durée (mois)</label>
                  <input type="number" required min="1" value={currentSub.duration_months || ''} onChange={e => setCurrentSub({...currentSub, duration_months: parseInt(e.target.value)})} className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
                </div>
              </div>
              
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Activités incluses</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                  {activities.map(activity => (
                    <label key={activity.id} className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${currentSub.activities?.includes(activity.id) ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                      <input 
                        type="checkbox" 
                        className="w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        checked={currentSub.activities?.includes(activity.id) || false}
                        onChange={() => toggleActivity(activity.id)}
                      />
                      <span className="ml-2 text-[11px] font-bold text-slate-700">{activity.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-2 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-colors">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[11px] font-bold shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
