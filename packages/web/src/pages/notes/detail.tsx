import React, { useCallback, useEffect } from 'react';
import { Link, useNavigate, type RouteComponentProps } from '@reach/router';
import { useNotes } from '../../store/notes/store';

interface Props extends RouteComponentProps {
  id?: string
}

export const NotesDetailPage: React.FC<Props> = ({ id }) => {
  const { currentNote, error, getOne, deleteNote } = useNotes();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getOne(id);
    }
  }, [getOne, id]);

  const deleteAction = useCallback(async () => {
    if (!id) {
      return;
    }
    await deleteNote(id);
    navigate('/');
  }, [deleteNote, id, navigate]);

  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col justify-center">
          <Link to="/">
            &lt; Back
          </Link>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex flex-row justify-end">
            <Link to={`/notes/edit/${id}`}>
              <button
                className="px-4 py-2 border border-black hover:bg-gray"
                type="button"
              >
                Edit
              </button>
            </Link>
            <button
              className="px-4 py-2 border border-black hover:bg-gray"
              type="button"
              onClick={deleteAction}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
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
