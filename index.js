const { log } = require("console");
const express = require("express") ;
const app = express() ;
const https = require("https") ;
const bodyParser = require("body-parser") ;
app.use(bodyParser.urlencoded({extended: true})) ;

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html") ;
});

app.post("/",function(req,res){
    const query = req.body.cityName ;
    const geourl = "https://api.openweathermap.org/geo/1.0/direct?q="+query+"&limit=1&appid=26c2f2ca7b398d6e62d7ee40ea5f46c4&units=metric" ;
    https.get(geourl,function(response){
        response.on("data",function(data){
            const geoData = JSON.parse(data) ;
            lat =  geoData[0].lat ;
            lon =  geoData[0].lon ;
            const url = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid=26c2f2ca7b398d6e62d7ee40ea5f46c4&units=metric" ;
            https.get(url,function(responsee){
                responsee.on("data",function(data){
                    const weatherData = JSON.parse(data) ;
                    const lgo = weatherData.weather[0].icon ;
                    const imgurl = "https://openweathermap.org/img/wn/"+lgo+"@2x.png" ;
                    const temp =  weatherData.main.temp ;
                    const desc =  weatherData.weather[0].description ;
                    res.write("<h1>Temprature in "+query+" is "+temp+" degree celcius<h1>") ;
                    res.write("<h2>Weather is having "+desc+"</h2>") ;
                    res.write("<img src="+imgurl+"></img>") ;
                    res.send() ;
                });
            });
        });
    });
});

app.listen(3000) ;
