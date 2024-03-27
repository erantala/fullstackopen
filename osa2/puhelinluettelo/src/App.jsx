import { useState, useEffect } from 'react'
import Search from './components/Search'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    personService.getAll()
      .then(persons => setPersons(persons))
  }, [])

  const searchedPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddClick = (event) => {
    event.preventDefault()

    const newPerson = { name: newName, number: newNumber }
    const personToUpdate = persons.find(person => person.name === newName)

    if (personToUpdate) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`))
        return
    }

    setNewName('')
    setNewNumber('')

    if (personToUpdate) {
      personService.update(personToUpdate.id, newPerson)
        .then(updatedPerson => setPersons(persons.map(person =>
          person.id !== updatedPerson.id
            ? person
            : updatedPerson)))
    }
    else {
      personService.create(newPerson)
        .then(person => setPersons(persons.concat(person)))
    }
  }

  const handleDeleteClick = (id, name) => {
    const person = persons.find(person => person.id === id)

    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id)
        .then(() => setPersons(persons.filter(person => person.id !== id)))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Search
        searchTerm={searchTerm}
        setSearchTerm={(event) => setSearchTerm(event.target.value)}
      />

      <h2>Add new contact</h2>
      <PersonForm
        newName={newName}
        setNewName={(event) => setNewName(event.target.value)}
        newNumber={newNumber}
        setNewNumber={(event) => setNewNumber(event.target.value)}
        handleClick={handleAddClick}
      />

      <h2>Numbers</h2>
      <Persons persons={searchedPersons} deleteAction={handleDeleteClick} />
    </div>
  )

}

export default App