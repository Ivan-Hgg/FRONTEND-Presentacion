import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children, allowedRoles, disallowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const userRole = (user?.role || '').toLowerCase();

  // LISTA NEGRA
  if (disallowedRoles && disallowedRoles.length > 0) {
    if (isAuthenticated && disallowedRoles.includes(userRole)) {
      // Si el rol está prohibido, lo mandamos a su lugar seguro.
      if (userRole === 'admin') return <Navigate to='/admin/home' />;
    }
    if (!allowedRoles) return children; 
  }

  
  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole)) {
      // Si intenta entrar donde no debe, lo mandamos a SU home.
      if (userRole === 'admin') return <Navigate to='/admin/home' replace />;
      return <Navigate to='/' replace />;
    }
  }

  return children;
};

export default ProtectedRoute;