import React from 'react';
import { Link } from '@reach/router';
import { useNotes } from '../../store/notes/store';

interface Props {}

export const NoteList: React.FC<Props> = () => {
  const { noteList } = useNotes();

  return (
    <>
      {noteList.data.map(({ id, title }) => (
        <Link key={id} to={`notes/${id}`}>
          <div className="block w-full border border-black px-4 py-2 hover:bg-gray">
            <h3 className="md:text-2xl text-lg font-bold">{title}</h3>
          </div>
        </Link>
      ))}
    </>
  );
};
