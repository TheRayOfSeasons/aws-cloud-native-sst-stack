import React, { useEffect } from 'react';
import { Link, type RouteComponentProps } from '@reach/router';
import { useNotes } from '../../store/notes/store';

interface Props extends RouteComponentProps {
  id?: string
}

export const NotesDetailPage: React.FC<Props> = ({ id }) => {
  const { currentNote, error, getOne } = useNotes();

  useEffect(() => {
    if (id) {
      getOne(id);
    }
  }, [getOne, id]);

  return (
    <>
      <Link to="/">
        &lt; Back
      </Link>
      <div className="mt-8">
        {error && (
          <p className="text-red">{error}</p>
        )}
        {currentNote ? (
          <>
            <h1 className="md:text-3xl text-xl font-bold">
              {currentNote.title}
            </h1>
            <p className="mt-4">
              {currentNote.content}
            </p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};
