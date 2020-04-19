import React from "react";
import { render } from "react-dom";
import { Main } from "./app/Main";
window.addEventListener("DOMContentLoaded", () => {
  render(<Main />, document.getElementById("app"));
});
