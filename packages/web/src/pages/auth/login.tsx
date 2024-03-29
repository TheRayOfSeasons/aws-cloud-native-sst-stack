import React, { useCallback, useEffect } from 'react';
import { useNavigate, type RouteComponentProps } from '@reach/router';
import { useForm }  from 'react-hook-form';
import type { Credentials } from '../../store/auth/types';
import { useAuth } from '../../store/auth/store';
import validator from 'validator';

interface Props extends RouteComponentProps {}

export const LoginPage: React.FC<Props> = () => {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
      isSubmitSuccessful,
    },
  } = useForm<Credentials>();
  const { error, login, token } = useAuth();
  const navigate = useNavigate();

  const onSubmit = useCallback(async (credentials: Credentials) => {
    await login(credentials);
  }, [login]);

  useEffect(() => {
    if (token && !error) {
      navigate('/');
    }
  }, [error, navigate, token]);

  return (
    <>
      <div className="w-full p-4 border-b border-black">
        <h1 className="text-3xl font-bold">Login</h1>
      </div>
      <div className="p-4">
        {error && (
          <p className="mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <label htmlFor="password">Password</label>
          {errors.email?.message && (
            <p className="text-red mt-2">
              {errors.email.message}
            </p>
          )}
          <input
            id="password"
            type="password"
            className="border border-black"
            {...register('password')}
          />
          <div className="mt-8 flex flex-row justify-between">
            <button
              className="mt-8 p-2 border border-black"
              type="submit"
              disabled={isSubmitting || isSubmitSuccessful}
            >
              Login
            </button>
            {(isSubmitting || isSubmitSuccessful) && (
              <p>Logging in...</p>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
