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

const context: TimerContext = {
  current: 0,
  list: []
};

const mapStateToColor = (state: "idle" | "running"): string =>
  ({ idle: "#ff0000", running: "#00ff00" }[state]);

export function Timer() {
  const [state, send] = useMachine(timerMachine);
  const play = () => send("PLAY");
  const stop = () => send("STOP");
  const time = format(new Date(2000, 0, 1, 0, 0, state.context.current), "mm:ss");

  const idle = state.matches("tomato.idle") || state.matches("break.idle");
  const running = state.matches("tomato.running") || state.matches("break.running");

  const color = mapStateToColor(idle ? "idle" : "running");

  return (
    <View color={color}>
      <div>
        <div>{time}</div>
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

const timerMachine = Machine<TimerContext, TimerStateSchema, TimerEvent>({
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

interface TimerStateSchema {
  states: {
    tomato: {
      states: {
        idle: {};
        running: {};
      };
    };
    break: {
      states: {
        idle: {};
        running: {};
      };
    };
  };
}

type TimerEvent =
  | { type: "PLAY" }
  | { type: "COUNT"; value: number }
  | { type: "CANCEL" }
  | { type: "STOP" };

interface TimerContext {
  current: number;
  list: Tomato[];
}

const View = styled.div<{ color: string }>`
  display: flex;
  background-color: ${props => props.color};
  width: 23em;
  padding: 0.5em;
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
    flex: 1 1;
  }
`;
