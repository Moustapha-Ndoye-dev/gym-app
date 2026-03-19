import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Ticket as TicketIcon, QrCode, Send, Smartphone, Printer, Download, X, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import axiosInstance from '../api/axiosInstance';
import { useConfirm } from '../context/ConfirmContext';
import { useNotification } from '../context/NotificationContext';

type Ticket = {
  id: number;
  type: string;
  price: number;
  status: 'valid' | 'used' | 'expired';
  created_at: string;
};

export const Tickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ type: 'Séance Unique', price: 1000 });
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [generatedTicketId, setGeneratedTicketId] = useState<number | null>(null);

  const { confirm } = useConfirm();
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axiosInstance.get('/api/tickets');
      setTickets(res.data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/api/tickets', newTicket);
      const data = res.data;
      setGeneratedTicketId(data.id);
      fetchTickets();
      showNotification('Ticket généré avec succès', 'success');
    } catch (error) {
      console.error('Error generating ticket:', error);
      showNotification('Erreur lors de la génération du ticket', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    confirm({
      title: 'Supprimer le ticket',
      message: 'Êtes-vous sûr de vouloir supprimer ce ticket ? Cette action est irréversible.',
      confirmText: 'Supprimer',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`/api/tickets/${id}`);
          fetchTickets();
          showNotification('Ticket supprimé avec succès', 'success');
        } catch (error) {
          console.error('Error deleting ticket:', error);
          showNotification('Erreur lors de la suppression', 'error');
        }
      }
    });
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid': return <span className="px-2 py-0.5 inline-flex text-[9px] font-black uppercase tracking-tighter rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">Valide</span>;
      case 'used': return <span className="px-2 py-0.5 inline-flex text-[9px] font-black uppercase tracking-tighter rounded-full bg-slate-100 text-slate-600 border border-slate-200">Utilisé</span>;
      case 'expired': return <span className="px-2 py-0.5 inline-flex text-[9px] font-black uppercase tracking-tighter rounded-full bg-red-50 text-red-600 border border-red-100">Expiré</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Tickets d'accès</h1>
          <p className="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Générez des accès ponctuels pour vos clients.</p>
        </div>
        <button
          onClick={() => { setGeneratedTicketId(null); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all text-[11px] font-black uppercase tracking-wider w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau ticket
        </button>
      </div>

      {/* Mobile View (Cards) */}
      <div className="lg:hidden space-y-3">
        {tickets.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200/60 text-center">
            <TicketIcon className="h-10 w-10 text-slate-200 mx-auto mb-3" />
            <p className="text-[13px] font-black text-slate-900 leading-tight">Aucun ticket généré</p>
            <p className="text-[11px] text-slate-500 mt-1">Créez un ticket pour commencer.</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm shrink-0">
                    <TicketIcon className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <div className="text-[14px] font-black text-slate-900 leading-tight mb-0.5">{ticket.type}</div>
                    <div className="text-[11px] font-bold text-slate-500">#{ticket.id}</div>
                  </div>
                </div>
                {getStatusBadge(ticket.status)}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 mt-1">
                <div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Prix</div>
                  <div className="text-[14px] font-black text-slate-900">{ticket.price.toFixed(0)} FCFA</div>
                </div>
                <div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</div>
                  <div className="text-[11px] font-bold text-slate-700">{formatDate(ticket.created_at)}</div>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-slate-100 mt-1">
                <button onClick={() => { setCurrentTicket(ticket); setIsViewModalOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 text-slate-700 rounded-xl text-[11px] font-black uppercase hover:bg-slate-200 transition-colors">
                  <QrCode className="h-4 w-4" /> Voir QR
                </button>
                <button onClick={() => handleDelete(ticket.id)} className="px-3 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors border border-red-100">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type de Ticket</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date de création</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-50">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <TicketIcon className="h-12 w-12 text-slate-100 mx-auto mb-3" />
                    <p className="text-[14px] font-black text-slate-900 leading-tight">Aucun ticket disponible</p>
                    <p className="text-[12px] text-slate-500 mt-1">Commencez par générer un nouveau ticket d'accès.</p>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-[12px] font-black text-slate-400">
                      #{ticket.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <TicketIcon className="h-4.5 w-4.5" />
                        </div>
                        <span className="text-[13px] font-black text-slate-900">{ticket.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[13px] font-black text-slate-900">
                        {ticket.price.toFixed(0)} FCFA
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[12px] font-bold text-slate-500">
                      {formatDate(ticket.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-[11px] font-medium">
                      <button onClick={() => { setCurrentTicket(ticket); setIsViewModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all mr-1" title="Visualiser le ticket">
                        <QrCode className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(ticket.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
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

      {/* Modal: Generation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-in zoom-in duration-200">
            {!generatedTicketId ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Générer un ticket</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="h-5 w-5 text-slate-400" /></button>
                </div>
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Type d'accès</label>
                    <select value={newTicket.type} onChange={e => setNewTicket({...newTicket, type: e.target.value})} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[13px] font-bold text-slate-900 transition-all outline-none">
                      <option value="Séance Unique">Séance Unique</option>
                      <option value="Pass Journée">Pass Journée</option>
                      <option value="Semaine Découverte">Semaine Découverte</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Prix (FCFA)</label>
                    <input type="number" required min="0" value={newTicket.price} onChange={e => setNewTicket({...newTicket, price: parseFloat(e.target.value)})} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[13px] font-bold text-slate-900 transition-all outline-none" />
                  </div>
                  <div className="flex gap-3 mt-8 pt-4 border-t border-slate-50">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-2xl text-[12px] font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-wider">Annuler</button>
                    <button type="submit" className="flex-[2] px-4 py-3 bg-indigo-600 text-white rounded-2xl text-[12px] font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-wider">Générer</button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-1 tracking-tight">Ticket Prêt !</h2>
                <p className="text-[12px] font-bold text-slate-500 mb-6">Le ticket #{generatedTicketId} a été créé.</p>
                
                <div className="space-y-2">
                  <button onClick={() => { 
                    setCurrentTicket(tickets.find(t => t.id === generatedTicketId) || null);
                    setGeneratedTicketId(null);
                    setIsModalOpen(false);
                    setIsViewModalOpen(true);
                  }} className="w-full bg-indigo-600 text-white px-4 py-3.5 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all text-[12px] font-black uppercase tracking-wider">
                    <QrCode className="h-4 w-4 mr-2" />
                    Voir le ticket
                  </button>
                  <button onClick={() => setIsModalOpen(false)} className="w-full bg-slate-100 text-slate-600 px-4 py-3.5 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-all text-[12px] font-black uppercase tracking-wider">
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: View Ticket (Visual) */}
      {isViewModalOpen && currentTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-[2rem] p-0 max-w-[260px] w-full shadow-2xl relative overflow-hidden border border-slate-100 animate-in zoom-in duration-300">
            {/* Header Ticket Section */}
            <div className="bg-slate-900 p-6 pb-10 text-center relative">
               <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600 opacity-20 rounded-full -mr-12 -mt-12"></div>
               <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-600 opacity-20 rounded-full -ml-10 -mb-10"></div>
               <h3 className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2 relative z-10">Access Pass</h3>
               <div className="text-white text-2xl font-black tracking-tighter relative z-10 mb-1">{currentTicket.type}</div>
               <div className="text-slate-400 text-[10px] font-bold relative z-10">Valable pour une personne</div>
            </div>
            
            {/* Ticket Body Section (Detachable look) */}
            <div className="bg-white px-6 pb-6 -mt-5 relative z-10 rounded-t-[1.5rem]">
               <div className="flex justify-center -mt-8 mb-5">
                  <div className="bg-white p-2.5 rounded-xl shadow-xl border border-slate-50">
                     <QRCodeSVG value={`TICKET-${currentTicket.id}`} size={130} level="H" />
                  </div>
               </div>

               <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                     <span className="text-[9px] font-black text-slate-400 uppercase">ID Ticket</span>
                     <span className="text-[12px] font-black text-slate-900">#{currentTicket.id}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                     <span className="text-[9px] font-black text-slate-400 uppercase">Émis le</span>
                     <span className="text-[10px] font-bold text-slate-900">{formatDate(currentTicket.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                     <span className="text-[9px] font-black text-slate-400 uppercase">Prix</span>
                     <span className="text-[13px] font-black text-indigo-600">{currentTicket.price.toFixed(0)} FCFA</span>
                  </div>
               </div>

               <div className="flex gap-2">
                  <button onClick={() => window.print()} className="flex-1 bg-slate-900 text-white p-3 rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                     <Printer className="h-3.5 w-3.5 mr-2" />
                     <span className="text-[10px] font-black uppercase tracking-wider">Imprimer</span>
                  </button>
                  <button onClick={() => setIsViewModalOpen(false)} className="px-4 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                     <X className="h-4 w-4" />
                  </button>
               </div>
               
               <p className="mt-5 text-[8px] text-slate-400 text-center font-bold uppercase tracking-widest">
                  Scannez ce code à l'entrée
               </p>
            </div>
            
            {/* Scalloped edge effect decoration */}
            <div className="absolute top-[35%] left-0 w-3 h-6 bg-slate-900/60 rounded-r-full -ml-1.5"></div>
            <div className="absolute top-[35%] right-0 w-3 h-6 bg-slate-900/60 rounded-l-full -mr-1.5"></div>
          </div>
        </div>
      )}
    </div>
  );
};
