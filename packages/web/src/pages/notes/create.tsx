import React, { useCallback } from 'react';
import { Link, useNavigate, type RouteComponentProps } from '@reach/router';
import { useForm } from 'react-hook-form';
import { useNotes } from '../../store/notes/store';
import { type NotePayload } from '../../store/notes/types';

interface Props extends RouteComponentProps {}

export const NotesCreatePage: React.FC<Props> = () => {
  const { create } = useNotes();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: {
      isSubmitting,
      isSubmitSuccessful,
      errors,
    }
  } = useForm<NotePayload>();

  const onSubmit = useCallback(async (payload: NotePayload) => {
    await create(payload);
    navigate('/');
  }, [create, navigate]);

  return (
    <>
      <Link to="/">
        &lt; Back
      </Link>
      <div className="mt-8">
        <h1 className="md:text-3xl text-xl font-bold">
          Create Note
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              className="border border-black"
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
              disabled={isSubmitting || isSubmitSuccessful}
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
