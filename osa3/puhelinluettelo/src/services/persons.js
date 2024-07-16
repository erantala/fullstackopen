import axios from "axios"

const notesService = '/api/persons'

const getAll = () => {
    return axios.get(notesService)
        .then(response => response.data)
}

const create = newPerson => {
    return axios.post(notesService, newPerson)
        .then(response => response.data)
}

const update = (id, updatedPerson) => {
    return axios.put(`${notesService}/${id}`, updatedPerson)
        .then(response => response.data)
}

const remove = id => {
    return axios.delete(`${notesService}/${id}`)
}

export default { getAll, create, update, remove }