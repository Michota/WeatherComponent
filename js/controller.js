"use strict";
import { WEATHER_API_KEY } from "./config.js";
import Weather from "./weather.js";

const test = async function () {
  try {
    const result = await Weather.callAPI(WEATHER_API_KEY);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
};

test();
