import "./content.scss"

import ContentItem from "./content-item"
import ActionBar from "./action-bar"
import { useState } from "react"

export default function Content() {

    const [persons, setPersons] = useState([{ name: "Juan Dela Cruz", id: 0 }])
    const [searchString, setSearchString] = useState("");

    const addPerson = (name) => setPersons((current) => [...current, { name: name, id: persons.length }])
    const removePerson = (id) => {
        setPersons(() => persons.filter(item => item.id !== id))
    }
    const search = (input) => setSearchString(() => input)

    function getMatches() {
        let arr = []
        if (searchString !== "") {
            persons.forEach((person) => {
                if (person.name.toLowerCase().includes(searchString.toLowerCase()))
                    arr.push(<ContentItem nameProp={person.name} key={person.id} id={person.id} delete={removePerson} />)
            })
        } else {
            arr = persons.map((person) => <ContentItem nameProp={person.name} key={person.id} id={person.id} remove={removePerson} />)
        }
        return arr
    }

    return (
        <div id="content">
            <ActionBar addPerson={addPerson} search={search} />
            <div className="content-container">
                {getMatches()[0] ? getMatches() : "No Records found"}
            </div>
        </div>
    )
}