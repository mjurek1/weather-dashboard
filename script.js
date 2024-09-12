const city = document.querySelector(".city");
const searchButton = document.querySelector(".search-btn");
const currentWeather = document.querySelector(".current-weather");
const forecastCards = document.querySelector(".forecast-cards");

const API_KEY = "9f42ae0bc80c68b5f45e59a1379a6d6c";

const createForecastCard = (cityName, weatherItem, index) => {
    if(index === 0) {
        return `<div class="details">
        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
        <h3>Temperature: ${Math.round((weatherItem.main.temp - 273.15) * 9/5 + 32)} F</h3>
        <h3>Wind: ${weatherItem.wind.speed} mph</h3>
        <h3>Humidity: ${weatherItem.main.humidity} %</h3> 
        </div>;`
    } else {
        return `<li class = "card"
        <h2>(${weatherItem.dt_txt.split(" ")[0]})</h2>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
        <h3>Temperature: ${Math.round((weatherItem.main.temp - 273.15) * 9/5 + 32)} F</h3>
        <h3>Wind: ${weatherItem.wind.speed} mph</h3>
        <h3>Humidity: ${weatherItem.main.humidity} %</h3> 
        </li>`; 
    }
}

const getWeatherInfo = (cityName, lat, lon) => {
    const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(API_URL).then(res => res.json()).then(data => {

        const forecastDay = [];
        const fiveDayForecast = data.list.filter(forecast => {
            const forecastData = new Date(forecast.dt_txt).getDate();
            if(!forecastDay.includes(forecastData)) {
                return forecastDay.push(forecastData);
            }
        });
        city.value = "";
        currentWeather.innerHTML = "";
        forecastCards.innerHTML = "";

        fiveDayForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeather.insertAdjacentHTML("beforeend", createForecastCard(cityName, weatherItem, index));
            } else {
                forecastCards.insertAdjacentHTML("beforeend", createForecastCard(cityName, weatherItem, index));
            }
        })
    });
    }

    const getCityCoords = () => {
        const cityName = city.value.trim();
        if(!cityName) return;
        const pikachu =  `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
        fetch(pikachu).then(res => res.json()).then(data => {
            if(!data.length) return alert(`couldn't find ${cityName}`);
        const {name, lat, lon} = data[0];
        getWeatherInfo(name, lat, lon);
        }).catch(() => {
            alert("unable to get coordinates");
        });
    }

    searchButton.addEventListener("click", getCityCoords);