import React from "react";
import { useMachine } from "@xstate/react";
import { Machine, interpret } from "xstate";
import styled, { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
  }
`;

const View = styled.div`
  background-color: red;
  width: 23em;
  height: 3em;
`;

const stateMachine = Machine({
  id: "state-machine",
  initial: "timer",
  context: {},
  states: {
    timer: {
      initial: "long",
      states: {
        long: {
          initial: "idle",
          states: {
            idle: {},
            running: {}
          }
        },
        break: {
          initial: "idle",
          states: {
            idle: {},
            running: {}
          }
        }
      }
    },
    settings: {}
  }
});

export function Main() {
  const [state, send] = useMachine(stateMachine);
  return (
    <>
      <Global />
      <View>{JSON.stringify(state.value)}</View>
    </>
  );
}
