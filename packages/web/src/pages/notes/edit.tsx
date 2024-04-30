import React, { useCallback, useEffect } from 'react';
import { Link, useNavigate, type RouteComponentProps } from '@reach/router';
import { useForm } from 'react-hook-form';
import { useNotes } from '../../store/notes/store';
import { type NotePayload } from '../../store/notes/types';

interface Props extends RouteComponentProps {
  id?: string
}

export const NotesEditPage: React.FC<Props> = ({ id }) => {
  const { currentNote, getOne, update } = useNotes();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      isSubmitting,
      isSubmitSuccessful,
      errors,
    }
  } = useForm<NotePayload>();

  const onSubmit = useCallback(async (payload: NotePayload) => {
    if (!id) {
      return;
    }
    await update(id, payload);
    navigate(`/notes/${id}`);
  }, [id, update, navigate]);

  useEffect(() => {
    if (id) {
      getOne(id);
    }
  }, [getOne, id]);

  useEffect(() => {
    setValue('title', currentNote?.title || '');
    setValue('content', currentNote?.content || '');
  }, [currentNote, setValue]);

  return (
    <>
      <Link to={`/notes/${id}`}>
        &lt; Back
      </Link>
      <div className="mt-8">
        <h1 className="md:text-3xl text-xl font-bold">
          Update Note
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              className="border border-black w-full"
              {...register('title', {
                required: 'This field is required.',
              })}
            />
            {errors.title?.message && (
              <p className="text-red mt-2">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="mt-8">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              rows={10}
              className="border border-black w-full"
              {...register('content', {
                required: 'This field is required.',
              })}
            />
            {errors.content?.message && (
              <p className="text-red mt-2">
                {errors.content.message}
              </p>
            )}
          </div>
          <div className="mt-8 flex flex-row justify-between">
            <button
              className="mt-8 p-2 border border-black hover:bg-gray"
              type="submit"
              disabled={isSubmitting || isSubmitSuccessful || !id}
            >
              Submit
            </button>
            {(isSubmitting || isSubmitSuccessful) && (
              <p>Submitting...</p>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
