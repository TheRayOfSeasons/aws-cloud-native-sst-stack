import React from 'react';
import { type RouteComponentProps } from '@reach/router';

interface Props extends RouteComponentProps {}

export const ForbiddenPage: React.FC<Props> = () => {
  return (
    <>Forbidden</>
  );
};
