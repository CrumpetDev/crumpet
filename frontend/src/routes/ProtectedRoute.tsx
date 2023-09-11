import React, { useEffect } from 'react';
import { useAuthentication } from 'api';

import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { checkAuth } = useAuthentication();
  const [cookies] = useCookies(['refreshToken']);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!cookies.refreshToken) {
    return <Navigate to="/login" />;
  }
	
	return <>{children}</> || null;
};

export default ProtectedRoute;
