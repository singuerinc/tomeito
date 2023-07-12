import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipForward,
} from "@tabler/icons-react";
import format from "date-fns/format";
import { usePomodori } from "./usePomodori";
import { usePomodoroTimer } from "./usePomodoroTimer";
import { useTimer } from "./useTimer";
import { useEffect } from "react";

function App() {
  const { addPomodoro, pomodori } = usePomodori();
  const { add25, add5, accumulated, start, stop, pause, emitter } = useTimer();
  const {
    isIdle,
    isResting,
    isPaused,
    isRunning,
    handlePause,
    handlePlay,
    handleSkip,
    handleCompleted,
  } = usePomodoroTimer({
    addPomodoro,
    add25,
    add5,
    start,
    stop,
    pause,
  });

  useEffect(() => {
    emitter.on("completed", handleCompleted);
    return () => emitter.off("completed");
  }, [emitter, handleCompleted]);

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
