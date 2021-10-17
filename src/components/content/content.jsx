import "./content.scss"

import ContentItem from "./content-item"
import ActionBar from "./action-bar"
import { useState } from "react"

export default function Content() {

    const [persons, setPersons] = useState(["Juan Dela Cruz"])
    const [searchString, setSearchString] = useState("");

    const addPerson = (name) => setPersons((current) => [...current, name,])
    const removePerson = (index) => {
        let temp = [...persons]
        temp.splice(index, 1)
        setPersons(() => temp)
    }
    const search = (input) => setSearchString(() => input)

    function getMatches() {
        return (searchString !== "") ?
            persons.map((person, index) => {
                if (person.includes(searchString))
                    return <ContentItem name={person} key={person + index} index={index} delete={removePerson} />
                else return null
            }) :
            persons.map((person, index) => <ContentItem nameProp={person} key={person + index} index={index} remove={removePerson} />)
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