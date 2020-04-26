import React from "react";
import styled from "styled-components";
const StyledPathBack = styled.i`
  & {
    display: block;
    position: relative;
    box-sizing: border-box;
    transform: scale(var(--ggs, 1));
    width: 14px;
    height: 14px;
  }
  &::after,
  &::before {
    content: "";
    position: absolute;
    display: block;
    box-sizing: border-box;
    width: 10px;
    height: 10px;
  }
  &::after {
    border: 2px solid;
  }
  &::before {
    border-right: 5px solid;
    border-bottom: 5px solid;
    bottom: 0;
    right: 0;
  }
`;
export const PathBack = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => {
  return (
    <>
      <StyledPathBack {...props} ref={ref} icon-role="path-back" />
    </>
  );
});
