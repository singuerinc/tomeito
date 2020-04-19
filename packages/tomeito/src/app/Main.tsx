import { useMachine } from "@xstate/react";
import React from "react";
import { createGlobalStyle } from "styled-components";
import { Machine } from "xstate";
import { Settings } from "./Settings";
import { Timer } from "./Timer";

const Global = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
  }
`;

const stateMachine = Machine({
  initial: "timer",
  context: {},
  states: {
    timer: {},
    settings: {}
  }
});

export function Main() {
  const [state, send] = useMachine(stateMachine);
  return (
    <>
      <Global />
      <Timer />
      <Settings />
    </>
  );
}
