var apiKey = "d1e2d0763204896fd894698f5c6e27ee";
var today = moment().format('L');
var historyList = [];

function currentWeather(cityname) {

    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(weatherResponse) {
        console.log(weatherResponse);

        $("#weatherContent").css("display", "block");
        $("#cityDetail").empty();
        
        
        var image = weatherResponse.weather[0].icon;
        var imageURL = `https://openweathermap.org/img/w/${image}.png`;

        
        var citySearched = $(`
            <h2 id="citySearched">
                ${weatherResponse.name} ${today} <img src="${imageURL}" alt="${weatherResponse.weather[0].description}" />
            </h2>
            <p>Temperature: ${weatherResponse.main.temp} °F</p>
            <p>Humidity: ${weatherResponse.main.humidity}\%</p>
            <p>Wind: ${weatherResponse.wind.speed} MPH</p>
        `);

        $("#weather-container").append(citySearched);
        
//Will need latitude and longitud in next function.  Break up into 2 functions to make it easier to understand
        var lat = weatherResponse.coord.lat;
        var lon = weatherResponse.coord.lon;

            futureCondition(lat, lon);
        }); 
    };


function futureCondition(lat, lon) {

    var forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
    

    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function(forecastResponse) {
        console.log(forecastResponse);
        $("#fiveDay").empty();
        
        for (let i = 1; i < 6; i++) {
            var cityInfo = {
                date: forecastResponse.daily[i].dt,
                icon: forecastResponse.daily[i].weather[0].icon,
                temp: forecastResponse.daily[i].temp.day,
                humidity: forecastResponse.daily[i].humidity,
                wind: forecastResponse.daily[i].wind_speed
            };

            var currDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
            var imageURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${forecastResponse.daily[i].weather[0].main}" />`;

            var futureCard = $(`
                <div class="pl-3">
                    <div class="card pl-3 pt-3 mb-3 bg-primary text-light d-flex flex-row" style="width: 12rem;>
                        <div class="row">
                            <h3>${currDate}</h3>
                            <p>Tempeture: ${cityInfo.temp} °F</p>
                            <p>Humidity: ${cityInfo.humidity}\%</p>
                            <p>Wind: ${cityInfo.wind} MPH</p>
                        </div>
                    </div>
                <div>
            `);

            $("#fiveDay").append(futureCard);
        }
    }); 
}



$("#search").on("click", function(event) {
    event.preventDefault();

    var cityname = $("#city").val().trim();
    currentWeather(cityname);
    if (!historyList.includes(cityname)) {
        historyList.push(cityname);
        var searchedCity = $(`
            <li class="list-group-item">${cityname}</li>
            `);
        $("#searchHistory").append(searchedCity);
    };
    
    localStorage.setItem("city", JSON.stringify(historyList));
    console.log(historyList);
});


$(document).on("click", ".list-group-item", function() {
    var listCity = $(this).text();
    currentWeather(listCity);
});


$(document).ready(function() {
    var searchHistoryArr = JSON.parse(localStorage.getItem("city"));

    if (searchHistoryArr !== null) {
        var lastSearchedIndex = searchHistoryArr.length - 1;
        var lastSearchedCity = searchHistoryArr[lastSearchedIndex];
        currentWeather(lastSearchedCity);
        console.log(`Last searched city: ${lastSearchedCity}`);
    }
});