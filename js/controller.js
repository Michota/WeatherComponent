"use strict";
import weather from "./weather.js";

try {
  const container = document.querySelector(".container");
  // const component = weather.addComponent(container, [50.8690432, 20.64384]);
  weather.start(container);
} catch (err) {
  console.log(err);
}

// const markup = weather.generateMarkup(await Weather.callAPI("Kielce"));
// container.insertAdjacentHTML("beforeend", markup);
