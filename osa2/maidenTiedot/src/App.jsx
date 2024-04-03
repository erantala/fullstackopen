import { useState, useEffect } from 'react'
import Search from './components/Search'
import Countries from './components/Countries'
import countryService from './services/countries'

const flattenCountrysNames = (namesObject) => {
  let values = []

  for (const key in namesObject) {
    if (typeof namesObject[key] === 'object') {
      values = values.concat(flattenCountrysNames(namesObject[key]))
    }
    else if (typeof namesObject[key] === 'string') {
      values.push(namesObject[key].toLowerCase())
    }
  }

  return values
}

const searchCountries = (searchTerm, countries) => {
  let searchedCountries = countries.filter(country =>
    country.searchNames.some(searchName => searchName.includes(searchTerm.toLowerCase()))
  )
  // Don't trust that all of country's native names would be unique
  const exactCommonName = searchedCountries.filter(country => country.name.common.toLowerCase() === searchTerm.toLowerCase())
  const exactSearchName = searchedCountries.filter(country => country.searchNames.includes(searchTerm.toLowerCase()))

  if (exactCommonName.length === 1) {
    searchedCountries = exactCommonName
  } else if (exactSearchName.length === 1) {
    searchedCountries = exactSearchName
  }

  return searchedCountries
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    countryService.getAll()
      .then(allCountries => setCountries(allCountries.map(country => {
        country.searchNames = flattenCountrysNames(country.name)
        return country
      })))
  }, [])

  const searchedCountries = searchCountries(searchTerm, countries)

  return (
    <div>
      <h1>Countries</h1>
      <Search
        searchTerm={searchTerm}
        setSearchTerm={(event) => setSearchTerm(event.target.value)}
      />
      <Countries countries={searchedCountries} />
    </div>
  )

}

export default App