import React from 'react';
import { type RouteComponentProps } from '@reach/router';

interface Props extends RouteComponentProps {}

export const NotFoundPage: React.FC<Props> = () => {
  return (
    <>Not found</>
  );
};
