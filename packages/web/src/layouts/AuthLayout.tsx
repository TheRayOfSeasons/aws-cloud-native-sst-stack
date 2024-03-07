import React from 'react';
import { type RouteComponentProps } from '@reach/router';

interface Props extends RouteComponentProps {
  children: React.ReactNode
}

export const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};
