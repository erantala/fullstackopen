const Search = ({ searchTerm, setSearchTerm }) =>
    <div>
        <span>Find countries: </span>
        <input
            value={searchTerm}
            onChange={setSearchTerm}
        />
    </div>

export default Search