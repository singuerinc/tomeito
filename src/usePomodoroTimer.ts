import { useMachine, useSelector } from "@xstate/react";
import { useCallback, useMemo } from "react";
import { assign, createMachine } from "xstate";

const machine = createMachine(
  {
    predictableActionArguments: true,
    initial: "idle",
    context: {
      mode: "TOMATO",
    },
    states: {
      idle: {
        entry: ["add25"],
        on: {
          PLAY: [
            {
              target: "running",
              cond: "isResting",
              actions: ["stop", "add5", "start"],
            },
            { target: "running", actions: ["stop", "add25", "start"] },
          ],
        },
      },
      running: {
        on: {
          PAUSE: [{ target: "paused", actions: ["pause"] }],
          SKIP: [
            {
              target: "idle",
              cond: "isResting",
              actions: ["stop", "setAsTomato"],
            },
            { actions: ["stop", "setAsResting", "add5", "start"] },
          ],
          COMPLETED: [
            {
              target: "idle",
              cond: "isResting",
              actions: ["stop", "setAsTomato"],
            },
            {
              actions: ["addPomodoro", "stop", "setAsResting", "add5", "start"],
            },
          ],
        },
      },
      paused: {
        on: {
          PLAY: [{ target: "running", actions: ["start"] }],
        },
      },
    },
  },
  {
    actions: {
      setAsTomato: assign(() => ({ mode: "TOMATO" })),
      setAsResting: assign(() => ({ mode: "RESTING" })),
    },
    guards: {
      isResting: (ctx) => ctx.mode === "RESTING",
    },
  }
);

export function usePomodoroTimer({
  addPomodoro,
  add25,
  add5,
  start,
  stop,
  pause,
}: {
  addPomodoro: VoidFunction;
  add25: VoidFunction;
  add5: VoidFunction;
  start: VoidFunction;
  stop: VoidFunction;
  pause: VoidFunction;
}) {
  const m = useMemo(() => machine, []);
  const [state, send, service] = useMachine(m, {
    actions: { add25, add5, start, stop, pause, addPomodoro },
  });

  const isIdle = state.matches("idle");
  const isRunning = state.matches("running");
  const isPaused = state.matches("paused");

  const isResting = useSelector(
    service,
    (state) => state.context.mode === "RESTING"
  );

  const handlePlay = useCallback(() => {
    send("PLAY");
  }, [send]);

  const handlePause = useCallback(() => {
    send("PAUSE");
  }, [send]);

  const handleSkip = useCallback(() => {
    send("SKIP");
  }, [send]);

  const handleCompleted = useCallback(() => {
    send("COMPLETED");
  }, [send]);

  return {
    isIdle,
    isRunning,
    isResting,
    isPaused,
    handlePlay,
    handlePause,
    handleSkip,
    handleCompleted,
  };
}
