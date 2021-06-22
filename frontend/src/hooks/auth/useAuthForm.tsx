import React from 'react';
import styled from 'styled-components';
import Button from '../../lib/styles/Button';
interface Props {}

const AuthFormBlock = styled.div`
  display: block;
`;

const StyledInput = styled.input`
  display: block;
  margin: auto;
  font-size: 1rem;
  border: 1px solid #ffffff;
  padding-bottom: 0.5rem;
  border-radius: 10px;
  outline: none;
  min-width: 15rem;
  height: 3rem;

  background-color: transparent;
  &:focus {
    color: $oc-teal-7;
    border: 4px solid #ffffff;
  }
  & + & {
    margin-top: 2.5rem;
  }
`;

const Footer = styled.div`
  margin-top: 2rem;
  text-align: center;
  font-family: sans-serif;
  font-size: 1rem;
  color: white;
`;

export default function AuthForm({}: Props) {
  return (
    <AuthFormBlock>
      <StyledInput
        autoComplete="username"
        name="username"
        placeholder="ID를 입력해주세요"
      />
      <StyledInput
        autoComplete="new-password"
        name="password"
        placeholder="비밀번호를 입력해주세요"
        type="password"
      />
      <Button middleWidth>
        <a>로그인</a>
      </Button>
      <Footer>
        To invite people to this event <br />
        you can email them.
      </Footer>
    </AuthFormBlock>
  );
}
