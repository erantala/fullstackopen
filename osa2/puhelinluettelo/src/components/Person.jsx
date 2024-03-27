const Person = ({ person, deleteAction }) => {
    const personDelete = () => deleteAction(person.id, person.name)

    return (
        <div>
            {person.name}{' '}
            {person.number}{' '}
            <button onClick={personDelete}>&#x274C;</button>
        </div>)
}

export default Person