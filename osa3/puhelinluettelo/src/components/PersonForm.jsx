import { useRef } from 'react'

const PersonForm = ({ newName, setNewName, newNumber, setNewNumber, handleClick }) => {
    const inputFieldRef = useRef(null)
    const handleClickAndFocusInputField = (event) => {
        inputFieldRef.current.focus()
        handleClick(event)
    }

    return (
        <form onSubmit={handleClickAndFocusInputField}>
            <div>
                <span>name: </span>
                <input
                    ref={inputFieldRef}
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
    )
}

export default PersonForm