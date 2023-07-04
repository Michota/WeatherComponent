class Weather {
  async callAPI(APIKey, requestType = "current", location = "Warsaw") {
    const response = await fetch(
      `http://api.weatherapi.com/v1/${requestType}.json?key=${APIKey}&q=${location}`
    );
    if (response.ok !== true) {
      const { error } = await response.json();
      throw error;
    }
    const data = await response.json();
    return data;
  }
}

export default new Weather();
