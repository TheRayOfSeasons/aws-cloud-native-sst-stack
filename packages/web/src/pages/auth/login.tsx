import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, type RouteComponentProps, useLocation, Link } from '@reach/router';
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
  const { error: serverError, login, token } = useAuth();
  const navigate = useNavigate();

  const onSubmit = useCallback(async (credentials: Credentials) => {
    await login(credentials);
  }, [login]);

  useEffect(() => {
    if (token && !serverError) {
      navigate('/');
    }
  }, [serverError, navigate, token]);

  const location = useLocation();

  const confirmSuccess = useMemo(() => {
    const search = new URLSearchParams(location.search);
    return search.get('confirmSuccess');
  }, [location]);

  return (
    <>
      <div className="w-full p-4 border-b border-black">
        <h1 className="text-3xl font-bold">Login</h1>
      </div>
      <div className="p-4">
        {serverError && (
          <p className="mb-4">{serverError}</p>
        )}
        {confirmSuccess && (
          <p className="text-green mb-4">Registration successful. You may now login.</p>
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
          </div>
          <div className="mt-8 flex flex-row justify-between">
            <button
              className="mt-8 p-2 border border-black hover:bg-gray"
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
        <div className="mt-8">
          <p>
            No account yet? Register <Link to="/auth/register" className="text-blue underline">here</Link>.
          </p>
        </div>
      </div>
    </>
  );
};
