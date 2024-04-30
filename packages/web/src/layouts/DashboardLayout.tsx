import React, { useEffect } from 'react';
import { type RouteComponentProps, useNavigate } from '@reach/router';
import { useAuth } from '../store/auth/store';

interface Props extends RouteComponentProps {
  children: React.ReactNode
}

export const DashboardLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  
  useEffect(() => {
    if (!token) {
      navigate('/auth');
    }
  }, [navigate, token]);

  return (
    <>
      <header className="w-full border-b border-black">
        <nav className="max-w-[1440px] mx-auto flex flex-row justify-between px-8 py-4">
          <div className="h-full flex flex-col justify-center">
            <p className="text-3xl font-bold tracking-wide">NoteTaker</p>
          </div>
          <div className="flex flex-row justify-end">
            <button
              className="px-4 py-2 border border-black hover:bg-gray"
              type="button"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </nav>
      </header>
      <main className="max-w-[1440px] mx-auto p-8">
        {children}
      </main>
    </>
  );
};
