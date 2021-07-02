import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import palette from './palette';

const buttonStyle = css`
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  color: white;
  outline: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  text-align: center;
  background: ${palette.gray[8]};
  &:hover {
    background: ${palette.gray[6]};
  }
  ${(props) =>
    props.fullWidth &&
    css`
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      width: 100%;
      font-size: 1.125rem;
    `}
  ${(props) =>
    props.middlewidth &&
    css`
      display: flex;
      justify-content: center;
      margin: auto;
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      box-sizing: border-box;
      background: #ffffff;
      border: 1px solid #5465ff;
      border-radius: 24px;
      width: 21%;
      min-width: 13rem;
      font-size: 1.125rem;
      color: rgba(84, 101, 255, 1);
      margin-top: 2rem;
      a {
        font-family: Noto Sans KR;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 26px;
      }
      & + & {
        margin-top: 0.5rem;
      }
    `}
  ${(props) =>
    props.cyan &&
    css`
      background: #5465ff;
      &:hover {
        background: rgba(84, 101, 255, 0.7);
      }
      @media (max-width: 768px) {
        width: 100%;
      }
    `}
    &:disabled {
    background: ${palette.gray[3]};
    color: ${palette.gray[5]};
    cursor: not-allowed;
  }
`;

const StyledButton = styled.button`
  ${buttonStyle}
`;

const StyledLink = styled(Link)`
  ${buttonStyle}
`;

const Button = (props) => {
  return props.to ? (
    <StyledLink {...props} cyan={props.cyan ? 1 : 0} />
  ) : (
    <StyledButton {...props} />
  );
};

export default Button;
