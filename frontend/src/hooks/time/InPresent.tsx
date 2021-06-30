import styled, { css } from 'styled-components';

interface Props {
  time: any;
  onClickDrag: (time: number, day: number) => void;
  isDown: any;
  onChangeDown: any;
  onClickTime: (time: number, day: number) => void;
}

const Name = styled.div<{
  canSee: string;
  hiddenText: boolean;
  isWeekend: boolean;
  trash: boolean;
}>`
  ${(props) =>
    props.canSee // 옆에 클릭 칸들
      ? css`
          color: black;
          cursor: pointer;
          text-indent: -10000px;
          &:hover {
            text-indent: 0px;
          }
          box-shadow: inset -1px -1px 0px 0px rgba(0, 0, 0, 0.25);
          background-color: ${props.color}};
          ${props.isWeekend && css``}
        `
      : css`
          // 시간
          color: black;
          cursor: default;

          ${props.hiddenText &&
          css`
            color: white;
          `}
          ${props.trash &&
          css`
            cursor: not-allowed;
            text-indent: -10000px;
            box-shadow: inset -1px -1px 0px 0px rgba(0, 0, 0, 0.25);
          `}
        `}

  min-width: 1rem;
  min-height: 1rem;
  font-size: 0.8rem;
`;

export const InPresent = ({
  time,
  isDown,
  onChangeDown,
  onClickDrag,
  onClickTime,
}: Props) => {
  return (
    <div>
      {time.map((ti: any) => (
        <Name
          key={ti.time}
          canSee={ti.canSee}
          hiddenText={ti.hiddenText}
          isWeekend={ti.isWeekend}
          trash={ti.trash}
          color={ti.color}
          // style={{ backgroundColor: `${ti.color}` }}
          onMouseDown={(e) => {
            e.preventDefault();
            onChangeDown({ drag: true, key: ti.time });
            onClickTime(ti.time, ti.day);
          }}
          onMouseMove={() => {
            if (isDown.drag === true) {
              if (isDown.key !== ti.time) onClickDrag(ti.time, ti.day);
              onChangeDown({ drag: true, key: ti.time });
            }
          }}
          onMouseUp={() => {
            onChangeDown(false);
          }}
        >
          {ti.time}
        </Name>
      ))}
    </div>
  );
};
