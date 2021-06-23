import React, { ReactElement } from 'react';
import { AuthContainer } from '../components/AuthContainer';
interface Props {}

export default function LoginPage({}: Props): ReactElement {
  return <AuthContainer type="login" />;
}
