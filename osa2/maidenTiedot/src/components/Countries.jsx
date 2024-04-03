import { useState, useEffect } from "react"
import CountryDetail from "./CountryDetail"

const Country = ({ countryName, handleClick }) => (
    <div>
        {countryName} <button onClick={handleClick}>show</button>
    </div>
)

const Countries = ({ countries }) => {
    const [selectedCountry, setSelectedCountry] = useState(null)

    // Reset state every time props change
    useEffect(() => setSelectedCountry(null), [countries])

    if (selectedCountry) {
        return <CountryDetail country={selectedCountry} />
    }

    if (countries.length > 10) {
        return <div>Too many matches, specify another filter</div>
    } else if (countries.length === 0) {
        return <div>No matches found, specify another filter</div>
    } else if (countries.length === 1) {
        return <CountryDetail country={countries[0]} />
    } else {
        return (
            <div>
                {countries.map(country =>
                    <Country
                        key={country.cca3 || country.name}
                        countryName={country.name.common}
                        handleClick={() => setSelectedCountry(country)}
                    />)}
            </div>
        )
    }
}

export default Countries