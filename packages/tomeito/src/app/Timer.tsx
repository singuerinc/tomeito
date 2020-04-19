import { useMachine } from "@xstate/react";
import { icons } from "feather-icons";
import React from "react";
import styled from "styled-components";
import { Machine } from "xstate";

type Tomato = {
  time: number;
  complete: boolean;
};

type Context = {
  current: Tomato;
  list: Tomato[];
};

const context: Context = {
  current: {
    time: 0,
    complete: false
  },
  list: []
};

const timerMachine = Machine({
  initial: "idle",
  context,
  states: {
    idle: {
      on: {
        PLAY: "running"
      }
    },
    running: {
      on: {
        STOP: "idle"
      }
    }
  }
});

const View = styled.div`
  background-color: #666;
  width: 23em;
  svg {
    color: white;
  }
`;

export function Timer() {
  const [state, send] = useMachine(timerMachine);
  const play = () => {
    send("PLAY", {});
  };
  const stop = () => send("STOP");
  return (
    <View>
      <div>08:15</div>
      <div>Task title</div>
      {state.matches("idle") && <i onClick={play} dangerouslySetInnerHTML={{ __html: icons["play-circle"].toSvg() }} />}
      {state.matches("running") && (
        <i onClick={stop} dangerouslySetInnerHTML={{ __html: icons["stop-circle"].toSvg() }} />
      )}
    </View>
  );
}
