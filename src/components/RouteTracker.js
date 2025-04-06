import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RouteTracker = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser && location.pathname !== '/') {
      localStorage.setItem('lastPath', location.pathname);
    }
  }, [location, currentUser]);

  return null;
};

export default RouteTracker;