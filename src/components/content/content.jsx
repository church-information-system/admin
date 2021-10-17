import "./content.scss"

import ContentItem from "./content-item"
import ActionBar from "./action-bar"
import { useState } from "react"

export default function Content() {

    const [persons, setPersons] = useState([{ name: "Juan Dela Cruz", id: 0 }])
    const [searchString, setSearchString] = useState("");

    const addPerson = (name) => setPersons((current) => [...current, { name: name, id: persons.length }])
    const removePerson = (id) => setPersons(() => persons.filter(item => item.id !== id))

    const search = (input) => setSearchString(() => input)
    const renamePerson = (name, id) => {
        let temp = [...persons]
        temp[temp.findIndex((item) => item.id === id)].name = name
        setPersons(() => temp)
    }

    function getMatches() {
        let arr = []
        if (searchString !== "") {
            persons.forEach((person) => {
                if (person.name.trim().toLowerCase().includes(searchString.trim().toLowerCase()))
                    arr.push(createItem(person.name, person.id))
            })
        } else {
            arr = persons.map((person) => createItem(person.name, person.id))
        }
        return arr
    }

    function createItem(name, id) {
        return <ContentItem name={name} key={id} id={id} remove={removePerson} rename={renamePerson} />
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