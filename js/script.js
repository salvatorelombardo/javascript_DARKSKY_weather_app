var weatherApp = {}

weatherApp.init = function () {

    // var farhenheit, celsius;
    var wData = {}
    var weatherApi = 'https://api.darksky.net/forecast/';
    var apiKey = '75022eaee77bdb4c68e857d58d0ba4c4';

    wData.weatherApi = weatherApi;
    wData.apiKey = apiKey;

    // console.log(wData);
    // return

    weatherApp.getLatLong(wData)





}



weatherApp.getLatLong = function (wData) {
    var weatherApi, apiKey;
    weatherApi = wData.weatherApi;
    apiKey = wData.apiKey;
    // console.log(wData);
    // return

    $(function () {

        $.ajax({
            url: 'https://geoip-db.com/json/',
            type: 'GET',
            dataType: 'json',
            success: function (data) {

                var locData = data;
                var lat = data.latitude;
                var long = data.longitude;
                // $('.city').html(data.city + ',');
                // $('.country').html(data.country_name);
                // weatherApi += "?lat=" + lat + "&lon=" + long + "&APPID=" + apiKey + "&units=metric";
                weatherApi += apiKey + '/' + lat + ',' + long;
                // console.log(data);
                // left off here....gps works , 
                weatherApp.getWeatherData(weatherApi, locData)
            },
            error: function (err) {
                alert('Oops something went wrong, please try again');
                console.log(err);
            }
        })

    })

}

weatherApp.getWeatherData = function (weatherApi, locData) {

    // console.log(locData);
    // return

    $.ajax({
        url: weatherApi,
        type: 'GET',
        dataType: 'jsonp',
        success: function (data) {

            // console.log(data);
            var currentWeather = {},
                fiveDayForecast = {},
                rollOverData = {},
                hourlyWeather = {};

            currentWeather = data.currently;
            weatherApp.currently(currentWeather, locData);

            fiveDayForecast = data.daily;
            weatherApp.fiveDayForecast(fiveDayForecast)

            rollOverData = data.daily;
            weatherApp.rollOverDOTW(rollOverData);

            hourlyWeather = data.hourly.data;
            weatherApp.hourly(hourlyWeather);





        },
        error: function (err) {
            alert('Oops something went wrong, please try again');
            console.log(err);
        }
    })

}

// access hourly data and display

weatherApp.hourly = function (hourlyWeather) {

    var i, twoFour = '<div id="twoFourFore">',
        header;



    for (i = 0; i < 24; i++) {
        var timeSUB, ts1, ts2, ts3, newTime, temp;

        // console.log(Math.floor(hourlyWeather[i].temperature))

        timeSub = weatherApp.milToStandard(weatherApp.msToTime(hourlyWeather[i].time))
        // console.log(timeSub);

        ts1 = timeSub.search(':');
        ts2 = timeSub.slice(-2);
        ts3 = timeSub.slice(0, ts1);
        // console.log(ts3)
        if (ts3[0] == 0) {

            ts3 = ts3.slice(1, ts1)
        }

        newTime = ts3 + ts2;
        twoFourIcon = hourlyWeather[i].icon;
        // console.log(newTime + hourlyWeather[i].icon)

        if (newTime[i] === newTime[0]) {
            newTime = 'Now'
        }
        twoFour += '<div style="display:inline-block" class="hours"><p>' + newTime + '</p><p>' + Math.floor(hourlyWeather[i].temperature) + '	&#176;' + '</p>';
        twoFour += '<img src="./images/' + twoFourIcon + '.svg"></div>';


    }

    twoFour += '</div>';

    // console.log(twoFour)


    header = document.getElementById('header');
    header.insertAdjacentHTML('afterEnd', twoFour);


}

// currently access current weather and displays the crawling message ath the top of the screen

weatherApp.currently = function (currentWeather, locData) {
    // console.log(currentWeather);
    // return
    var ticker, stats = '';

    ticker = document.getElementById('webTicker');

    stats = '<li>The current weather conditions for ' + locData.city + ', ' + locData.state;
    // stats += '<li>' + locData.state + '</li>';s
    // stats += ' at ' + weatherApp.milToStandard(weatherApp.msToTime(currentWeather.time)) + ' </li>';
    // stats += '<li>' + "<canvas id=" + currentWeather.icon + " width='64' height='64'>" + '</li>';
    stats += '<li><img src="./images/' + currentWeather.icon + '.svg"></li>';
    stats += '<li>Temperature: ' + Math.floor(currentWeather.temperature) + '&#176 </li>';
    stats += '<li>Skies: ' + currentWeather.summary + '</li>';

    ticker.innerHTML = stats;

    $('#webTicker').webTicker();

}


// this function retrieves the 5 day forecast / displays the 5 day forecast

weatherApp.fiveDayForecast = function (fiveDayForecast) {
    var twoFourFore, summary, i = 0,
        instructions = '',
        DOTW = '<div id="DCON" class="row">',
        FDFI, DAY, d, n, instructionsLocation;

    DAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    d = new Date();
    n = d.getDay();

    // console.log(d, n);

    twoFourFore = document.getElementById('header');
    // console.log(fiveDayForecast.summary);
    // return
    summary = '<div id="fiveDF" class="container-fluid"><p id="fiveDFsummary">' + '<img src="images/' + fiveDayForecast.icon + '.svg">' + ' ' + fiveDayForecast.summary + '</p></div>';

    instructions = '<div id="instructionsLocation"><p>Rollover day-of-the-week for additional weather information</p></div>'

    twoFourFore.insertAdjacentHTML('afterEnd', summary);

    instructionsLocation = document.getElementById('fiveDFsummary');

    instructionsLocation.insertAdjacentHTML('afterEnd', instructions);






    for (i; i <= 5; i++) {


        var timeSUB, ts1, ts2, ts3, newTime, today;





        DOTW += '<div id="DOTF' + i + '" style="margin:1em" class="col-10 col-sm-5 col-md-5 col-lg-3">';
        if (i === 0) {

            DOTW += '<h1>TODAY</h1>';
            // console.log(DOTW)
            // return
        } else {
            DOTW += '<h1>' + DAY[n] + '</h1>'
        }

        n = n + 1;



        if (n >= 7) {
            n = 0
        }

        timeSub = weatherApp.milToStandard(weatherApp.msToTime(fiveDayForecast.data[i].sunriseTime))
        // console.log(timeSub);

        ts1 = timeSub.search(':');
        ts2 = timeSub.slice(-6);
        ts3 = timeSub.slice(0, ts1);

        if (ts3[0] == 0) {

            ts3 = ts3.slice(1, ts1)
        }
        newTime = ts3 + ts2
        // console.log(newTime = ts3 + ts2)




        DOTW += '<img src="images/' + fiveDayForecast.data[i].icon + '.svg">';
        DOTW += '<div class="highLow"><div><p>Hi</p><span>' + Math.floor(fiveDayForecast.data[i].temperatureHigh) + '</span></div><div><p>Lo</p><span>' + Math.floor(fiveDayForecast.data[i].temperatureLow) + '</span></div></div>'
        DOTW += '<p class="fiveSummary text-center">' + fiveDayForecast.data[i].summary + '</p>';
        DOTW += '<div class="sunTime"><p>Sunrise ' + '<span>' + newTime + '</span></p><p> Sunset ' + '<span>' + weatherApp.milToStandard(weatherApp.msToTime(fiveDayForecast.data[i].sunsetTime)) + '</span></p></div>'
        // DOTW += weatherApp.msToTime(fiveDayForecast.data[i].sunsetTime);
        DOTW += '</div>'
    }

    DOTW += '</div>'

    FDFI = document.getElementById('instructionsLocation');

    FDFI.insertAdjacentHTML('afterEnd', DOTW);

    // console.log(DOTW)

    // weatherApp.DOTW();


    // return


}



// this function is responsible for managing the roll over events which are triggerd when you mouse over/off the day of the week

weatherApp.rollOverDOTW = function (rollOverData) {

    var h1, getInfo, removeInfo, rollOverData;



    h1 = document.getElementsByTagName('h1');

    // show the window


    function popUp(PU) {

        var rect, height, top;

        rect = PU.getBoundingClientRect();
        // console.log(rect)
        if (rect.height) {

            height = rect.height
        } else {

            height = rect.bottom - rect.top
        }

        top = rect.top + height + 10;

        return [rect.left, top];

    }

    function getInfo(e) {

        var loc, left, top, div, txt, event, PU, PUL, addInfo;


        PU = e.target;
        // pop up target

        PUL = e.target.parentElement;
        event = e.target.parentElement.id.substring(4);

        // console.log(rollOverData.data[event])
        // console.log(PU)
        // return

        // create location for pop-up
        loc = popUp(PU);


        // return
        left = (loc[0] + 20) + "px";

        top = loc[1] + "px";

        // console.log('left: ' + left + ' top: ' + top)

        // create popup

        div = document.createElement("div");

        div.id = "popup";

        addInfo = popUpInfo(rollOverData.data[event]);

        // console.log(addInfo);

        // return
        // txt = document.createTextNode(addInfo);
        // div.appendChild(addInfo);
        div.innerHTML = addInfo
        // console.log(div);

        // return
        // style popup

        div.setAttribute("class", "popup");
        div.setAttribute("style", "left:" + left + "; top:" + top + "; position:absolute");
        // console.log(PUL);
        document.body.appendChild(div);


        // display the popup window the additional weather info




    }

    // removes the popup box after mouseout

    function removeInfo() {

        var popup;

        popup = document.getElementById('popup');

        if (popup) {

            popup.parentNode.removeChild(popup);

            return false;
        }
    }

    // creates event listeners for mouseover of DOTW

    var manageEvent = function (rollOverData) {

        for (var i = 0; i < h1.length; i++) {

            if (h1[i].length != 0) {
                // console.log('blargh')

                h1[i].addEventListener('mouseover', function (e, rollOverData) {
                    getInfo(e, rollOverData)
                }, false);
                h1[i].addEventListener('mouseout', removeInfo, false)



            }
        }
    }();

    function popUpInfo(rollOverData) {

        var addInfo = '<div>',
            ROD;

        ROD = rollOverData

        addInfo += '<span>Humidity: ' + Math.floor(ROD.humidity * 100) + '&#37;' + '</span><br><span>Chance of rain: ' + Math.floor(ROD.precipProbability * 100) + '&#37;' + '</span><br>';
        addInfo += '<span>UV Index: ' + ROD.uvIndex + ' ' + '</span><br><span> Visibility: ' + Math.floor(ROD.visibility) + ' miles' + '</span><br>';
        addInfo += '<span>Wind: ' + weatherApp.bearingToDirection(ROD.windBearing) + ' ' /*' ' + '</span><br><span>Wind speed: '*/ + Math.floor(ROD.windSpeed) + 'MPH</span><br>';
        // /build pop up info div here

        addInfo += '</div>'

        // console.log(ROD.humidity)
        return addInfo

    }






}

weatherApp.bearingToDirection = function (num) {

    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];

}




// The bottom 2 functions convert milliseconds to standard time and standard time to AM/PM

weatherApp.msToTime = function (duration) {
    var d, subTime;
    d = new Date(0);

    d.setUTCSeconds(duration);
    subTime = d.toString().substring(16, 24);
    // parseInt(subTime);

    // console.log(subTime)

    return subTime

}






weatherApp.milToStandard = function (value) {

    if (value !== null && value !== undefined) { //If value is passed in
        if (value.indexOf('AM') > -1 || value.indexOf('PM') > -1) { //If time is already in standard time then don't format.
            return value;
        } else {
            if (value.length == 8) { //If value is the expected length for military time then process to standard time.
                var hour = value.substring(0, 2); //Extract hour
                var minutes = value.substring(3, 5); //Extract minutes
                var identifier = 'AM'; //Initialize AM PM identifier

                if (hour == 12) { //If hour is 12 then should set AM PM identifier to PM
                    identifier = 'PM';
                }
                if (hour == 0) { //If hour is 0 then set to 12 for standard time 12 AM
                    hour = 12;
                }
                if (hour > 12) { //If hour is greater than 12 then convert to standard 12 hour format and set the AM PM identifier to PM
                    hour = hour - 12;
                    identifier = 'PM';
                }
                return hour + ':' + minutes + ' ' + identifier; //Return the constructed standard time
            } else { //If value is not the expected length than just return the value as is
                return value;
            }
        }
    }

}






weatherApp.init()