import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4200);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
        maxWidth: '420px',
        width: '100%',
      }}>
        {toasts.map((toast) => {
          let bg = '#1E293B';
          let border = '#334155';
          let icon = <Info size={20} color="#38BDF8" />;

          if (toast.type === 'success') {
            bg = '#064E3B';
            border = '#059669';
            icon = <CheckCircle2 size={20} color="#34D399" />;
          } else if (toast.type === 'error') {
            bg = '#7F1D1D';
            border = '#DC2626';
            icon = <AlertCircle size={20} color="#F87171" />;
          } else if (toast.type === 'warning') {
            bg = '#78350F';
            border = '#D97706';
            icon = <AlertTriangle size={20} color="#FBBF24" />;
          }

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                background: bg,
                border: `1px solid ${border}`,
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.92rem',
                fontWeight: 500,
                animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div style={{ flexShrink: 0 }}>{icon}</div>
              <div style={{ flex: 1 }}>{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
