const Notification = ({ message, type}) => {
    if (message === undefined) {
        return null
    }

    return (
        <div className={`notification ${type}`}>
            {message}
        </div >
    )
}

export default Notification