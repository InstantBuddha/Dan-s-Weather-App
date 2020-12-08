//global variables
var yourLatitude = 0;
var yourLongitude = 0;
const urlFirstPart = "https://weather-proxy.freecodecamp.rocks/api/current?lat=";
const urlSecondPart = "&lon=";
var celsiusDisplayed = true;

//object constructors
function MyLocation(myLat, myLong) {
  this.myLat = myLat;
  this.myLong = myLong;
}

function LocalWeather(city, temperature, main, description, icon) {
  this.city = city;
  this.temperature = temperature;
  this.main = main;
  this.tempInFahrenheit = (temperature * 9 / 5) + 32;
  this.description = description;
  this.icon = icon;
  this.temperatureWithLink = function(isCelsiusDisplayed) {
    return isCelsiusDisplayed ?
      `${this.temperature.toFixed(1)} <a id="cLink" href="#" onclick="fcSwitch();return false;"> °C</a>`

      :

      `${this.tempInFahrenheit.toFixed(1)} <a id="cLink" href="#" onclick="fcSwitch();return false;"> °F</a>`
  };
}

//event listeners:
$("#reload-geo-btn").click(() => {
  getLocation();
});
$("#reload-weather-btn").click(() => {
  apiStarter();
});
$("#fc-switch-btn").click(() => {
  fcSwitch();
});

//functions:

function getLocation() {
  $("#descriptionH2").html("Please allow geolocation to get your local weather");
  navigator.geolocation ? navigator.geolocation.getCurrentPosition(locationSaver) : geoProblem();

}

function locationSaver(locationInput) {
  myLocationData.myLat = locationInput.coords.latitude;
  myLocationData.myLong = locationInput.coords.longitude;
  $("#descriptionH2").html("You are at " + myLocationData.myLat + " latitude and " + myLocationData.myLong + " longitude.");
  apiStarter();
}

function geoProblem() {
  console.log("Geolocation problem");
  $("#descriptionH2").html("There seems to be a geolocation problem");
}

function apiStarter() {
  $("#descriptionH2").html("Downloading weather data");
  let fullUrl = urlFirstPart + myLocationData.myLat + urlSecondPart + myLocationData.myLong;
  $.getJSON(fullUrl, function(data) {
    console.log(data);
    localWeatherNow = new LocalWeather(
      data.name,
      data.main.temp,
      data.weather[0].main,
      data.weather[0].description,
      data.weather[0].icon);

    console.log(localWeatherNow);
    weatherDisplay(localWeatherNow);
  });

}

function weatherDisplay(localWeatherObject) {
  console.log("weatherDisplay");
  $("#weatherPic").attr("src", localWeatherObject.icon);

  $("#temperatureH2").html(localWeatherObject.temperatureWithLink(celsiusDisplayed));

  $("#descriptionH2").html("In " + localWeatherObject.city + " the weather frog can see " + localWeatherObject.description);
}

function fcSwitch() {
  celsiusDisplayed = !celsiusDisplayed;
  console.log(celsiusDisplayed);
  weatherDisplay(localWeatherNow);
}


//and it all begins
var myLocationData = new MyLocation(0, 0);
console.log("started");
var localWeatherNow; //kiszedni
console.log(`initial ${localWeatherNow}`)

getLocation();
