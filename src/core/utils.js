const {
  get
} = require('axios');

module.exports = class Utils {
  constructor(client) {
    this.client = client;
  }
  chunkify(input) {
    if (input.length <= 5) return [input];

    const result = [];
    var lastIndex = 0;
    for (var i = 5; i <= input.length; i = i + 5) {
      result.push(input.slice(lastIndex, i));
      lastIndex = i;
      if (lastIndex + 5 >= input.length) {
        result.push(input.slice(lastIndex, input.length));
        break;
      }
    }
    return result;
  }
  
  async weather(city) {
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appId=${process.env.WEATHER_API_KEY}&units=metric`;
    const result = await get(endpoint).then(res => (res.data)).catch(err => (err))
    if (result.cod != '200') return null;
    const temp = Math.round(result.main.temp),
      weather = result.weather[0].main,
      humidity = result.main.humidity,
      wind = result.wind.speed,
      name = result.name,
      pressure = result.main.pressure,
      icon = result.weather[0].icon
    return {
      temp,
      weather,
      wind,
      humidity,
      name,
      pressure,
      icon
    }
  }
};