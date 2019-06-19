var express = require('express');
var router = express.Router();
const getWeatherForCity = require('../src/rest/weather/get-weather-for-city');

router.get('/:city', function (req, res, next) {
    getWeatherForCity(req.params.city, (result) => {
        return res.send(result);
    });
});

module.exports = router;
