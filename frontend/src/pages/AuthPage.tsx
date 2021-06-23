import React, { ReactElement } from 'react';
import { AuthContainer } from '../components/AuthContainer';
type Props = {
  type: string;
};

export default function AuthPage({ type }: Props): ReactElement {
  return <AuthContainer type="register" />;
}
