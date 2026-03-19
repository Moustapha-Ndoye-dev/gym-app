import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Ticket as TicketIcon, QrCode, Send, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import axiosInstance from '../api/axiosInstance';

type Ticket = {
  id: number;
  type: string;
  price: number;
  status: 'valid' | 'used' | 'expired';
  created_at: string;
};

// Mock data removed

export const Tickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ type: 'Séance Unique', price: 10.00 });
  const [generatedTicketId, setGeneratedTicketId] = useState<number | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axiosInstance.get('/api/tickets');
      const data = res.data;
      if (data && data.length > 0) {
        setTickets(data);
      }
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
    } catch (error) {
      console.error('Error generating ticket:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      try {
        await axiosInstance.delete(`/api/tickets/${id}`);
        fetchTickets();
      } catch (error) {
        console.error('Error deleting ticket:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid': return <span className="px-2 py-0.5 inline-flex text-[9px] font-bold rounded bg-emerald-50 text-emerald-600 border border-emerald-100">Valide</span>;
      case 'used': return <span className="px-2 py-0.5 inline-flex text-[9px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-200">Utilisé</span>;
      case 'expired': return <span className="px-2 py-0.5 inline-flex text-[9px] font-bold rounded bg-red-50 text-red-600 border border-red-100">Expiré</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Tickets</h1>
          <p className="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Générez des accès ponctuels.</p>
        </div>
        <button
          onClick={() => { setGeneratedTicketId(null); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold w-full sm:w-auto"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Générer un ticket
        </button>
      </div>

      {/* Mobile View (Cards) */}
      <div className="lg:hidden space-y-2.5">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 flex flex-col gap-2.5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm shrink-0">
                  <TicketIcon className="h-4 w-4 text-indigo-500" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-slate-900 leading-tight mb-0.5">{ticket.type}</div>
                  <div className="text-[10px] font-medium text-slate-500">Ticket #{ticket.id}</div>
                </div>
              </div>
              {getStatusBadge(ticket.status)}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100 mt-1">
              <div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Prix</div>
                <div className="text-[13px] font-extrabold text-emerald-600">{ticket.price.toFixed(2)} €</div>
              </div>
              <div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Créé le</div>
                <div className="text-[11px] font-bold text-slate-700">{new Date(ticket.created_at).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
            <div className="pt-2.5 border-t border-slate-100 mt-1">
              <button onClick={() => handleDelete(ticket.id)} className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold hover:bg-red-100 transition-colors border border-red-100">
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
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">ID Ticket</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Prix</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Date de création</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100/80">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-900">
                    #{ticket.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-2.5 shadow-sm">
                        <TicketIcon className="h-4 w-4 text-indigo-500" />
                      </div>
                      <span className="text-[12px] font-bold text-slate-900">{ticket.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-[12px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                      {ticket.price.toFixed(2)} €
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-700">
                    {new Date(ticket.created_at).toLocaleDateString('fr-FR')} à {new Date(ticket.created_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusBadge(ticket.status)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-[11px] font-medium">
                    <button onClick={() => handleDelete(ticket.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
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
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl border border-slate-100">
            {!generatedTicketId ? (
              <>
                <h2 className="text-lg font-extrabold text-slate-900 mb-4 tracking-tight">Générer un ticket</h2>
                <form onSubmit={handleGenerate} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Type de ticket</label>
                    <select value={newTicket.type} onChange={e => setNewTicket({...newTicket, type: e.target.value})} className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none">
                      <option value="Séance Unique">Séance Unique</option>
                      <option value="Pass Journée">Pass Journée</option>
                      <option value="Semaine Découverte">Semaine Découverte</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Prix (€)</label>
                    <input type="number" step="0.01" required min="0" value={newTicket.price} onChange={e => setNewTicket({...newTicket, price: parseFloat(e.target.value)})} className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" />
                  </div>
                  <div className="flex justify-end space-x-2 mt-6 pt-3 border-t border-slate-100">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-2 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-colors">Annuler</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[11px] font-bold shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all">Générer</button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TicketIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 mb-1 tracking-tight">Ticket Généré !</h2>
                <p className="text-[11px] font-medium text-slate-500 mb-4">Ticket #{generatedTicketId}</p>
                
                <div className="bg-white p-3 rounded-xl inline-block mb-4 border border-slate-200/60 shadow-sm">
                  <QRCodeSVG value={`TICKET-${generatedTicketId}`} size={120} />
                </div>
                
                <div className="space-y-2">
                  <button className="w-full bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold">
                    <Smartphone className="h-3.5 w-3.5 mr-1.5" />
                    Envoyer par SMS
                  </button>
                  <button className="w-full bg-emerald-500 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-emerald-200 hover:bg-emerald-600 transition-all text-[11px] font-bold">
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Envoyer par WhatsApp
                  </button>
                  <button onClick={() => setIsModalOpen(false)} className="w-full bg-slate-100 text-slate-700 px-3 py-2 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-all text-[11px] font-bold mt-2">
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
