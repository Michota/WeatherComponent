import {
  CELSIUS_OR_FAHRENHEIT as cOF,
  KILOMETERS_OR_MILES as kOM,
  WEATHER_API_KEY,
} from "./config.js";

WEATHER_API_KEY;
class Weather {
  async callAPI(
    location = "Warsaw",
    requestType = "current",
    APIKey = WEATHER_API_KEY
  ) {
    const response = await fetch(
      `http://api.weatherapi.com/v1/${requestType}.json?key=${APIKey}&q=${location}${
        requestType === "forecast" ? "&days=3" : ""
      }`
    );
    if (response.ok !== true) {
      const { error } = await response.json();
      throw error;
    }
    const data = await response.json();
    return data;
  }

  async addComponent(element, markup) {
    if (!markup) markup = this.generateMarkup();

    element.insertAdjacentHTML("afterbegin", await markup);
  }

  async generateMarkup(data = this.callAPI(undefined, "forecast")) {
    const fillTemplateWithData = async () => {
      data = await data;
      console.log(data);
      return `
    <div class="weather-component">
          <div class="w-top-part">
            <div class="w-current">
              <img class="w-icon" src="${data.current.condition.icon}" />
              <div class="w-c-text">
                <div class="w-degrees">${data.current.temp_c}</div>
                <div class="w-description">${data.current.condition.text}</div>
              </div>
            </div>
            <div class="w-details">
              <div class="wd-wind">Wind: ${
                data.current[`wind_${kOM}`]
              } ${kOM}</div>
              <div class="wd-pressure">Pressure: ${
                data.current.pressure_mb
              } mb</div>
              <div class="wd-humidity">Humidity: ${
                data.current.humidity
              } %</div>
            </div>
          </div>
          <div class="w-forecast">
            <div class="w-f-day wf-one">
              <div class="w-date">Tommorow (${this.convertApiDate(
                data.forecast.forecastday[1].date
              )})</div>
              <img class="w-icon" src="${
                data.forecast.forecastday[1].day.condition.icon
              }" />
              <div class="w-degrees">${
                data.forecast.forecastday[1].day[`avgtemp_${cOF}`]
              }</div>
            </div>
            <div class="w-f-day wf-two">
              <div class="w-date">${this.convertApiDate(
                data.forecast.forecastday[2].date
              )}</div>
              <img class="w-icon" src="${
                data.forecast.forecastday[2].day.condition.icon
              }" />
              <div class="w-degrees">${
                data.forecast.forecastday[2].day[`avgtemp_${cOF}`]
              }</div>
            </div>
          </div>
          <div class="w-location">${data.location.name}</div>
          <div class="w-copyright"
            >Powered by
            <a href="https://www.weatherapi.com/"> WeatherAPI.com</a>
          </div>
        </div>
    `;
    };
    return await fillTemplateWithData();
  }

  convertApiDate(apiDate) {
    const unix = Date.parse(apiDate);
    const newDate = new Date(unix).toLocaleDateString(undefined, {
      month: "2-digit",
      day: "2-digit",
    });
    return newDate;
  }
}

export default new Weather();
