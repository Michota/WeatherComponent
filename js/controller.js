"use strict";
import weather from "./weather.js";
import Weather from "./weather.js";

const container = document.querySelector(".container");

const test = async function () {
  try {
    const result = await Weather.callAPI();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
};

weather.addComponent(container);

// const markup = weather.generateMarkup(await Weather.callAPI("Kielce"));
// container.insertAdjacentHTML("beforeend", markup);
