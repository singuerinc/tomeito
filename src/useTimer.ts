import mitt, { Emitter } from "mitt";
import { useMachine, useSelector } from "@xstate/react";
import {
  addMilliseconds,
  differenceInMilliseconds,
  setMilliseconds,
} from "date-fns";
import { useCallback, useMemo } from "react";
import { assign, createMachine, State } from "xstate";

export const MIN_0 = 0;
export const MIN_1 = 60 * 1000;
export const MIN_5 = 5 * 60 * 1000;
export const MIN_25 = 25 * 60 * 1000;
export const AN_HOUR = 60 * 60 * 1000;

type Context = {
  emitter: Emitter<Record<"completed", unknown>>;
  totalTime: number;
  endAt: Date;
  accumulated: Date;
};

type AddEvent = {
  type: "ADD";
  amount: number;
};

type RemoveEvent = {
  type: "REMOVE";
  amount: number;
};

type Events =
  | AddEvent
  | RemoveEvent
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "STOP" }
  | { type: "TICK" };

const emitter = mitt();

export const timerMachine = createMachine<Context, Events>(
  {
    predictableActionArguments: true,
    context: {
      emitter,
      totalTime: MIN_0,
      endAt: new Date(0),
      accumulated: new Date(0),
    },
    initial: "idle",
    on: {
      ADD: [
        {
          cond: "totalIsLessThanAnHour",
          actions: ["add", "updateEndAt"],
        },
      ],
      REMOVE: [
        {
          cond: "afterRemovalTotalIsMoreThanZero",
          actions: ["remove", "updateEndAt"],
        },
      ],
    },
    states: {
      idle: {
        entry: ["zero"],
        on: {
          STOP: {
            actions: ["zero"],
          },
          START: [
            {
              cond: "totalIsMoreThanZero",
              target: "running",
            },
          ],
        },
      },
      pause: {
        on: {
          STOP: "idle",
          START: [
            {
              cond: "totalIsMoreThanZero",
              target: "running",
            },
          ],
        },
      },
      running: {
        entry: ["updateEndAt", "update"],
        invoke: {
          src: "tick",
        },
        on: {
          PAUSE: "pause",
          STOP: "idle",
          TICK: [
            {
              cond: "accumulatedIsMoreThanZero",
              actions: ["update"],
            },
            {
              target: "idle",
              actions: ["sendTimerComplete"],
            },
          ],
        },
      },
    },
  },
  {
    guards: {
      totalIsLessThanAnHour: (ctx, event) =>
        ctx.totalTime + (event as AddEvent).amount < AN_HOUR,
      afterRemovalTotalIsMoreThanZero: (ctx, event) =>
        ctx.totalTime - (event as RemoveEvent).amount > 0,
      totalIsMoreThanZero: (ctx) => ctx.totalTime > 0,
      accumulatedIsMoreThanZero: (ctx) => ctx.accumulated.getTime() > 999,
    },
    actions: {
      sendTimerComplete: () => {
        emitter.emit("completed");
      },
      add: assign({
        totalTime: (ctx, event) => ctx.totalTime + (event as AddEvent).amount,
        accumulated: (ctx, event) =>
          addMilliseconds(ctx.accumulated, (event as AddEvent).amount),
      }),
      remove: assign({
        totalTime: (ctx, event) => ctx.totalTime - (event as AddEvent).amount,
        accumulated: (ctx, event) =>
          addMilliseconds(ctx.accumulated, -(event as AddEvent).amount),
      }),
      zero: assign({
        accumulated: () => new Date(0),
        totalTime: () => 0,
      }),
      updateEndAt: assign({
        endAt: (ctx) => {
          const now = setMilliseconds(new Date(), 0);
          const acc = setMilliseconds(ctx.accumulated, 0);
          const end = addMilliseconds(now, acc.getTime());
          return setMilliseconds(end, 999);
        },
      }),
      update: assign({
        accumulated: (ctx) => {
          const now = new Date();
          const diff = differenceInMilliseconds(ctx.endAt, now);
          return addMilliseconds(new Date(0), diff);
        },
      }),
    },
    services: {
      tick: () => (callback) => {
        const id = setInterval(() => {
          callback("TICK");
        }, 500);

        callback("TICK");

        return () => clearInterval(id);
      },
    },
  }
);

export function useTimer() {
  const m = useMemo(() => timerMachine, []);
  const [, send, service] = useMachine(m);
  const accumulated = useSelector(
    service,
    (state: State<Context>) => state.context.accumulated
  );
  const isRunning = useSelector(service, (state: State<Context>) =>
    state.matches("running")
  );
  const start = useCallback(() => send("START"), [send]);
  const pause = useCallback(() => send("PAUSE"), [send]);
  const stop = useCallback(() => send("STOP"), [send]);
  const add25 = useCallback(
    () => send({ type: "ADD", amount: MIN_25 }),
    [send]
  );
  const add5 = useCallback(() => send({ type: "ADD", amount: MIN_5 }), [send]);
  const add1 = useCallback(() => send({ type: "ADD", amount: MIN_1 }), [send]);
  const remove1 = useCallback(
    () => send({ type: "REMOVE", amount: MIN_1 }),
    [send]
  );
  const with25 = useCallback(() => {
    send("STOP");
    send({ type: "ADD", amount: MIN_25 });
    send("START");
  }, [send]);

  return {
    emitter,
    accumulated,
    isRunning,
    start,
    pause,
    stop,
    add25,
    add5,
    add1,
    remove1,
    with25,
  };
}
