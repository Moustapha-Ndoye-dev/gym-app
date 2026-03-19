import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Lock, User as UserIcon, ArrowRight, Mail, Phone, CheckCircle2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export const Login: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    gymId: 1
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/api/auth/login', loginData);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      if (!err.response) {
        setError('Le serveur est injoignable. Vérifiez que le backend est démarré sur le port 5000.');
      } else {
        setError(err.response?.data?.message || 'Identifiants incorrects');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await axiosInstance.post('/api/auth/register-member', registerData);
      setSuccess(true);
      setTimeout(() => {
        setMode('login');
        setSuccess(false);
      }, 2500);
    } catch (err: any) {
      console.error('Registration error:', err);
      if (!err.response) {
        setError('Le serveur est injoignable. Vérifiez que le backend est démarré sur le port 5000.');
      } else if (err.response?.data?.errors) {
        const firstError = err.response.data.errors[0];
        setError(`${firstError.path}: ${firstError.message}`);
      } else {
        const backendMessage = err.response?.data?.message || 'Erreur lors de l\'inscription';
        const backendError = err.response?.data?.error;
        setError(backendError ? `${backendMessage} (${backendError})` : backendMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 font-sans p-4">
      
      <div className="w-full max-w-[400px]">
        {/* Branding Area */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 mb-4">
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">LGL <span className="text-indigo-600">GYM</span></h1>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1">Plateforme de Gestion</p>
        </div>

        {/* Main Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-6 sm:p-8">
            
            {/* Header & Toggle */}
            <div className="mb-6">
              <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                <button 
                  onClick={() => setMode('login')}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Connexion
                </button>
                <button 
                  onClick={() => setMode('register')}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Inscription
                </button>
              </div>

              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {mode === 'login' ? 'Heureux de vous revoir !' : 'Rejoindre l\'aventure'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                {mode === 'login' ? 'Saisissez vos identifiants pour continuer.' : 'Email, Identifiant et Mot de passe pour commencer.'}
              </p>
            </div>

            {/* Alert Messages */}
            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-100/50 text-red-600 rounded-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></div>
                <p className="text-[10px] font-bold leading-tight">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-5 p-3 bg-emerald-50 border border-emerald-100/50 text-emerald-600 rounded-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></div>
                <p className="text-[10px] font-bold leading-tight">Inscription réussie ! Redirection...</p>
              </div>
            )}

            {/* Login Form */}
            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Utilisateur</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      value={loginData.username}
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                      type="text"
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[12px] font-semibold transition-all outline-none text-slate-900 placeholder:text-slate-400"
                      placeholder="admin"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mot de passe</label>
                    <a href="#" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">Oublié ?</a>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      type="password"
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[12px] font-semibold transition-all outline-none text-slate-900 placeholder:text-slate-400"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 flex items-center justify-center bg-indigo-600 text-white rounded-xl shadow-sm shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all text-[12px] font-bold mt-6 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Accéder au Dashboard
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Simplified Register Form */
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      type="email"
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[12px] font-semibold transition-all outline-none text-slate-900"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Identifiant</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      value={registerData.username}
                      onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                      type="text"
                      required
                      minLength={3}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[12px] font-semibold transition-all outline-none text-slate-900"
                      placeholder="Nom d'utilisateur"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Mot de passe</label>
                    <input
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      type="password"
                      required
                      minLength={5}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[12px] font-semibold transition-all outline-none text-slate-900"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Confirmer</label>
                    <input
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                      type="password"
                      required
                      minLength={5}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[12px] font-semibold transition-all outline-none text-slate-900"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 flex items-center justify-center bg-indigo-600 text-white rounded-xl shadow-sm shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all text-[12px] font-bold mt-4 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Créer mon compte
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          
          {/* Secure Info Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center flex items-center justify-center gap-2">
            <Lock className="h-3 w-3 text-slate-400" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Connexion sécurisée SSL</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} LGL Gym Management. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};
