import add from "../../assets/add.svg"

export default function ActionBar() {
    return (
        <div className="action-bar">
            <span className="search-bar">
                <input type="text" className="search-field" />
                <div className="action-button" title="Search"><h4>Search</h4></div>
            </span>
            <span className="action-button" title="Add">
                <img src={add} alt="add" className="icon" />
                <h4>Add Record</h4>
            </span>
        </div>
    )
}