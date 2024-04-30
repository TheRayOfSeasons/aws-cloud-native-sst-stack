import React from 'react';
import { Router } from '@reach/router';
import { IndexPage } from './pages';
import { LoginPage } from './pages/auth/login';
import { NotFoundPage } from './pages/404';
import { UnauthorizeedPage } from './pages/401';
import { ConfirmPage } from './pages/auth/confirm';
import { AuthLayout } from './layouts/AuthLayout';
import { ForbiddenPage } from './pages/403';
import { ConfirmPasswordChangePage } from './pages/auth/confirm-password-change';
import { ForgotPasswordPage } from './pages/auth/forgot-password';
import { RegisterPage } from './pages/auth/register';
import { DashboardLayout } from './layouts/DashboardLayout';
import { NotesDetailPage } from './pages/notes/detail';

export const Routes: React.FC = () => {
  return (
    <Router>
      <DashboardLayout path="/">
        <IndexPage path="/" />
        <NotesDetailPage path="/notes/:id" />
      </DashboardLayout>
      <AuthLayout path="/auth">
        <LoginPage path="/" />
        <ConfirmPage path="/confirm" />
        <ConfirmPasswordChangePage path="/confirm-password-change" />
        <ForgotPasswordPage path="/forgot-password" />
        <RegisterPage path="/register" />
      </AuthLayout>
      <UnauthorizeedPage path="/401" />
      <ForbiddenPage path="/403" />
      <NotFoundPage path="/404" />
    </Router>
  );
};
