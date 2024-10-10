const searchInput = document.querySelector(".searchInput");
const locationButton = document.querySelector(".locationButton");
const currentWeatherDiv = document.querySelector(".currentWeather");
const hourlyWeatherDiv = document.querySelector(".hourlyWeather .weatherList");
const weatherSectionDiv = document.querySelector(".weatherSection");
const noResultsDiv = document.querySelector(".noResults");

const API_KEY = "f49300747ffb4ac1b53100814240910";

const displayHourlyForecast = (hourData) => {
  const currentHour = new Date().setMinutes(0, 0, 0);
  const next24Hours = currentHour + 24 * 60 * 60 * 1000;
  const next24HoursData = hourData.filter(({ time }) => {
    const forecastTime = new Date(time).getTime();
    return forecastTime >= currentHour && forecastTime <= next24Hours;
  });
  hourlyWeatherDiv.innerHTML = next24HoursData
    .map((i) => {
      const temperature = Math.floor(i.temp_c);
      const time = i.time.split(" ")[1].substring(0, 5);
      const imageUrl = i.condition.icon;

      return `<li class="weatherItem">
              <p class="time">${time}</p>
              <img src="${imageUrl}" class="weatherIcon" />
              <p class="temperature">${temperature}°C</p>
            </li>`;
    })
    .join("");
};

const getWeatherDetails = async (API_URL) => {
  window.innerWidth <= 768 && searchInput.blur();
  noResultsDiv.style.visibility = "hidden";
  weatherSectionDiv.style.visibility = "visible";
  // document.body.classList.remove("showNoResults");
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
    searchInput.value = data.location.name;
  } catch (error) {
    // document.body.classList.add("showNoResults");
    noResultsDiv.style.visibility = "visible";
    weatherSectionDiv.style.visibility = "hidden";
    console.log(error);
  }
};
const setupWeatherRequest = (cityName) => {
  const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=2`;
  getWeatherDetails(API_URL);
};

searchInput.addEventListener("keyup", (e) => {
  const cityName = searchInput.value.trim();
  if (e.key === "Enter" && cityName) {
    setupWeatherRequest(cityName);
  }
});

locationButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=2`;
      getWeatherDetails(API_URL);
    },
    (error) => {
      console.log(error.message);
    }
  );
});

setupWeatherRequest("New Delhi");
