import "./content.scss"

import ContentItem from "./content-item"
import ActionBar from "./action-bar"
import { useState } from "react"

export default function Content() {

    const [persons, setPersons] = useState(["Juan Dela Cruz"])
    const [searchString, setSearchString] = useState("");

    const addPerson = (name) => setPersons((current) => [...current, name,])
    const search = (input) => setSearchString(() => input)

    function getMatches() {
        return (searchString !== "") ?
            persons.map((person, index) => {
                if (person.toLowerCase().includes(searchString.toLowerCase().trim()))
                    return <ContentItem name={person} key={index} />
                else return null
            }) :
            persons.map((person, index) => <ContentItem name={person} key={index} />)
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