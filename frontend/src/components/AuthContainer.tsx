import * as React from 'react';
import { AuthTemplate } from '../hooks/auth/useAuth';

import AuthForm from './../hooks/auth/useAuthForm';
type Props = {
  type: string;
};
export const AuthContainer = (props: Props) => {
  return (
    <AuthTemplate>
      <AuthForm type={props.type}></AuthForm>
    </AuthTemplate>
  );
};
