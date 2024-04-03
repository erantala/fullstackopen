import axios from "axios"

const apiKey = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY;

const coordinateService = 'http://api.openweathermap.org/geo/1.0/direct'
const weatherService = 'https://api.openweathermap.org/data/2.5/weather'

const getCityCoordinates = (city, iso3166_country) => {
    console.log(`Getting location for ${city}, ${iso3166_country}`)

    return axios.get(coordinateService, {
        params: {
            q: `${city},${iso3166_country}`,
            limit: 1,
            appid: apiKey
        }
    }).then(response => response.data[0])
}

const getWeatherInCity = (city, iso3166_country) => {
    console.log(`Getting weather for ${city}, ${iso3166_country}`)

    const location = getCityCoordinates(city, iso3166_country)

    return location.then(response => {
        return axios.get(weatherService, {
            params: {
                lat: response.lat,
                lon: response.lon,
                appid: apiKey,
                units: 'metric'
            }
        }).then(response => response.data)
    })
}

export default { getWeatherInCity }