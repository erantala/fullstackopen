const Weather = ({ weather }) => {
    console.log('Weather:', weather)
    return (
        weather ?
            <div>
                <h3>Weather in {weather.name}</h3>
                <div>temperature {weather.main.temp} Celsius</div>
                <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt={weather.weather[0].description} />
                <div>wind {weather.wind.speed} m/s</div>
            </div>
            : null
    )
}

export default Weather