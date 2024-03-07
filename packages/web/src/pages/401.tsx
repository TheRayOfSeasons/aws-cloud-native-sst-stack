import React from 'react';
import { type RouteComponentProps } from '@reach/router';

interface Props extends RouteComponentProps {}

export const UnauthorizeedPage: React.FC<Props> = () => {
  return (
    <>Unauthorized</>
  );
};
