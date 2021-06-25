import React from 'react';
import styled from 'styled-components';

interface Props {
  time: any;
}

const Name = styled.div``;

export const InPresent = (props: Props) => {
  return (
    <Name>
      {props.time.map((ti: any) => (
        <div>{ti.time}</div>
      ))}
    </Name>
  );
};
