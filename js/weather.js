import {
  CELSIUS_OR_FAHRENHEIT as cOF,
  KILOMETERS_OR_MILES as kOM,
  WEATHER_API_KEY,
} from "./config.js";

class Weather {
  _data;
  _componentElement;
  _parentElement;
  _weatherNow;

  async _callAPI(
    location = "Warsaw",
    requestType = "forecast",
    APIKey = WEATHER_API_KEY
  ) {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/${requestType}.json?key=${APIKey}&q=${location}${
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
    } catch (err) {
      throw err;
    }
  }

  async _addComponent(parentElement = this._parentElement, location) {
    let markup;
    if (!location) {
      markup = this._generateMarkup();
    } else {
      markup = this._generateMarkup(location);
    }
    parentElement.insertAdjacentHTML("afterbegin", await markup);
    const componentEl = parentElement.querySelector(".weather-component");
    componentEl.addEventListener(
      "click",
      function (e) {
        this._clickToShrink(e);
      }.bind(this)
    );
  }

  async _generateMarkup(location) {
    let data = this._callAPI(location);
    const fillTemplateWithData = async () => {
      data = await data;
      return `
    <div class="weather-component" data-bg="${await this._getCode(
      data.current.condition.code,
      data.current.is_day
    )}">
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

  _clickToShrink(e = this._componentElement) {
    if (e !== this._componentElement) {
      this._componentElement = e.target.closest(".weather-component");
    }
    this._componentElement.classList.toggle("mini");
  }

  async _getCode(code, isDay) {
    const allCodes = await fetch("./js/weather_conditions.json");
    const data = await allCodes.json();
    const codeObject = data.filter((el) => el.code === code)[0];
    return isDay ? codeObject.day : codeObject.night;
  }

  async start(parentElement, customLocation) {
    try {
      this._parentElement = parentElement;

      function success(pos) {
        const crd = pos.coords;
        const { latitude, longitude } = crd;
        this._addComponent(this._parentElement, [latitude, longitude]);
      }

      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        throw err;
      }

      if (customLocation !== undefined) {
        this._addComponent(this._parentElement, customLocation);
      } else {
        const options = {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0,
        };
        navigator.geolocation.getCurrentPosition(
          success.bind(this),
          error,
          options
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default new Weather();
