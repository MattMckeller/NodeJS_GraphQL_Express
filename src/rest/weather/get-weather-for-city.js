const request = require('request');

const weatherEndpoint = 'https://api.darksky.net/forecast/';
const geocodingBaseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

const getWeatherForCity = (cityName, callback) => {
    getGeocoding(cityName, (geoErr, geoRes) => {
        const {features} = geoRes.body;
        const latitude = features[0].center[0];
        const longitude = features[0].center[1];
        getWeather((error, response) => {
            const {daily} = response.body;
            const todaysData = daily.data[0];
            const summary = todaysData.summary;
            const {temperature, precipProbability} = response.body.currently;
            callback({temperature, precipProbability, summary});
        }, {latitude, longitude})
        /**/
    });
};

const getGeocoding = (addressString, callback) => {
    const geocodingApiKey = process.env.GEOCODING_API_KEY;
    request.get({
            url: geocodingBaseUrl + addressString + '.json',
            qs: {access_token: geocodingApiKey},
            json: true,
        },
        (err, res) => {
            if (err) {
                callback('There was an error', undefined) // Its possible to handle errors here to avoid ugly code above
            } else {
                callback(undefined, res)
            }
        }
    );
};

const getWeather = (callback, {longitude, latitude}) => {
    const weatherApiKey = process.env.WEATHER_API_KEY;
    request.get({
            url: `${weatherEndpoint}${weatherApiKey}/${longitude},${latitude}`,
            json: true,
            qs: {units: 'si'},
        }, callback
    );
};

module.exports = getWeatherForCity;
