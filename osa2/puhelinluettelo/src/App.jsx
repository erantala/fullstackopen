import { useState } from 'react'
import Search from './components/Search'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const searchedPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleClick = (event) => {
    event.preventDefault()

    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    setNewName('')
    setNewNumber('')
    setPersons(persons.concat({ name: newName, number: newNumber }))
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
        handleClick={handleClick}
      />
      
      <h2>Numbers</h2>
      <Persons persons={searchedPersons} />
    </div>
  )

}

export default App