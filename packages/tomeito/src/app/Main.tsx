import { useMachine } from "@xstate/react";
import { icons } from "feather-icons";
import React from "react";
import { createGlobalStyle } from "styled-components";
import { Machine } from "xstate";
import { Settings } from "./Settings";
import { Timer } from "./Timer";

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
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
      {state.matches("timer") && (
        <i onClick={goSettings} dangerouslySetInnerHTML={{ __html: icons["settings"].toSvg() }} />
      )}
      {state.matches("settings") && <i onClick={goTimer} dangerouslySetInnerHTML={{ __html: icons["x"].toSvg() }} />}
    </>
  );
}
