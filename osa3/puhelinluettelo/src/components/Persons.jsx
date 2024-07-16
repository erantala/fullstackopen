import Person from './Person'

const Persons = ({ persons, deleteAction }) =>
    <div>
        {persons.map(person => <Person key={person.name} person={person} deleteAction={deleteAction}/>)}
    </div>

export default Persons