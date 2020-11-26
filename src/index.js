import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import brain from "brain.js";

import { training_data } from "./trainingData";
import "./styles.css";

function App() {
  // initialize with color
  useEffect(() => onBgColorChange({ target: { value: "#708D81" } }), []);

  return (
    <div className="App">
      <input id="color-picker" type="color" onChange={onBgColorChange} />
      <div id="text">Semi-Smart Text</div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

// Brain logic
function getRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const formattedHex = hex.replace(
    shorthandRegex,
    (m, r, g, b) => r + r + g + g + b + b
  );
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
  return result
    ? {
        r: Math.round(parseInt(result[1], 16) / 2.55) / 100,
        g: Math.round(parseInt(result[2], 16) / 2.55) / 100,
        b: Math.round(parseInt(result[3], 16) / 2.55) / 100
      }
    : null;
}

function onBgColorChange(evt) {
  const text = document.querySelector("#text");
  const {
    target: { value: inputHex }
  } = evt;
  const rgb = getRgb(inputHex);
  const network = new brain.NeuralNetwork();

  network.train(training_data);
  // is the background color `dark` or `light`
  const result = brain.likely(rgb, network);
  // update ui
  text.style.background = inputHex;
  text.style.color = result === "dark" ? "white" : "black";
}
