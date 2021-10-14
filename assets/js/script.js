const searchHistoryUL = document.getElementById('searchHistoryUL');
const searchDIV = document.getElementById('searchDIV')
const searchForm = document.getElementById('searchForm')
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const locationName = document.getElementById('locationName');
const weatherDIV = document.getElementById('weatherDIV')
const forecastDIV = document.getElementById('forecastDIV');
const todaysDate = document.getElementById('todaysDate')
const currentTemp = document.getElementById('currentTemp');
const currentIcon = document.getElementById('currentIcon');
const currentWind = document.getElementById('currentWind');
const currentHumidity = document.getElementById('currentHumidity');
const currentUV = document.getElementById('currentUV');

const today = moment();

let searchItems = [];
const maxHistoryItems = 5;

function initLocalStorage(){
    if (localStorage.getItem('storedSearches')){
        searchItems = JSON.parse(localStorage.getItem('storedSearches'));
        for (let x = 0; x < searchItems.length; x++) {
            createStorageNodes(searchItems);
        }
    }
}

function createStorageNodes(items) {
    searchHistoryUL.innerHTML = '';
    for (let x = 0; x < items.length; x++){
        const newEl = document.createElement('li');
        newEl.classList = "searchItem btn-info";
        newEl.textContent = items[x];
        searchHistoryUL.appendChild(newEl);
    }
    searchInput.value = '';
};


searchForm.addEventListener('submit', function(e) {
    searchDIV.classList = "";
    weatherDIV.style.display = 'block';
    e.preventDefault();
    const input = searchInput.value;
    if(input.length > 0) {
        currentWeather(input);
        searchItems.unshift(input);
        if(searchItems.length > maxHistoryItems) {
            searchItems.pop();
        }
        createStorageNodes(searchItems);
        searchButton.blur();
        localStorage.setItem('storedSearches', JSON.stringify(searchItems));
    }
})

searchHistoryUL.addEventListener('click', function(e) {
    if (e.target.matches('.searchItem')) {
        e.preventDefault();
        searchInput.value = e.target.textContent;
        searchButton.click();
    }
})

function currentWeather(location) {
    const apiKey = '1a306f57eaa04b66a65190330210107';
    const requestURL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}}&aqi=no`;
    fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (weather) {
        const longitude = weather.location.lon;
        const latitude = weather.location.lat;
    
        locationName.textContent = weather.location.name + 
        ', ' + weather.location.region;

        todaysDate.textContent = today.format('MM/DD/YYYY');

        currentHumidity.textContent = weather.current.humidity;

        currentWind.textContent = weather.current.wind_mph;

        currentTemp.textContent = weather.current.temp_f;

        UVColor(weather.current.uv);

        currentIcon.src = "http:" + weather.current.condition.icon;

        console.log(weather)

        getForecast(latitude, longitude);
        });
}

function UVColor(index) {
    let color = '';
    if(index <= 2) {
        color = "green";
    } else if (index <= 5) {
        color = 'yellow';
    } else if (index <= 7) {
        color = 'orange';
    } else if (index <= 10) {
        color = 'red'
    } else {
        color = 'violet'
    }
    currentUV.style.backgroundColor = color;
    currentUV.textContent = index;
}

function getForecast(lat, lon) {
    const apiKey = '9eb115b75f669676b72125c5e2e7859a';
    const requestURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=imperial`;
    forecastUL.innerHTML = '';
    fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        console.log(data);
            for(var x = 0; x < 5; x++){
                const forecastDay = data.daily[x];
                const newCard = document.createElement('div');
                const img = document.createElement('img');
                let newEl = document.createElement('h4');
                newCard.className = "forecastDay dayCard";
                forecastUL.appendChild(newCard);
                
                newEl.textContent = moment.unix(forecastDay.dt).format('ll');
                newEl.classList = 'text-center'
                newCard.appendChild(newEl);

                newEl = document.createElement('div');
                newEl.classList="mx-auto bg-white border rounded mb-2";
                newCard.appendChild(newEl);
                
                img.classList = 'mx-auto d-block'
                img.src = `https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}.png`;
                newEl.appendChild(img);

                newEl = document.createElement('p');
                newEl.textContent = `Humidity: ${forecastDay.humidity}%`
                newCard.appendChild(newEl);

                newEl = document.createElement('p');
                newEl.textContent = `Wind: ${forecastDay.wind_speed} MPH.`
                newCard.appendChild(newEl);

                newEl = document.createElement('p');
                newEl.textContent = `Temp: ${Math.floor(forecastDay.temp.max)} / ${Math.floor(forecastDay.temp.min)}`;
                newCard.appendChild(newEl);
            }
        });

}

initLocalStorage();