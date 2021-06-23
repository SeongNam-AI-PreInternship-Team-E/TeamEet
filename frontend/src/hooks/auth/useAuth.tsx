import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Background from '../../image.jpg';
import { url } from 'inspector';
type Props = {};

function useAuth() {}

const AuthTemplateBlock = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
`;

const BlackBox = styled.div`
  .logo-area {
    display: block;
    color: rgba(255, 255, 255, 1);
    padding-bottom: 2rem;
    text-align: center;
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    letter-spacing: 2px;
  }
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 50%;
  min-width: 20rem;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 2px;
`;

export function AuthTemplate({ children }: any) {
  return (
    <AuthTemplateBlock style={{ backgroundImage: `url(${Background})` }}>
      <BlackBox>
        <div className="logo-area">Welcome to PickDay</div>
        {children}
      </BlackBox>
    </AuthTemplateBlock>
  );
}
