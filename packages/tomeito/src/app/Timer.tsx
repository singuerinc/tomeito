import { useMachine } from "@xstate/react";
import { icons } from "feather-icons";
import React from "react";
import styled from "styled-components";
import { Machine } from "xstate";

const timerMachine = Machine({
  initial: "tomato",
  states: {
    tomato: {
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
});

const View = styled.div`
  background-color: #666;
  width: 23em;
  height: 3em;
  svg {
    color: white;
  }
`;

export function Timer() {
  const [state, send] = useMachine(timerMachine);
  return (
    <View>
      <div>08:15</div>
      <div>Task title</div>
      <i dangerouslySetInnerHTML={{ __html: icons["play-circle"].toSvg() }} />
      <i dangerouslySetInnerHTML={{ __html: icons["pause-circle"].toSvg() }} />
      <i dangerouslySetInnerHTML={{ __html: icons["stop-circle"].toSvg() }} />
    </View>
  );
}
