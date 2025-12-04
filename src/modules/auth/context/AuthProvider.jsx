import { createContext, useEffect, useState } from 'react';
import NoticeModal from '../../shared/components/NoticeModal';
import useTokenExpiryNotice from '../../auth/hook/useTokenExpiryNotice';

// Services
import { login } from '../services/login';
import { register as registerService } from '../services/register';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');

      if (!storedUser || storedUser === 'undefined') return null;

      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');

    return Boolean(token);
  });

  const { notice, scheduleToken, clearTokenTimers } = useTokenExpiryNotice();

  const singout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    clearTokenTimers();
    notice.close();
  };

  const handleExpire = (currentUser) => {
    const isAdmin = String(currentUser?.role || '').toLowerCase() === 'admin';

    singout();

    if (isAdmin) {
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      clearTokenTimers();

      return;
    }

    const issuedAt = Date.now();

    scheduleToken({
      issuedAtMs: issuedAt,
      onExpire: () => handleExpire(user),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const singin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    setUser(data.user);
    setIsAuthenticated(true);

    const issuedAt = Date.now();

    scheduleToken({
      issuedAtMs: issuedAt,
      onExpire: () => handleExpire(data.user),
    });

    return { user: data.user, error: null };
  };

  const register = async (username, password, email, role) => {
    const { error } = await registerService(username, password, email, role);

    return { error: error || null };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        singin,
        singout,
        register,
      }}
    >
      {children}
      <NoticeModal
        variant="flag"
        isOpen={notice.isOpen}
        isClosing={notice.isClosing}
        message={notice.message}
        onClose={notice.close}
      />
    </AuthContext.Provider>
  );
}

export {
  AuthProvider,
  AuthContext,
};
