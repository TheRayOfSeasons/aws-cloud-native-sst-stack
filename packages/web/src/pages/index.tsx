import React, { useEffect } from 'react';
import { Link, type RouteComponentProps } from '@reach/router';
import { useAuth } from '../store/auth/store';
import { useNotes } from '../store/notes/store';
import { NoteList } from '../components/notes/NoteList';

interface Props extends RouteComponentProps {}

export const IndexPage: React.FC<Props> = () => {
  const { token } = useAuth();
  const { list } = useNotes();

  useEffect(() => {
    if (token) {
      list();
    }
  }, [list, token]);

  return (
    <>
      <div className="flex flex-row justify-between">
        <h1 className="md:text-5xl text-3xl font-bold">Your Notes</h1>
        <div className="flex flex-row justify-center">
          <Link to="/notes/create">
            <button
              className="px-4 py-2 border border-black hover:bg-gray"
              type="button"
            >
              Create Note
            </button>
          </Link>
        </div>
      </div>
      <div className="md:mt-8 mt-6">
        <NoteList />
      </div>
    </>
  );
};
