let id = '7288c7df54d919481b71850d6d47349e';
let weatherURL = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + id;

let city = document.querySelector('.name');
let form = document.querySelector("form");
let temperature = document.querySelector('.temperature');
let description = document.querySelector('.description');
let valueSearch = document.getElementById('name');
let clouds = document.getElementById('clouds');
let humidity = document.getElementById('humidity');
let pressure = document.getElementById('pressure');
let main = document.querySelector('main');

form.addEventListener("submit", (e) => {
    e.preventDefault();  
    if(valueSearch.value.trim() !== ''){
        searchWeatherByCity(valueSearch.value.trim());
    }
});

// Search by city name
const searchWeatherByCity = (cityName) => {
    fetch(weatherURL + '&q=' + cityName)
        .then(response => response.json())
        .then(data => {
            updateUI(data);
        })
        .catch(() => showError());
    valueSearch.value = '';
};

// Search by geographic coordinates
const searchWeatherByCoords = (lat, lon) => {
    fetch(weatherURL + `&lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            updateUI(data);
        })
        .catch(() => showError());
};

// Update the UI with weather data
const updateUI = (data) => {
    if (data.cod == 200) {
        city.querySelector('figcaption').innerHTML = data.name;
        city.querySelector('img').src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
        temperature.querySelector('img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
        temperature.querySelector('span').innerText = Math.round(data.main.temp);
        description.innerText = data.weather[0].description;

        clouds.innerText = data.clouds.all;
        humidity.innerText = data.main.humidity;
        pressure.innerText = data.main.pressure;
    } else {
        showError();
    }
};

// Show error animation
const showError = () => {
    main.classList.add('error');
    setTimeout(() => {
        main.classList.remove('error');
    }, 1000);
};

// Initialize app with geolocation or fallback
const initApp = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                searchWeatherByCoords(lat, lon);
            },
            () => {
                // If permission denied, fallback to default city
                searchWeatherByCity('Washington');
            }
        );
    } else {
        // If geolocation not supported
        searchWeatherByCity('Washington');
    }
};

initApp();
