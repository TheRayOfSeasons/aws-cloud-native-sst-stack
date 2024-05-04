import React, { useCallback, useEffect } from 'react';
import { useNavigate, type RouteComponentProps } from '@reach/router';
import { ConfirmForgotPasswordPayload } from '../../store/auth/types';
import { useAuth } from '../../store/auth/store';
import { useForm } from 'react-hook-form';

interface Props extends RouteComponentProps {}

interface Input extends ConfirmForgotPasswordPayload {
  confirmPassword: string
}

export const ConfirmPasswordChangePage: React.FC<Props> = () => {
  const {
    error: serverError,
    forgotPasswordEmail,
    confirmForgotPassword,
    resendCode,
  } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<Input>();

  useEffect(() => {
    setValue('email', forgotPasswordEmail);
  }, [forgotPasswordEmail, setValue]);

  const navigate = useNavigate();

  const onSubmit = useCallback(async (input: Input) => {
    try {
      await confirmForgotPassword({
        email: input.email,
        newPassword: input.newPassword,
        code: input.code,
      });
    } catch (e) {
      return;
    }
    navigate('/auth?passwordChangeSuccess=1');
  }, [confirmForgotPassword, navigate]);

  const resend = useCallback(async () => {
    await resendCode({
      email: forgotPasswordEmail,
    });
  }, [resendCode, forgotPasswordEmail]);

  const newPassword = watch('newPassword');

  return (
    <>
      <div className="w-full p-4 border-b border-black">
        <h1 className="text-3xl font-bold">Change Password</h1>
        <h3 className="text-xl">A code has been sent to your email.</h3>
        <div className="p-4">
          {serverError && (
            <p className="mb-4">{serverError}</p>
          )}
          <button
            type="button"
            className="mb-4 text text-underline"
            onClick={resend}
          >
            Resend Code
          </button>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="code">Code</label>
              <input
                id="code"
                type="text"
                className="border border-black"
                {...register('code', {
                  required: 'This field is required',
                })}
              />
              {errors.newPassword?.message && (
                <p className="text-red mt-2">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="mt-4">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="border border-black"
                {...register('newPassword')}
              />
              {errors.newPassword?.message && (
                <p className="text-red mt-2">
                  {errors.newPassword.message}
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
                    const valid = value === newPassword;
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
                Submit
              </button>
              {isSubmitting && (
                <p>Submitting...</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
