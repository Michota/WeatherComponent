"use strict";
import weather from "./weather.js";

try {
  const container = document.querySelector(".container");
  // const component = weather.addComponent(container, [50.8690432, 20.64384]);
  weather.start(container, "Kielce");
} catch (err) {
  console.log(err);
}
