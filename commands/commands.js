const yargs = require('yargs');
const getWeatherForCity = require('../src/weather/get-weather-for-city');
yargs.version();
yargs
    .command('get', 'make a get HTTP request', {
        url: {
            alias: 'u',
            default: 'http://yargs.js.org/'
        }
    })
    .help();
yargs.command('getWeather', 'Get weather for a city', {
        city: {
            describe: 'The city you want to get the weather for',
            demandOption: true, // required
        }
    },
    ({city}) => {
        getWeatherForCity(city, (result) => {
            console.log(`Found the weather for city ${city}!`);
            console.log(result);
            process.exit();
        })
    });
const argv = yargs.argv; // Must be called at the end of command declarations apparently
module.exports = yargs;
