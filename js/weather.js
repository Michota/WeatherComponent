import {
  CELSIUS_OR_FAHRENHEIT as cOF,
  KILOMETERS_OR_MILES as kOM,
  WEATHER_API_KEY,
} from "./config.js";

WEATHER_API_KEY;
class Weather {
  _data;

  async _callAPI(
    location = "Warsaw",
    requestType = "forecast",
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
    this._data = data;
    return data;
  }

  async _addComponent(parentElement, location) {
    let markup;
    if (!location) {
      markup = this._generateMarkup();
    } else {
      markup = this._generateMarkup(location);
    }
    parentElement.insertAdjacentHTML("afterbegin", await markup);
    const componentEl = parentElement.querySelector(".weather-component");
    this.clickToShrink(componentEl);
    return componentEl;
    // TODO: toggle "mini" class on click
  }

  // async _generateMarkup(data = this._callAPI(undefined)) {
  async _generateMarkup(location) {
    let data = this._callAPI(location);
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
              <div class="wd-wind">Wind: ${Math.floor(
                data.current[`wind_${kOM}`]
              )} ${kOM}</div>
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
              <div class="w-date">Tommorow (${this._convertApiDate(
                data.forecast.forecastday[1].date
              )})</div>
              <img class="w-icon" src="${
                data.forecast.forecastday[1].day.condition.icon
              }" />
              <div class="w-degrees">${Math.floor(
                data.forecast.forecastday[1].day[`avgtemp_${cOF}`]
              )}</div>
            </div>
            <div class="w-f-day wf-two">
              <div class="w-date">${this._convertApiDate(
                data.forecast.forecastday[2].date
              )}</div>
              <img class="w-icon" src="${
                data.forecast.forecastday[2].day.condition.icon
              }" />
              <div class="w-degrees">${Math.floor(
                data.forecast.forecastday[2].day[`avgtemp_${cOF}`]
              )}</div>
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

  _convertApiDate(apiDate) {
    const unix = Date.parse(apiDate);
    const newDate = new Date(unix).toLocaleDateString(undefined, {
      month: "2-digit",
      day: "2-digit",
    });
    return newDate;
  }

  clickToShrink(componentEl) {
    componentEl.addEventListener("click", function (e) {
      const allTheComponent = e.target.closest(".weather-component");
      allTheComponent.classList.toggle("mini");
    });
  }

  async start(parentElement) {
    try {
      const options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      };

      function success(pos) {
        const crd = pos.coords;
        console.log(crd);
        const { latitude, longitude } = crd;
        this._addComponent(parentElement, [latitude, longitude]);
      }

      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        throw err;
      }

      navigator.geolocation.getCurrentPosition(
        success.bind(this),
        error,
        options
      );
    } catch (err) {
      console.error(err);
    }
  }
}

export default new Weather();
