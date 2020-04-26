import React from "react";
import styled from "styled-components";
const StyledBell = styled.i`
  &,
  &::before {
    border-top-left-radius: 100px;
    border-top-right-radius: 100px;
  }
  & {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs, 1));
    border: 2px solid;
    border-bottom: 0;
    width: 14px;
    height: 14px;
  }
  &::after,
  &::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
  }
  &::before {
    background: currentColor;
    width: 4px;
    height: 4px;
    top: -4px;
    left: 3px;
  }
  &::after {
    border-radius: 3px;
    width: 16px;
    height: 10px;
    border: 6px solid transparent;
    border-top: 1px solid transparent;
    box-shadow: inset 0 0 0 4px, 0 -2px 0 0;
    top: 14px;
    left: -3px;
    border-bottom-left-radius: 100px;
    border-bottom-right-radius: 100px;
  }
`;
export const Bell = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => {
  return (
    <>
      <StyledBell {...props} ref={ref} icon-role="bell" />
    </>
  );
});
