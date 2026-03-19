import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Dumbbell } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useConfirm } from '../context/ConfirmContext';
import { useNotification } from '../context/NotificationContext';

type Activity = {
  id: number;
  name: string;
  description: string;
  capacity: number;
  duration: number;
};

// Mock data removed

export const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Partial<Activity>>({});

  const { confirm } = useConfirm();
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await axiosInstance.get('/api/activities');
      const data = res.data;
      if (data && data.length > 0) {
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentActivity.id ? 'PUT' : 'POST';
    const url = currentActivity.id ? `/api/activities/${currentActivity.id}` : '/api/activities';
    
    try {
      await axiosInstance[method.toLowerCase() as 'put' | 'post'](url, currentActivity);
      setIsModalOpen(false);
      fetchActivities();
      showNotification('Activité enregistrée avec succès', 'success');
    } catch (error) {
      console.error('Error saving activity:', error);
      showNotification('Erreur lors de l\'enregistrement', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    confirm({
      title: 'Supprimer l\'activité',
      message: 'Êtes-vous sûr de vouloir supprimer cette activité ? Cette action est irréversible.',
      confirmText: 'Supprimer',
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`/api/activities/${id}`);
          fetchActivities();
          showNotification('Activité supprimée avec succès', 'success');
        } catch (error) {
          console.error('Error deleting activity:', error);
          showNotification('Erreur lors de la suppression', 'error');
        }
      }
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Activités</h1>
          <p className="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Gérez les activités proposées par la salle.</p>
        </div>
        <button
          onClick={() => { setCurrentActivity({}); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold w-full sm:w-auto"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Nouvelle Activité
        </button>
      </div>

      {/* Mobile View (Cards) */}
      <div className="lg:hidden space-y-2.5">
        {activities.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200/60 text-center">
            <Dumbbell className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-[13px] font-bold text-slate-900 leading-tight">Aucune activité trouvée</p>
            <p className="text-[11px] text-slate-500 mt-1">Commencez par ajouter votre première activité.</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 flex flex-col gap-2.5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm shrink-0">
                    <Dumbbell className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900 leading-tight mb-0.5">{activity.name}</div>
                    <div className="text-[11px] font-medium text-slate-500 line-clamp-1">{activity.description}</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100 mt-1">
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Capacité</div>
                  <div className="text-[11px] font-bold text-slate-700">{activity.capacity} pers.</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Durée</div>
                  <div className="text-[11px] font-bold text-slate-700">{activity.duration} min</div>
                </div>
              </div>
              <div className="flex gap-2 pt-2.5 border-t border-slate-100 mt-1">
                <button onClick={() => { setCurrentActivity(activity); setIsModalOpen(true); }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-bold hover:bg-indigo-100 transition-colors border border-indigo-100">
                  <Edit className="h-3.5 w-3.5" /> Modifier
                </button>
                <button onClick={() => handleDelete(activity.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold hover:bg-red-100 transition-colors border border-red-100">
                  <Trash2 className="h-3.5 w-3.5" /> Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Activité</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Capacité</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Durée</th>
                <th className="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100/80">
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Dumbbell className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-[13px] font-bold text-slate-900 leading-tight">Aucune activité trouvée</p>
                    <p className="text-[11px] text-slate-500 mt-1">Commencez par ajouter votre première activité.</p>
                  </td>
                </tr>
              ) : (
                activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-2.5 shadow-sm">
                          <Dumbbell className="h-4 w-4 text-indigo-500" />
                        </div>
                        <div className="text-[12px] font-bold text-slate-900">{activity.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[11px] font-medium text-slate-600 line-clamp-1 max-w-xs">{activity.description}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-[10px] font-bold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {activity.capacity} pers.
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-700">
                      {activity.duration} min
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-[11px] font-medium">
                      <button onClick={() => { setCurrentActivity(activity); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors mr-1">
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(activity.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl border border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4 tracking-tight">{currentActivity.id ? 'Modifier' : 'Ajouter'} une activité</h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nom de l'activité</label>
                <input type="text" required value={currentActivity.name || ''} onChange={e => setCurrentActivity({...currentActivity, name: e.target.value})} className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" placeholder="Ex: CrossFit" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                <textarea required value={currentActivity.description || ''} onChange={e => setCurrentActivity({...currentActivity, description: e.target.value})} className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none resize-none h-20" placeholder="Description courte..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Capacité (pers.)</label>
                  <input type="number" required min="1" value={currentActivity.capacity || ''} onChange={e => setCurrentActivity({...currentActivity, capacity: parseInt(e.target.value)})} className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Durée (min)</label>
                  <input type="number" required min="1" value={currentActivity.duration || ''} onChange={e => setCurrentActivity({...currentActivity, duration: parseInt(e.target.value)})} className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
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
