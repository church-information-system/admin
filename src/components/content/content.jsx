import "./content.scss"

import ContentItem from "./content-item"
import ActionBar from "./action-bar"
import { useEffect, useState } from "react"
import { fetchCollection } from "../../api/FirebaseHelper"

export default function Content() {

    const [persons, setPersons] = useState([])
    const [searchString, setSearchString] = useState("");
    const [refreshes, setRefreshes] = useState(0);

    const addPerson = (name, address, phone) => setPersons((current) =>
        [...current, { name: name, id: persons.length, address: address, phone: phone }])

    const refreshList = () => setRefreshes((count) => count + 1)


    const removePerson = (id) => setPersons(() => persons.filter(item => item.id !== id))

    const search = (input) => setSearchString(() => input)
    const renamePerson = (name, id) => {
        let temp = [...persons]
        temp[temp.findIndex((item) => item.id === id)].name = name
        setPersons(() => temp)
    }

    useEffect(() => fetchRecords(), [refreshes])

    function getMatches() {
        let arr = []
        if (searchString !== "") {
            persons.forEach((person) => {
                if (person.name.trim().toLowerCase().includes(searchString.trim().toLowerCase()))
                    arr.push(createItem(person.name, person.id, person.address, person.phone))
            })
        } else {
            arr = persons.map((person) => createItem(person.name, person.id, person.address, person.phone))
        }
        return arr
    }

    function createItem(name, id, address, phone) {
        return <ContentItem name={name} address={address} phone={phone} key={id} id={id} remove={removePerson} rename={renamePerson} />
    }

    async function fetchRecords() {
        console.log("fetching")
        setPersons(await fetchCollection("marriage"))
    }

    return (
        <div id="content">
            <ActionBar addPerson={addPerson} search={search} requestRefresh={refreshList} />
            <div className="content-container">
                {getMatches()[0] ? getMatches() : "No Records found"}
            </div>
        </div>
    )
}