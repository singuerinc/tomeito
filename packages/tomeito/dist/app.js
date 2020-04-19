"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const Main_1 = require("./app/Main");
window.addEventListener("DOMContentLoaded", () => {
    react_dom_1.render(React.createElement(Main_1.Main, null), document.getElementById("app"));
});
