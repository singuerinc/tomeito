import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipForward,
} from "@tabler/icons-react";
import { useMachine, useSelector } from "@xstate/react";
import format from "date-fns/format";
import { useCallback } from "react";
import { assign, createMachine } from "xstate";
import { useTimer } from "./useTimer";

const machine = createMachine(
  {
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
  const { add25, add5, accumulated, start, stop, pause } = useTimer();
  const [state, send, service] = useMachine(machine, {
    actions: { add25, add5, start, stop, pause },
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

  return (
    <div className="">
      {isIdle && (
        <IdleState accumulated={accumulated} handlePlay={handlePlay} />
      )}
      {isRunning && (
        <RunningState
          accumulated={accumulated}
          isResting={isResting}
          handlePause={handlePause}
          handleSkip={handleSkip}
        />
      )}
      {isPaused && (
        <PausedState accumulated={accumulated} handlePlay={handlePlay} />
      )}
    </div>
  );
}

function IdleState({
  handlePlay,
  accumulated,
}: {
  handlePlay: VoidFunction;
  accumulated: Date;
}) {
  return (
    <div className="grid grid-cols-10 h-12 items-center bg-[#57423F]">
      <Timer accumulated={accumulated} />
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
    <div className="col-span-4 pl-3 tabular-nums text-2xl text-white mix-blend-overlay">
      {format(accumulated, "mm:ss")}
    </div>
  );
}

export default App;
