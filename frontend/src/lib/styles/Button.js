import React from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import palette from "./palette";

const buttonStyle = css`
  display: flex;
  justify-content: center;

  border: none;
  border-radius: 4px;
  padding: 0.25rem 1rem;

  font-family: "Noto Sans KR", "-apple-system ", sans-serif
  font-size: 1rem;
  font-weight: bold;
  text-align: center;

  color: white;
  background: ${palette.gray[8]};

  outline: none;
  cursor: pointer;

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
    props.middleWidth &&
    css`
      display: flex;
      justify-content: center;

      box-sizing: border-box;
      width: 21%;
      min-width: 13rem;

      margin: auto;
      margin-top: 2rem;
      padding: 0.75rem 0;
      border: 1px solid #5465ff;
      border-radius: 24px;

      font-size: 1.125rem;
      color: rgba(84, 101, 255, 1);
      background: #fff;
      a {
        /* 원래자리 */
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
      background: rgba(84, 101, 255, 1);
      &:hover {
        background: rgba(84, 101, 255, 0.7);
      }
      /* @media (max-width: 768px) {
        width: 100%;
      } */
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
