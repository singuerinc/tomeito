import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipForward,
} from "@tabler/icons-react";
import format from "date-fns/format";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { usePomodori } from "./usePomodori";
import { usePomodoroTimer } from "./usePomodoroTimer";
import { useTimer } from "./useTimer";

function App() {
  const [taskTitle, setTaskTitle] = useState(
    localStorage.getItem("title") ?? "Untitled"
  );
  const setTitle = useCallback((value: string) => {
    setTaskTitle(value);
    localStorage.setItem("title", value);
  }, []);

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
        >
          <TaskTitle title={taskTitle} setTitle={setTitle} />
        </RunningState>
      )}
      {isPaused && (
        <PausedState
          key="paused"
          accumulated={accumulated}
          handlePlay={handlePlay}
        >
          <TaskTitle title={taskTitle} setTitle={setTitle} />
        </PausedState>
      )}
    </>
  );
}

const IdleState: React.FC<
  PropsWithChildren<{
    handlePlay: VoidFunction;
    accumulated: Date;
    pomodori: null[];
  }>
> = ({ handlePlay, accumulated, pomodori }) => {
  return (
    <div className="grid grid-cols-10 h-12 items-center bg-[#57423F]">
      <Timer accumulated={accumulated} />
      <Pomodori pomodori={pomodori} />
      <div className="col-start-10">
        <PlayButton onClick={handlePlay} />
      </div>
    </div>
  );
};

const RunningState: React.FC<
  PropsWithChildren<{
    isResting: boolean;
    handlePause: VoidFunction;
    handleSkip: VoidFunction;
    accumulated: Date;
  }>
> = ({ isResting, handlePause, handleSkip, accumulated, children }) => {
  return (
    <div
      className={`grid grid-cols-10 h-12 items-center ${
        isResting ? "bg-[#5C9C00]" : "bg-[#FF4545]"
      }`}
    >
      <Timer accumulated={accumulated} />
      {!isResting && children}
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
};

const PausedState: React.FC<
  PropsWithChildren<{
    handlePlay: VoidFunction;
    accumulated: Date;
  }>
> = ({ handlePlay, accumulated, children }) => {
  return (
    <div className="grid grid-cols-10 h-12 items-center bg-[#BFA6A2]">
      <Timer accumulated={accumulated} />
      {children}
      <div className="col-start-10 col-span-2 grid grid-cols-2">
        <PlayButton onClick={handlePlay} />
      </div>
    </div>
  );
};

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

function TaskTitle({
  title,
  setTitle,
}: {
  title: string;
  setTitle: (value: string) => void;
}) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
    [setTitle]
  );
  return (
    <input
      className="text-white mix-blend-overlay text-2xl col-span-5 border-0 bg-transparent"
      value={title}
      onChange={handleChange}
    />
  );
}

export default App;
