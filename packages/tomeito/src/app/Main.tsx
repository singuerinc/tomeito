import { useMachine } from "@xstate/react";
import { icons } from "feather-icons";
import React from "react";
import { createGlobalStyle } from "styled-components";
import { Machine } from "xstate";
import { Settings } from "./Settings";
import { Timer } from "./Timer";
import { Bell } from "../icons/Bell";

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
  }
`;

const stateMachine = Machine({
  initial: "timer",
  context: {},
  states: {
    timer: {
      on: {
        GO_SETTINGS: "settings"
      }
    },
    settings: {
      on: {
        EXIT: "timer"
      }
    }
  }
});

export function Main() {
  const [state, send] = useMachine(stateMachine);
  const goSettings = () => send("GO_SETTINGS");
  const goTimer = () => send("EXIT");
  return (
    <>
      <GlobalStyle />
      {state.matches("timer") && <Timer />}
      {state.matches("settings") && <Settings />}
      {state.matches("timer") && <Bell onClick={goSettings} />}
      {state.matches("settings") && <Bell onClick={goTimer} />}
    </>
  );
}
