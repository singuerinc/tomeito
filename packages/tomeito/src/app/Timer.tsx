import { useMachine } from "@xstate/react";
import format from "date-fns/format";
import React, { useEffect, useRef, useState } from "react";
import { interval } from "rxjs";
import { map, take } from "rxjs/operators";
import styled from "styled-components";
import { assign, Machine } from "xstate";
import { PlayButtonR } from "../icons/PlayButtonR";
import { PlayStopR } from "../icons/PlayStopR";
import initSound from "../sound/init.mp3";
import tickSound from "../sound/tick.mp3";
import completeSound from "../sound/tone.mp3";

const TIMER_TIME = 60 * 25;
const BREAK_TIME = 60 * 5;

type Tomato = {
  dateCreated: Date;
  completed: boolean;
};

const tick = new Audio();
tick.src = tickSound;
tick.loop = true;
tick.volume = 0.1;

const context: TimerContext = {
  tickSound: tick,
  current: TIMER_TIME,
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
  const isBreak = state.matches("break");
  const total = isBreak ? BREAK_TIME : TIMER_TIME;

  const color = mapStateToColor(idle ? "idle" : "running");

  const [task, setTask] = useState("Task");

  const onTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => setTask(e.target.value);

  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    ref.current && (ref.current.style.width = 325 - 325 * (state.context.current / total) + "px");
  }, [state.context.current]);

  return (
    <View color={color}>
      <span ref={ref}></span>
      <div>
        <div>{time}</div>
      </div>
      <div>
        {isBreak ? <div>Break!</div> : <input type="text" value={task} onChange={onTaskChange} />}
      </div>
      <div>
        {idle && <PlayButtonR onClick={play} />}
        {running && <PlayStopR onClick={stop} />}
      </div>
    </View>
  );
}

const timerMachine = Machine<TimerContext, TimerStateSchema, TimerEvent>(
  {
    id: "timer",
    strict: true,
    initial: "tomato",
    context,
    states: {
      tomato: {
        initial: "idle",
        states: {
          idle: {
            entry: [assign(_ => ({ current: TIMER_TIME }))],
            on: {
              PLAY: "running"
            }
          },
          running: {
            entry: ["playInitSound", "playTickSound"],
            invoke: {
              src: () =>
                interval(1000).pipe(
                  map(() => ({ type: "COUNT" })),
                  take(TIMER_TIME)
                ),
              onDone: {
                actions: ["stopTickSound", "playCompleteSound"],
                target: "#timer.break"
              }
            },
            on: {
              COUNT: { actions: [assign(ctx => ({ current: ctx.current - 1 }))] },
              CANCEL: {
                actions: ["stopTickSound"],
                target: "#timer.break"
              },
              STOP: {
                actions: ["stopTickSound"],
                target: "#timer.break"
              }
            }
          }
        }
      },
      break: {
        initial: "idle",
        states: {
          idle: {
            entry: [assign(_ => ({ current: BREAK_TIME }))],
            on: {
              PLAY: "running"
            }
          },
          running: {
            entry: ["playInitSound", "playTickSound"],
            invoke: {
              src: () =>
                interval(1000).pipe(
                  map(() => ({ type: "COUNT" })),
                  take(BREAK_TIME)
                ),
              onDone: {
                actions: ["stopTickSound", "playCompleteSound"],
                target: "#timer.tomato"
              }
            },
            on: {
              COUNT: { actions: [assign(ctx => ({ current: ctx.current - 1 }))] },
              CANCEL: {
                actions: ["stopTickSound"],
                target: "#timer.tomato"
              },
              STOP: {
                actions: ["stopTickSound"],
                target: "#timer.tomato"
              }
            }
          }
        }
      }
    }
  },
  {
    actions: {
      playInitSound: () => {
        const a = new Audio();
        a.src = initSound;
        a.play();
      },
      playTickSound: ctx => {
        ctx.tickSound.play();
      },
      stopTickSound: ctx => {
        ctx.tickSound.pause();
        ctx.tickSound.currentTime = 0;
      },
      playCompleteSound: () => {
        const a = new Audio();
        a.src = completeSound;
        a.play();
      }
    }
  }
);

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
  | { type: "COUNT" }
  | { type: "CANCEL" }
  | { type: "STOP"; current: number };

interface TimerContext {
  current: number;
  list: Tomato[];
  tickSound: HTMLAudioElement;
}

const View = styled.div<{ color: string }>`
  box-sizing: border-box;
  position: relative;
  display: flex;
  background-color: ${props => props.color};
  width: 325px;
  padding: 5px;
  svg {
    color: white;
  }

  > span {
    z-index: 0;
    background: rgba(0, 0, 0, 0.1);
    width: 325px;
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
  }

  > div:nth-of-type(1) {
    z-index: 1;
    flex: 0 0 46px;
    font-variant-numeric: tabular-nums;
  }
  > div:nth-of-type(2) {
    z-index: 1;
    flex: 1 1 auto;
    padding: 0 5px;
    input {
      padding: 0;
      margin: 0;
      border: 0;
      width: 100%;
      font-size: 1em;
      background: transparent;
      &:focus {
        outline-width: 0;
      }
    }
  }
  > div:nth-of-type(3) {
    z-index: 1;
    flex: 0 0;
  }
`;
