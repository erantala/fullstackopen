const PersonForm = ({ newName, setNewName, newNumber, setNewNumber, handleClick }) =>
    <form onSubmit={handleClick}>
        <div>
            <span>name: </span>
            <input
                value={newName}
                onChange={setNewName}
            />
        </div>
        <div>
            <span>number: </span>
            <input
                value={newNumber}
                onChange={setNewNumber}
            />
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>

export default PersonForm