import { useMachine } from "@xstate/react";
import format from "date-fns/format";
import React from "react";
import { interval } from "rxjs";
import { map, take } from "rxjs/operators";
import styled from "styled-components";
import { assign, Machine } from "xstate";
import { PlayButtonR } from "../icons/PlayButtonR";
import { PlayStopR } from "../icons/PlayStopR";

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
  id: "timer",
  initial: "tomato",
  context,
  states: {
    tomato: {
      initial: "idle",
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
            onDone: "#timer.break"
          },
          on: {
            COUNT: { actions: [assign((_, event) => ({ current: event.value }))] },
            CANCEL: "#timer.break",
            STOP: "#timer.break"
          }
        }
      }
    },
    break: {
      initial: "idle",
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
            onDone: "#timer.tomato"
          },
          on: {
            COUNT: { actions: [assign((_, event) => ({ current: event.value }))] },
            CANCEL: "#timer.tomato",
            STOP: "#timer.tomato"
          }
        }
      }
    }
  }
});

export function Timer() {
  const [state, send] = useMachine(timerMachine);
  const play = () => send("PLAY");
  const stop = () => send("STOP");

  console.log(state.value);
  console.log(state.context.current, format(state.context.current, "mm:ss"));

  const idle = state.matches("tomato.idle") || state.matches("break.idle");
  const running = state.matches("tomato.running") || state.matches("break.running");
  return (
    <View>
      <div>
        <div>{format(state.context.current, "mm:ss")}</div>
      </div>
      <div>
        <div>Task title</div>
      </div>
      <div>
        {idle && <PlayButtonR onClick={play} />}
        {running && <PlayStopR onClick={stop} />}
      </div>
    </View>
  );
}

const View = styled.div`
  display: flex;
  background-color: #666;
  width: 23em;
  svg {
    color: white;
  }

  > div:nth-of-type(1) {
    flex: 20%;
  }
  > div:nth-of-type(2) {
    flex: 1 1 100%;
  }
  > div:nth-of-type(3) {
    flex: 20%;
  }
`;
