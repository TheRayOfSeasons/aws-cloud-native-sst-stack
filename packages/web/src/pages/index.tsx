import React, { useEffect } from 'react';
import { type RouteComponentProps } from '@reach/router';
import { useAuth } from '../store/auth/store';
import { useNotes } from '../store/notes/store';

interface Props extends RouteComponentProps {}

export const IndexPage: React.FC<Props> = () => {
  const { logout } = useAuth();
  const { list, noteList } = useNotes();

  useEffect(() => {
    list();
  }, [list]);

  return (
    <>
      <button type="button" onClick={logout}>Logout</button>
      <pre>
        {JSON.stringify(noteList, null, 2)}
      </pre>
    </>
  );
};
