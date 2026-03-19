import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import axiosInstance from '../api/axiosInstance';
import { useNotification } from '../context/NotificationContext';

type AccessLog = {
  id: number;
  member_id: number | null;
  ticket_id: number | null;
  access_time: string;
  status: 'granted' | 'denied';
  member_name?: string;
};

export const AccessControl: React.FC = () => {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const { showNotification } = useNotification();
  const [scanResult, setScanResult] = useState<{ 
    status: 'granted' | 'denied', 
    message: string,
    member?: {
      firstName: string;
      lastName: string;
      photo?: string;
    }
  } | null>(null);

  useEffect(() => {
    fetchLogs();
    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [html5QrCode]);

  const fetchLogs = async () => {
    try {
      const res = await axiosInstance.get('/api/access/logs');
      setLogs(res.data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const verifyAccess = async (code: string) => {
    try {
      const res = await axiosInstance.post('/api/access/verify', { qr_code: code });
      const data = res.data;

      setScanResult({
        status: data.granted ? 'granted' : 'denied',
        message: data.message,
        member: data.member
      });

      fetchLogs();
    } catch (error) {
      console.error('Error verifying access:', error);
      setScanResult({
        status: 'denied',
        message: 'Erreur technique lors de la vérification'
      });
    }
    setTimeout(() => setScanResult(null), 8000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode) {
      verifyAccess(manualCode);
      setManualCode('');
    }
  };

  const startScanner = async () => {
    setIsScanning(true);
    setScanResult(null);

    // Wait for DOM element to be available
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode("reader");
        setHtml5QrCode(scanner);

        const config = { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0 
        };

        await scanner.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            scanner.stop().then(() => {
              setIsScanning(false);
              verifyAccess(decodedText);
            }).catch(err => {
              console.error("Failed to stop scanner", err);
              setIsScanning(false);
            });
          },
          () => {} // Silent scan errors
        );
      } catch (err) {
        console.error("Camera access error:", err);
        showNotification("Accès caméra impossible. Vérifiez les permissions de votre navigateur.", "error");
        setIsScanning(false);
        setHtml5QrCode(null);
      }
    }, 300);
  };

  const stopScanner = async () => {
    if (html5QrCode) {
      try {
        if (html5QrCode.isScanning) {
          await html5QrCode.stop();
        }
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      setHtml5QrCode(null);
    }
    setIsScanning(false);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Contrôle d'Accès</h1>
        <p className="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Vérifiez les accès des membres et les tickets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-1 space-y-4 sm:space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 sm:p-5 text-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-indigo-100 shadow-sm">
              <QrCode className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="text-[13px] font-extrabold text-slate-900 mb-1 tracking-tight">Scanner un QR Code</h2>
            <p className="text-[10px] font-medium text-slate-500 mb-4">Utilisez la caméra pour scanner le QR code d'un membre ou un ticket.</p>
            
            {!isScanning ? (
              <button
                onClick={startScanner}
                className="w-full bg-indigo-600 text-white px-3 py-2.5 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold"
              >
                <QrCode className="h-3.5 w-3.5 mr-1.5" />
                Démarrer le scanner
              </button>
            ) : (
              <div className="space-y-3">
                <div id="reader" className="overflow-hidden rounded-xl border-2 border-indigo-100"></div>
                <button
                  onClick={stopScanner}
                  className="w-full bg-slate-100 text-slate-700 px-3 py-2 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-all text-[11px] font-bold"
                >
                  Annuler
                </button>
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100">
              <h3 className="text-[11px] font-bold text-slate-700 mb-2 text-left">Saisie manuelle</h3>
              <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Ex: MEMBER-123"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1 px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none"
                />
                <button
                  type="submit"
                  className="bg-slate-800 text-white px-3 py-2 rounded-lg hover:bg-slate-900 transition-all text-[11px] font-bold shadow-sm shadow-slate-200"
                >
                  Vérifier
                </button>
              </form>
            </div>
          </div>

          {scanResult && (
            <div className={`rounded-2xl p-5 border shadow-sm animate-in fade-in zoom-in duration-300 ${
              scanResult.status === 'granted' 
                ? 'bg-emerald-50 border-emerald-100' 
                : 'bg-red-50 border-red-100'
            }`}>
              <div className="flex flex-col items-center text-center">
                {scanResult.member && (
                  <div className="mb-4 relative">
                    {scanResult.member.photo ? (
                      <img 
                        src={scanResult.member.photo} 
                        alt="Membre" 
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-2xl font-black text-slate-400 border-4 border-white shadow-md uppercase">
                        {scanResult.member.firstName[0]}{scanResult.member.lastName[0]}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1">
                      {scanResult.status === 'granted' ? (
                        <CheckCircle className="h-7 w-7 text-emerald-500 fill-white" />
                      ) : (
                        <XCircle className="h-7 w-7 text-red-500 fill-white" />
                      )}
                    </div>
                  </div>
                )}

                {!scanResult.member && (
                  scanResult.status === 'granted' ? (
                    <CheckCircle className="h-10 w-10 text-emerald-500 mb-3" />
                  ) : (
                    <XCircle className="h-10 w-10 text-red-500 mb-3" />
                  )
                )}

                <h3 className={`text-[16px] font-black tracking-tight mb-0.5 uppercase ${
                  scanResult.status === 'granted' ? 'text-emerald-800' : 'text-red-800'
                }`}>
                  {scanResult.status === 'granted' ? 'Accès Autorisé' : 'Accès Refusé'}
                </h3>
                
                {scanResult.member && (
                  <p className="text-[13px] font-bold text-slate-800 mb-1">
                    {scanResult.member.firstName} {scanResult.member.lastName}
                  </p>
                )}

                <p className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                  scanResult.status === 'granted' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {scanResult.message}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {/* Mobile/Desktop Shared Historique */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col h-full">
            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-[12px] font-extrabold text-slate-900 tracking-tight flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                Historique récent
              </h2>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Heure</th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Identifiant</th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100/80">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-700">
                        {new Date(log.access_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {log.member_id ? (
                          <div>
                            <div className="text-[11px] font-bold text-slate-900">{log.member_name || `Membre #${log.member_id}`}</div>
                            <div className="text-[9px] font-medium text-slate-500 mt-0.5">Abonné</div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-[11px] font-bold text-slate-900">Ticket #{log.ticket_id}</div>
                            <div className="text-[9px] font-medium text-slate-500 mt-0.5">Visiteur</div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-[9px] font-bold rounded-md border
                          ${log.status === 'granted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                          {log.status === 'granted' ? 'Autorisé' : 'Refusé'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
