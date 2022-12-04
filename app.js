const express = require("express");
const https = require("https"); //Making get request
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
})); //Makes it possible to recieve data from html form


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {

  const query = req.body.cityName;
  const apiKey = "564311e2d77ef76572e94d7f68832252";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
  https.get(url, function(response) {
    console.log(response.statusCode); //Checking if statusCode = 200 (code for OK)

    response.on("data", function(data) { //Fetching the data
      const weatherData = JSON.parse(data); //parsing the data to JSON format
      //console.log(weatherData); //logging the JSON data
      const temperature = Math.round(weatherData.main.temp); //To get the temperature I need to tap into the main first, and then I can get to the temp value
      const weatherDescription = weatherData.weather[0].description; //The weather object is an array with 1 item in it, therefor we need the 0th index
      const weatherIconName = weatherData.weather[0].icon; //Getting the name of the weatherIcon
      const iconUrl = "http://openweathermap.org/img/wn/" + weatherIconName + "@2x.png"
      res.write("<p>The weather is currently " + weatherDescription + "<p>");
      res.write("<h1>The temperature in " + query + " is: " + temperature + " degrees Celcius.</h1>");
      res.write("<img src=" + iconUrl + ">");
      res.send(); //We can only send once, but we can write as many times as we want. So here we write 3 times, and send when we are finish writing
    });
  });
});




app.listen(3000, function() {
  console.log("Server is running on port 3000.")
});
