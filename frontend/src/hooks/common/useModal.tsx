import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../lib/styles/Button';
import UseHour from './UseHour';
import { useSelector } from 'react-redux';
import { RootState } from '../../modules';

interface Props {}

export function useModal() {
  const { title } = useSelector((state: RootState) => ({
    title: state.calendar.title,
  }));
  const [modal, setModal] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const onNextClick = () => {
    if (title === '') {
      alert('입력칸이 비어 있습니다.');
      return;
    }
    setModal(true);
  };
  const onCancel = () => {
    setModal(false);
  };
  const onConfirm = () => {
    setModal(false);
  };
  const onSetStart = (time: string) => {
    setStart(time);
  };
  const onSetEnd = (time: string) => {
    setEnd(time);
  };
  return {
    modal,
    onNextClick,
    onCancel,
    onConfirm,
    start,
    end,
    onSetStart,
    onSetEnd,
    title,
  };
}

const FullScreen = styled.div`
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AskModalBlock = styled.div`
  width: 400px;
  background: white;
  padding: 1.5rem;
  border-radius: 4px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.125);
  display: block;
  h2 {
    display: inline-block;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    width: 50%;
  }
  h3 {
    display: inline-block;
    width: 45%;
    font-size: 1rem;
    text-align: right;
    margin-right: 0.5rem;
  }
  p {
    margin-bottom: 0.5rem;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
  }
`;
const StyledButton = styled(Button)`
  height: 2rem;
  margin-right: 0.5rem;
  & + & {
    margin-left: 0.75rem;
  }
`;

export default function Modal({ visible, onCancel, onConfirm }: any) {
  const {
    modal,
    onNextClick,
    start,
    end,
    onSetStart,
    onSetEnd,
    title,
  } = useModal();
  if (!visible) return null;
  return (
    <FullScreen>
      <AskModalBlock>
        {console.log(start, end)}
        <UseHour onSetStart={onSetStart} onSetEnd={onSetEnd}></UseHour>
        <h2>모임 제목 : </h2>
        <h3>{title}</h3>
        <p></p>
        <div className="buttons">
          <StyledButton onClick={onCancel}>취소</StyledButton>
          <StyledButton cyan onClick={onConfirm} to="/register">
            확인
          </StyledButton>
        </div>
      </AskModalBlock>
    </FullScreen>
  );
}
