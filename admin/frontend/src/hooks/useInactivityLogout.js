import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const TIMEOUT_MS  = 10 * 60 * 1000; // 10 minutos
const WARNING_MS  =  9 * 60 * 1000; //  9 minutos → aviso 1 min antes

const EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];

export default function useInactivityLogout({ onWarning, onLogout }) {
  const navigate      = useNavigate();
  const timerLogout   = useRef(null);
  const timerWarning  = useRef(null);
  const warned        = useRef(false);

  const doLogout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    if (onLogout) onLogout();
    navigate('/login');
  }, [navigate, onLogout]);

  const reset = useCallback(() => {
    clearTimeout(timerLogout.current);
    clearTimeout(timerWarning.current);
    warned.current = false;

    timerWarning.current = setTimeout(() => {
      warned.current = true;
      if (onWarning) onWarning();
    }, WARNING_MS);

    timerLogout.current = setTimeout(doLogout, TIMEOUT_MS);
  }, [doLogout, onWarning]);

  useEffect(() => {
    reset();
    EVENTS.forEach(e => window.addEventListener(e, reset, { passive: true }));
    return () => {
      clearTimeout(timerLogout.current);
      clearTimeout(timerWarning.current);
      EVENTS.forEach(e => window.removeEventListener(e, reset));
    };
  }, [reset]);
}
