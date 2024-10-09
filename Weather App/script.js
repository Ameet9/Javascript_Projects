const searchInput = document.querySelector(".searchInput");
const currentWeatherDiv = document.querySelector(".currentWeather");

const API_KEY = "f49300747ffb4ac1b53100814240910";

const displayHourlyForecast = (hourData) => {
  const currentHour = new Date().setMinutes(0, 0, 0);
  const next24Hours = currentHour + 24 * 60 * 60 * 1000;
  const next24HoursData = hourData.filter(({ time }) => {
    const forecastTime = new Date(time).getTime();
    return forecastTime >= currentHour && forecastTime <= next24Hours;
  });
  console.log(next24HoursData);
  const hourlyWeatherHTML = next24HoursData
    .map((i) => {
      const temperature = Math.floor(i.temp_c);
      const time = i.time;
      const imageUrl = i.condition.icon;

      return `<li class="weatherItem">
              <p class="time">${time}</p>
              <img src="${imageUrl}" class="weatherIcon" />
              <p class="temperature">${temperature}°C</p>
            </li>`;
    })
    .join("");
};

const getWeatherDetails = async (cityName) => {
  const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=2`;
  try {
    const resp = await fetch(API_URL);
    const data = await resp.json();
    const temperature = Math.floor(data.current.temp_c);
    const description = data.current.condition.text;
    const imageUrl = data.current.condition.icon;
    currentWeatherDiv.querySelector(
      ".temperature"
    ).innerHTML = `${temperature}<span>°C</span>`;
    currentWeatherDiv.querySelector(".description").innerText = description;
    currentWeatherDiv.querySelector(".weatherIcon").src = imageUrl;
    const combinedHourlyData = [
      ...data.forecast.forecastday[0].hour,
      ...data.forecast.forecastday[1].hour,
    ];
    displayHourlyForecast(combinedHourlyData);
  } catch (error) {
    console.log(error);
  }
};
searchInput.addEventListener("keyup", (e) => {
  const cityName = searchInput.value.trim();
  if (e.key === "Enter" && cityName) {
    getWeatherDetails(cityName);
  }
});
