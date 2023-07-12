import { useMachine, useSelector } from "@xstate/react";
import { assign, createMachine } from "xstate";
import {
  IconPlayerSkipForward,
  IconPlayerPlay,
  IconPlayerPause,
} from "@tabler/icons-react";
import { useCallback } from "react";

const machine = createMachine(
  {
    initial: "idle",
    context: {
      mode: "TOMATO",
    },
    states: {
      idle: {
        on: {
          PLAY: [{ target: "running" }],
        },
      },
      running: {
        on: {
          PAUSE: [{ target: "paused" }],
          SKIP: [
            { target: "idle", cond: "isResting", actions: ["setAsTomato"] },
            { actions: ["setAsResting"] },
          ],
        },
      },
      paused: {
        on: {
          PLAY: [{ target: "running" }],
          SKIP: [
            // { target: "idle", cond: "isResting", actions: ["setAsTomato"] },
            { target: "idle", actions: ["setAsResting"] },
          ],
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
  const [state, send, service] = useMachine(machine);
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
      {isIdle && <IdleState handlePlay={handlePlay} />}
      {isRunning && (
        <RunningState
          isResting={isResting}
          handlePause={handlePause}
          handleSkip={handleSkip}
        />
      )}
      {isPaused && (
        <PausedState handlePlay={handlePlay} handleSkip={handleSkip} />
      )}
    </div>
  );
}

function IdleState({ handlePlay }: { handlePlay: VoidFunction }) {
  return (
    <div className="grid grid-cols-10 h-12 items-center bg-[#57423F]">
      <Timer />
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
}: {
  isResting: boolean;
  handlePause: VoidFunction;
  handleSkip: VoidFunction;
}) {
  return (
    <div
      className={`grid grid-cols-10 h-12 items-center ${
        isResting ? "bg-[#5C9C00]" : "bg-[#FF4545]"
      }`}
    >
      {/* {isResting ? <span>resting</span> : <span>tomato</span>} */}
      <Timer />
      <div className="col-start-9 col-span-2 grid grid-cols-2">
        <PauseButton onClick={handlePause} />
        <SkipButton onClick={handleSkip} />
      </div>
    </div>
  );
}

function PausedState({
  handlePlay,
  handleSkip,
}: {
  handlePlay: VoidFunction;
  handleSkip: VoidFunction;
}) {
  return (
    <div className="grid grid-cols-10 h-12 items-center bg-[#BFA6A2]">
      <Timer />
      <div className="col-start-9 col-span-2 grid grid-cols-2">
        <PlayButton onClick={handlePlay} />
        <SkipButton onClick={handleSkip} />
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

function Timer() {
  return (
    <div className="col-span-4 pl-3 tabular-nums text-2xl text-white mix-blend-overlay">
      25:00
    </div>
  );
}

export default App;
