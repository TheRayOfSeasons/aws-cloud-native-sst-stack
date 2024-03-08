import React, { useEffect } from 'react';
import { type RouteComponentProps, useNavigate } from '@reach/router';
import { useAuth } from '../store/auth/store';

interface Props extends RouteComponentProps {
  children: React.ReactNode
}

export const DashboardLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  useEffect(() => {
    if (!token) {
      navigate('/auth');
    }
  }, [navigate, token]);

  return (
    <>
      {children}
    </>
  );
};
