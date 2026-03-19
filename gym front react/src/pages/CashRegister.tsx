import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CreditCard, DollarSign, TrendingUp } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

type Transaction = {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
  user_id: number;
};

// Mock data removed

export const CashRegister: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({ type: 'income' });
  const [dailyTotal, setDailyTotal] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axiosInstance.get('/api/transactions');
      const data = res.data;
      if (data) {
        setTransactions(data);
        calculateDailyTotal(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const calculateDailyTotal = (trans: Transaction[]) => {
    const today = new Date().toISOString().split('T')[0];
    const total = trans
      .filter(t => t.date && t.date.startsWith(today))
      .reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0);
    setDailyTotal(total);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...newTransaction,
      date: new Date().toISOString(),
      user_id: 1 // Mock user ID
    };

    try {
      await axiosInstance.post('/api/transactions', dataToSave);
      setIsModalOpen(false);
      fetchTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      try {
        await axiosInstance.delete(`/api/transactions/${id}`);
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Caisse</h1>
          <p className="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Gérez les encaissements et décaissements.</p>
        </div>
        <button
          onClick={() => { setNewTransaction({ type: 'income' }); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold w-full sm:w-auto"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Nouvelle Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 sm:p-5 text-white shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-emerald-100 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1">Solde du jour</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{dailyTotal.toFixed(2)} €</h2>
            </div>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View (Cards) */}
      <div className="lg:hidden space-y-2.5">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 flex flex-col gap-2.5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm shrink-0 border
                  ${transaction.type === 'income' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                  {transaction.type === 'income' ? (
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <CreditCard className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div>
                  <div className="text-[12px] font-bold text-slate-900 leading-tight mb-0.5 line-clamp-1">{transaction.description}</div>
                  <div className="text-[10px] font-medium text-slate-500">{new Date(transaction.date).toLocaleDateString('fr-FR')} à {new Date(transaction.date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
              </div>
              <div className={`text-[13px] font-extrabold whitespace-nowrap ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)} €
              </div>
            </div>
            <div className="pt-2.5 border-t border-slate-100 mt-1">
              <button onClick={() => handleDelete(transaction.id)} className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold hover:bg-red-100 transition-colors border border-red-100">
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
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Montant</th>
                <th className="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100/80">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-700">
                    {new Date(transaction.date).toLocaleDateString('fr-FR')} à {new Date(transaction.date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[12px] font-bold text-slate-900">{transaction.description}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-[9px] font-bold rounded-md border
                      ${transaction.type === 'income' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                      {transaction.type === 'income' ? 'Encaissement' : 'Décaissement'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-[12px] font-extrabold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)} €
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-[11px] font-medium">
                    <button onClick={() => handleDelete(transaction.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
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
            <h2 className="text-lg font-extrabold text-slate-900 mb-4 tracking-tight">Nouvelle Transaction</h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Type d'opération</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTransaction({...newTransaction, type: 'income'})}
                    className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all border ${
                      newTransaction.type === 'income' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Encaissement (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTransaction({...newTransaction, type: 'expense'})}
                    className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all border ${
                      newTransaction.type === 'expense' 
                        ? 'bg-red-50 border-red-200 text-red-700 shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Décaissement (-)
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Montant (€)</label>
                <input type="number" step="0.01" required min="0.01" value={newTransaction.amount || ''} onChange={e => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})} className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                <input type="text" required value={newTransaction.description || ''} onChange={e => setNewTransaction({...newTransaction, description: e.target.value})} className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" placeholder="Ex: Achat matériel" />
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
