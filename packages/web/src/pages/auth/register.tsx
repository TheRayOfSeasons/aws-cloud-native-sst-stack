import React, { useCallback } from 'react';
import validator from 'validator';
import type { Credentials } from '../../store/auth/types';
import { useNavigate, type RouteComponentProps } from '@reach/router';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../store/auth/store';

interface Props extends RouteComponentProps {}

interface Input extends Credentials {
  confirmPassword: string
}

export const RegisterPage: React.FC<Props> = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<Input>();

  const { error: serverError, register: registerUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = useCallback(async (input: Input) => {
    try {
      await registerUser({
        email: input.email,
        password: input.password,
      });
    } catch (e) {
      // Do nothing here. Already handled in store.
      return;
    }
    navigate('/auth/confirm');
  }, [navigate, registerUser]);

  const password = watch('password');

  return (
    <>
      <div className="w-full p-4 border-b border-black">
        <h1 className="text-3xl font-bold">Register</h1>
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
          <div className="mt-4">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="border border-black"
              {...register('password')}
            />
            {errors.password?.message && (
              <p className="text-red mt-2">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="mt-4">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              className="border border-black"
              {...register('confirmPassword', {
                validate: (value) => {
                  const valid = value === password;
                  if (!valid) {
                    return 'Password must match.';
                  }
                  return true;
                },
              })}
            />
            {errors.confirmPassword?.message && (
              <p className="text-red mt-2">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="mt-8 flex flex-row justify-between">
            <button
              className="mt-8 p-2 border border-black hover:bg-gray"
              type="submit"
              disabled={isSubmitting}
            >
              Register
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
