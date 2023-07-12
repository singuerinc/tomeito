import { useCallback, useState } from "react";

export function usePomodori() {
  const [pomodori, setPomodori] = useState<null[]>([]);

  const addPomodoro = useCallback(() => {
    setPomodori((p) => [...p, null]);
  }, []);

  return { pomodori, addPomodoro };
}
