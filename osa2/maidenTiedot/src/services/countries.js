import axios from "axios"

const countriesService = 'https://studies.cs.helsinki.fi/restcountries/'

const getAll = () => {
    return axios.get(countriesService + 'api/all')
        .then(response => response.data)
}

export default { getAll }