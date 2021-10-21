import "./content.scss"

import ContentItem from "./content-item"
import ActionBar from "./action-bar"
import { useEffect, useState } from "react"
import { fetchCollection } from "../../api/FirebaseHelper"
import { Loader } from "../misc/loader"
import { useCallback } from "react/cjs/react.development"

export default function Content({ selected }) {

    const [persons, setPersons] = useState([])
    const [searchString, setSearchString] = useState("");
    const [fetchingCollection, setFetchingCollection] = useState(false)

    const addPerson = (name, address, phone) => setPersons((current) =>
        [...current, { name: name, id: persons.length, address: address, phone: phone }])

    const refreshList = () => fetchData()

    const removePerson = (id) => setPersons(() => persons.filter(item => item.id !== id))

    const search = (input) => setSearchString(() => input)


    const fetchData = useCallback(async () => {
        if (selected !== "") {
            console.log("fetch")
            setFetchingCollection(() => true)
            setPersons(await fetchCollection(selected))
            setFetchingCollection(() => false)
        }
    }, [selected])

    useEffect(() => fetchData(), [fetchData, selected])

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
        return <ContentItem name={name} address={address} phone={phone} key={id} id={id} remove={removePerson} requestRefresh={refreshList} />
    }



    return (
        <div id="content">
            <ActionBar addPerson={addPerson} search={search} requestRefresh={refreshList} show={selected !== ""} />
            {
                selected === "" ?
                    <h3 className="content-message">Nothing Selected</h3> :
                    fetchingCollection ?
                        <Loader /> :
                        <div className="content-container">
                            {getMatches()[0] ? getMatches() : <h3 className="content-message">No Records found</h3>}
                        </div>
            }
        </div>
    )
}