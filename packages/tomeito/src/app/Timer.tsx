import { useMachine } from "@xstate/react";
import { icons } from "feather-icons";
import React from "react";
import { interval, Subscription } from "rxjs";
import { map, take } from "rxjs/operators";
import styled from "styled-components";
import { assign, Machine, EventObject } from "xstate";
import format from "date-fns/format";

type Tomato = {
  dateCreated: Date;
  completed: boolean;
};

type Context = {
  current: number;
  list: Tomato[];
};

const context: Context = {
  current: 0,
  list: []
};

const startTimer = () => {
  const timer = interval(1000);
  return timer.subscribe(x => {
    console.log(x, x);
  });
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
      invoke: {
        src: () =>
          interval(1000).pipe(
            map(value => ({ type: "COUNT", value })),
            take(60 * 25)
          ),
        onDone: "idle"
      },
      on: {
        COUNT: { actions: [assign((_, event) => ({ current: event.value }))] },
        CANCEL: "idle",
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
  const play = () => send("PLAY");
  const stop = () => send("STOP");
  console.log(state.context.current, format(state.context.current, "mm:ss"));
  return (
    <View>
      <div>{format(state.context.current, "mm:ss")}</div>
      <div>Task title</div>
      {state.matches("idle") && <i onClick={play} dangerouslySetInnerHTML={{ __html: icons["play-circle"].toSvg() }} />}
      {state.matches("running") && (
        <i onClick={stop} dangerouslySetInnerHTML={{ __html: icons["stop-circle"].toSvg() }} />
      )}
    </View>
  );
}
