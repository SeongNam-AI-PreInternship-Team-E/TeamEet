import React, { useState, useEffect, FunctionComponent } from 'react';
import styled from 'styled-components';
import Button from '../../lib/styles/Button';
import { changeField, initialForm, register, login } from '../../modules/auth';
import { setInitialDate } from '../../modules/calendar';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../modules';
import type { IdPw } from '../../modules/auth';

import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import {
  clonePickDays,
  addUseMonth,
  canChoosePick,
} from '../../modules/timetable';
import { cloneDays } from '../../modules/individual';
import { isFSA } from '@reduxjs/toolkit/dist/createAction';
import { cloneUrl, makingNew } from '../../modules/teamtime';
interface Props {
  type: string;
}
interface MatchParams {
  url: string; // params
}
export const useAuthForm = ({ history, match }: any) => {
  const { id, pw, form, PickDays, response, url, Authorization } = useSelector(
    (state: RootState) => ({
      id: state.auth.id,
      pw: state.auth.pw,
      form: state.auth.form,
      PickDays: state.calendar.PickDays,
      response: state.calendar.response,
      url: state.calendar.url,
      Authorization: state.auth.Authorization,
    })
  );
  const dispatch = useDispatch();
  const [check, onChangeCheck] = useState(false);
  const myurl = match.params;
  useEffect(() => {
    dispatch(initialForm());
    dispatch(setInitialDate());
    dispatch(clonePickDays(PickDays));
    dispatch(cloneDays(PickDays));
    dispatch(addUseMonth());
    dispatch(canChoosePick());
  }, [dispatch]);
  useEffect(() => {
    if (Authorization) {
      console.log('로그인 성공');
      history.push('/timetable');
    }
  });
  const onSubmit = (e: any) => {
    e.preventDefault();
    const user: IdPw = {
      id: id,
      pw: pw,
      url: myurl.url !== undefined ? myurl.url : url,
    };
    console.log(myurl);
    myurl && dispatch(makingNew());
    myurl && dispatch(cloneUrl(myurl.url));
    check && dispatch(register(user));
    !check && dispatch(login(user));
  };
  const onChange = (e: any) => {
    const { value, name } = e.target;
    dispatch(changeField({ key: name, value: value }));
  };
  return { onChange, id, pw, onSubmit, onChangeCheck, response };
};

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
  padding-left: 0.5rem;
  background-color: transparent;
  color: white;
  ::placeholder {
    padding-left: 0.5rem;
    color: white;
  }
  &:focus {
    ::placeholder {
      display: none;
    }
    padding-left: 0.5rem;
    color: white;
    border: 4px solid #ffffff;
  }
  & + & {
    margin-top: 2.5rem;
  }
`;

const LoginOrRegister = styled.div`
  margin-top: 1rem;
  text-align: center;
  min-width: 15rem;
  padding-left: 6rem;
  box-sizing: border-box;
  a {
    color: white;
    text-decoration: underline;
    &:hover {
      color: rgba(256, 256, 256, 0.4);
    }
  }
`;

const Footer = styled.div`
  margin-top: 2rem;
  text-align: center;
  font-family: sans-serif;
  font-size: 1rem;
  color: white;
`;

const AuthForm = ({
  history,
  match,
  type,
}: RouteComponentProps<MatchParams> & Props) => {
  const { onChange, id, pw, onSubmit, onChangeCheck, response } = useAuthForm({
    history,
    match,
  });
  const url = match.params;
  useEffect(() => {
    if (type === 'register') {
      onChangeCheck(true);
    } else {
      onChangeCheck(false);
    }
  }, [onChangeCheck, type]);
  return (
    <AuthFormBlock>
      {response.private_pages &&
        console.log('url', response.private_pages[0].url)}
      <form onSubmit={onSubmit}>
        <StyledInput
          autoComplete="username"
          name="username"
          placeholder="ID를 입력해주세요"
          onChange={onChange}
          value={id}
        />
        <StyledInput
          autoComplete="new-password"
          name="password"
          placeholder="비밀번호를 입력해주세요"
          type="password"
          onChange={onChange}
          value={pw}
        />
        <LoginOrRegister>
          {type === 'register' && (
            <LoginOrRegister>
              {url.url !== undefined ? (
                <Link to={`/login/${url.url}`}>로그인</Link>
              ) : (
                <Link to="/login">로그인</Link>
              )}
            </LoginOrRegister>
          )}
          {type === 'login' && (
            <LoginOrRegister>
              {url.url !== undefined ? (
                <Link to={`/register/${url.url}`}>회원가입</Link>
              ) : (
                <Link to="/register">회원가입</Link>
              )}
            </LoginOrRegister>
          )}
        </LoginOrRegister>
        {type === 'register' && <Button middlewidth="true">회원가입</Button>}
        {type === 'login' && <Button middlewidth="true">로그인</Button>}
      </form>

      <Footer>
        To invite people to this event <br />
        you can email them.
      </Footer>
    </AuthFormBlock>
  );
};

export default withRouter(AuthForm);
