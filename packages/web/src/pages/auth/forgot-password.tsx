import React, { useCallback } from 'react';
import { Link, useNavigate, type RouteComponentProps } from '@reach/router';
import { useAuth } from '../../store/auth/store';
import { useForm } from 'react-hook-form';
import { ForgotPasswordPayload } from '../../store/auth/types';
import validator from 'validator';

interface Props extends RouteComponentProps {}

export const ForgotPasswordPage: React.FC<Props> = () => {
  const { error: serverError, forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ForgotPasswordPayload>();

  const navigate = useNavigate();

  const onSubmit = useCallback(async (payload: ForgotPasswordPayload) => {
    try {
      await forgotPassword(payload);
    } catch (e) {
      return;
    }
    navigate('/auth/confirm-password-change');
  }, [forgotPassword, navigate]);

  return (
    <>
      <div className="w-full p-4 border-b border-black">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
      </div>
      <div className="p-4">
        {serverError && (
          <p className="mb-4">{serverError}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              className="border border-black"
              {...register('email', {
                validate: (value) => {
                  const valid = validator.isEmail(value);
                  if (!valid) {
                    return 'Please enter a valid email.';
                  }
                }
              })}
            />
            {errors.email?.message && (
              <p className="text-red mt-2">
                {errors.email.message}
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
        <div className="mt-8">
          <p>
            <Link to="/auth/forgot-password" className="text-blue underline">Forgot Password</Link>.
          </p>
        </div>
      </div>
    </>
  );
};
