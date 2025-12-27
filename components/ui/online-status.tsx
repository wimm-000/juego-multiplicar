'use client';

import { useEffect, useState } from 'react';

export default function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Inicializar con el estado actual
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showNotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top duration-300">
      <div
        className={`brutal-border brutal-shadow p-4 font-bold ${
          isOnline
            ? 'bg-amarillo text-negro'
            : 'bg-rojo text-blanco'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{isOnline ? '✓' : '📡'}</span>
          <div>
            <div className="font-bold uppercase">
              {isOnline ? 'CONECTADO' : 'SIN CONEXIÓN'}
            </div>
            <div className="text-sm">
              {isOnline
                ? 'Conexión restaurada'
                : 'Trabajando en modo offline'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
