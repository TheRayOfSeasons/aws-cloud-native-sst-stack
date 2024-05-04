import React from 'react';
import { type RouteComponentProps } from '@reach/router';

interface Props extends RouteComponentProps {
  children: React.ReactNode
}

export const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="w-screen min-h-screen flex flex-col">
      <div className="flex-1 flex flex-row justify-center items-center">
        <div className="min-w-[500px] min-h-[200px] m-8">
          {children}
        </div>
      </div>
      <div className="text-center border-t-[2px] border-black">
        <p>{'AWS Cloud Native SST Stack • MIT License • Copyright (c) 2024 Ray Lawrence Henri Sison'}</p>
      </div>
    </div>
  );
};
