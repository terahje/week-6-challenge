$(document).ready(function() {
    var APIKey = "c3dc07b6ca30d039abcea5db3779f996"

    var userCity;
    var cityName;
    var date;
    var weather;
    var weatherIcon;
    var imgUrl;
    var allCities;
    var cityBtn;

if ($(window).width() < 700) {
    $("aside").removeClass("col-3 d-block sidebar sidebar-sticky");
    $("aside").addClass("row full-width");
    $("#search-text").addClass("mobile-text");
    $(".cities").addClass("d-none");
}

$("#search-button").click(function(event) {
    event.preventDefault();

    // get user input
    userCity = $("#search").val();

    if(userCity !== "") {
        init();
        getCurrentWeather();
        getForecast();
    }
});

function init() {
    // clear input text after input
    $("#search").val("");

    // display current date under city
    var currentDate = moment().format("LL");
    var currentDateEl = $('.date[data-day="0"]');
    currentDateEl.text(currentDate);

    // show the weather in main container
    $("#weather-info").removeClass("d-none");

    // remove welcome screen
    $("#welcome").addClass("d-none");
}

function getCurrentWeather() {
    var queryUrl = 
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      userCity +
      "&appid=" +
      APIKey;

      $.ajax({
          url: queryUrl,
          method: "GET",
      }).then(function(response) {
          // display citi name
          cityName = response.name;
          cityNameEl = $("#city-name").text(cityName);
          $(".heading").prepend(cityNameEl);

          storeCity();

          // determine icon to display
          weather = response.weather[0].main;
          $("#weather-icon").html("");
          renderIcons();
          weatherIcon = $("<img>").attr("src", imgUrl);
          weatherIcon.attr("alt", "weather icon");
          $("#weather-icon").append(weatherIcon);

          // display temp
          var tempK = response.main.temp;
          var tempF = (tempK - 273.15) * 1.8 +32;
          $("#current-temp").html(
              "Temperature: " + tempF.toFixed(1) + " &deg;" + "F"
          );

          // display humidity
          var humidity = response.main.humidity;
          $("#current-humidity").html("Humidity: " + humidity + "%");

          // display wind speed
          var wind = response.wind.speed;
          $("#current-wind").html("Wind Speed: " + wind + " MPH");

          // display UV index
          displayUVI(response.coord.lat, response.coord.lon);
      });
}

function storeCity() {
    allCities = JSON.parse(localStorage.getItem("cities"));
    if(allCities === null) {
        allCities = [];
    } else {
        for (i = 0; i < allCities.length; i++) {
            if (userCity === allCities[i]) {
                return false;
            }
        }
    }

    allCities.push(cityName);
    localStorage.setItem("cities", JSON.stringify(allCities));

    cityBtn = $("<button>").addClass(
        "list-group-item list-group-item-action city-select"
    );
    cityBtn.text(cityName);
    $(".cities").append(cityBtn);

    cityBtns = $(".city-select");
}

function displayUVI(lat, lon) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/uvi?appid=" +
      APIKey +
      "&lat=" +
      lat +
      "&lon=" +
      lon;

      $.ajax({
          url: queryURL,
          method: "GET",
      }).then(function(response) {
          var uvEl = $("<button>");
          renderUVColor(response.value, uvEl);
          uvEl.text(response.value);
          uvEl.attr("disabled", "disabled");

          $("#current-uv").text("UV Index :");
          $("#current-uv").append(uvEl);
      });
}

function renderUVColor(uv, uvEl) {
    if (uv >= 0 && uv <= 2) {
        uvEl.addClass("btn btn-sm ml-2 low");
    } else if (uv > 2 && uv <= 5) {
        uvEl.addClass("btn btn-sm ml-2 moderate");
    } else if (uv > 2 && uv <= 7) {
        uvEl.addClass("btn btn-sm ml-2 high");
    } else {
        uvEl.addClass("btn btn-sm ml-2 extreme");
    }
}

function renderIcons() {
    var stormIcon = "11d";
    var drizzleIcon = "09d";
    var rainIcon = "10d";
    var snowIcon = "13d";
    var atmosphereIcon = "50d";
    var clearIcon = "01d";
    var cloudIcon = "02d";

    if (weather === "Thunderstorm") {
        icon = stormIcon;
    } else if (weather === "Drizzle") {
        icon = drizzleIcon;
    } else if (weather === "Rain") {
        icon = rainIcon;
    } else if (weather === "Snow") {
        icon = snowIcon;
    } else if (weather === "Clear") {
        icon = clearIcon;
    } else if (weather === "Clouds") {
        icon = cloudIcon;
    } else {
        icon = atmosphereIcon;
    }

    imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
}



});