import { useState, useEffect } from "react"
import Weather from "./Weather"
import weatherService from "../services/weather"

const Languages = ({ languages }) => {
    return (
        <ul>
            {languages.map(([key, value]) => <li key={key}>{value}</li>)}
        </ul>)
}

const Flag = ({ flag }) => {
    return (
        <img src={flag.svg} alt={flag.alt} height="150" style={{ border: "1px solid" }} />
    )
}

const CountryDetail = ({ country }) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        weatherService.getWeatherInCity(country.capital, country.cca3)
            .then(weather => setWeather(weather))
    }, [country])

    const name = country.name.common

    return (
        <div>
            <h2>{name}</h2>
            <div>capital {country.capital}</div>
            <div>area {country.area}</div>
            <h3>languages:</h3>
            <Languages languages={Object.entries(country.languages)} />
            <Flag flag={country.flags} />
            <Weather weather={weather} />
        </div>
    )
}

export default CountryDetail