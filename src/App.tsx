import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipForward,
} from "@tabler/icons-react";
import { useMachine, useSelector } from "@xstate/react";
import format from "date-fns/format";
import { useCallback, useEffect, useMemo } from "react";
import { assign, createMachine } from "xstate";
import { useTimer } from "./useTimer";
import { usePomodori } from "./usePomodori";

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

function App() {
  const { addPomodoro, pomodori } = usePomodori();
  const { add25, add5, accumulated, start, stop, pause, emitter } = useTimer();
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

  useEffect(() => {
    emitter.on("completed", () => {
      send("COMPLETED");
    });

    return () => emitter.off("completed");
  }, [emitter, send]);

  return (
    <>
      {isIdle && (
        <IdleState
          key="idle"
          pomodori={pomodori}
          accumulated={accumulated}
          handlePlay={handlePlay}
        />
      )}
      {isRunning && (
        <RunningState
          key="running"
          accumulated={accumulated}
          isResting={isResting}
          handlePause={handlePause}
          handleSkip={handleSkip}
        />
      )}
      {isPaused && (
        <PausedState
          key="paused"
          accumulated={accumulated}
          handlePlay={handlePlay}
        />
      )}
    </>
  );
}

function IdleState({
  handlePlay,
  accumulated,
  pomodori,
}: {
  handlePlay: VoidFunction;
  accumulated: Date;
  pomodori: null[];
}) {
  return (
    <div className="grid grid-cols-10 h-12 items-center bg-[#57423F]">
      <Timer accumulated={accumulated} />
      <Pomodori pomodori={pomodori} />
      <div className="col-start-10">
        <PlayButton onClick={handlePlay} />
      </div>
    </div>
  );
}

function RunningState({
  isResting,
  handlePause,
  handleSkip,
  accumulated,
}: {
  isResting: boolean;
  handlePause: VoidFunction;
  handleSkip: VoidFunction;
  accumulated: Date;
}) {
  return (
    <div
      className={`grid grid-cols-10 h-12 items-center ${
        isResting ? "bg-[#5C9C00]" : "bg-[#FF4545]"
      }`}
    >
      <Timer accumulated={accumulated} />
      <div
        className={`${
          !isResting ? "col-start-9" : "col-start-10"
        } col-span-2 grid grid-cols-2`}
      >
        {!isResting && <PauseButton onClick={handlePause} />}
        <SkipButton onClick={handleSkip} />
      </div>
    </div>
  );
}

function PausedState({
  handlePlay,
  accumulated,
}: {
  handlePlay: VoidFunction;
  accumulated: Date;
}) {
  return (
    <div className="grid grid-cols-10 h-12 items-center bg-[#BFA6A2]">
      <Timer accumulated={accumulated} />
      <div className="col-start-10 col-span-2 grid grid-cols-2">
        <PlayButton onClick={handlePlay} />
      </div>
    </div>
  );
}

function PlayButton({ onClick }: { onClick: VoidFunction }) {
  return (
    <IconPlayerPlay
      className="cursor-pointer text-white mix-blend-overlay"
      onClick={onClick}
    />
  );
}

function PauseButton({ onClick }: { onClick: VoidFunction }) {
  return (
    <IconPlayerPause
      className="cursor-pointer text-white mix-blend-overlay"
      onClick={onClick}
    />
  );
}

function SkipButton({ onClick }: { onClick: VoidFunction }) {
  return (
    <IconPlayerSkipForward
      className="cursor-pointer text-white mix-blend-overlay"
      onClick={onClick}
    />
  );
}

function Timer({ accumulated }: { accumulated: Date }) {
  return (
    <div className="col-span-2 pl-3 tabular-nums text-2xl text-white mix-blend-overlay">
      {format(accumulated, "mm:ss")}
    </div>
  );
}

function Pomodori({ pomodori }: { pomodori: null[] }) {
  return (
    <ul className="flex gap-1">
      {pomodori.map(() => (
        <li className="text-white mix-blend-overlay">•</li>
      ))}
    </ul>
  );
}

export default App;
