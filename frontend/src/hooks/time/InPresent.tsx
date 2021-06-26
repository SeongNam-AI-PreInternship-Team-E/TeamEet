import React from 'react';
import styled, { css } from 'styled-components';

interface Props {
  time: any;
}

const Name = styled.div<{
  canSee: string;
  hiddenText: boolean;
  isWeekend: boolean;
}>`
  ${(props) =>
    props.canSee // 옆에 클릭 칸들
      ? css`
          color: white;
          cursor: pointer;
          text-indent: -10000px;
          box-shadow: inset -1px -1px 0px rgba(0, 0, 0, 0.25);
          ${props.isWeekend &&
          css`
            background-color: #d3d3d3;
          `}
        `
      : css`
          // 시간
          color: black;
          cursor: default;
          ${props.hiddenText &&
          css`
            color: white;
          `}
        `}

  min-width: 1rem;
  min-height: 1rem;
`;

export const InPresent = (props: Props) => {
  return (
    <div>
      {props.time.map((ti: any) => (
        <Name
          canSee={ti.canSee}
          hiddenText={ti.hiddenText}
          isWeekend={ti.isWeekend}
        >
          {ti.time}
        </Name>
      ))}
    </div>
  );
};
