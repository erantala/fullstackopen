const Search = ({ searchTerm, setSearchTerm }) =>
    <div>
        <span>Search for: </span>
        <input
            value={searchTerm}
            onChange={setSearchTerm}
        />
    </div>

export default Search