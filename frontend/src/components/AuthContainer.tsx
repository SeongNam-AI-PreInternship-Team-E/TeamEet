import * as React from 'react';
import { AuthTemplate } from '../hooks/auth/useAuth';

import AuthForm from './../hooks/auth/useAuthForm';
type Props = {};
export const AuthContainer = (props: Props) => {
  return (
    <AuthTemplate>
      <AuthForm></AuthForm>
    </AuthTemplate>
  );
};
