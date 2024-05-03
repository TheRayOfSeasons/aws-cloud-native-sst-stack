import React, { useCallback, useEffect } from 'react';
import { useNavigate, type RouteComponentProps } from '@reach/router';
import { ConfirmPayload } from '../../store/auth/types';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../store/auth/store';

interface Props extends RouteComponentProps {}

export const ConfirmPage: React.FC<Props> = () => {
  const {
    error: serverError,
    registrationEmail,
    confirmRegistration,
  } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ConfirmPayload>({
    defaultValues: {
      email: registrationEmail,
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    setValue('email', registrationEmail);
  }, [registrationEmail, setValue]);

  const onSubmit = useCallback(async (payload: ConfirmPayload) => {
    try {
      await confirmRegistration(payload);
    } catch (e) {
      return;
    }
    navigate('/auth?confirmSuccess=1');
  }, [confirmRegistration, navigate]);

  return (
    <>
      <div className="w-full p-4 border-b border-black">
        <h1 className="text-3xl font-bold">Confirm</h1>
        <h3 className="text-xl">A code has been sent to your email.</h3>
      </div>
      <div className="p-4">
        {serverError && (
          <p className="mb-4">{serverError}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email">Code</label>
            <input
              id="email"
              type="text"
              className="border border-black"
              {...register('code', {
                required: 'This field is required',
              })}
            />
            {errors.code?.message && (
              <p className="text-red mt-2">
                {errors.code.message}
              </p>
            )}
          </div>
          <div className="mt-8 flex flex-row justify-between">
            <button
              className="mt-8 p-2 border border-black hover:bg-gray"
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </button>
            {isSubmitting && (
              <p>Submitting...</p>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
