import "./content.scss"

import ContentItem from "./content-item"
import ActionBar from "./action-bar"
import { useEffect, useState } from "react"
import { fetchCollection } from "../../api/FirebaseHelper"
import { Loader } from "../misc/loader"

export default function Content({ selected }) {

    const [persons, setPersons] = useState([])
    const [searchString, setSearchString] = useState("");
    const [fetchingCollection, setFetchingCollection] = useState(false)
    const [refereshes, setRefreshes] = useState(0)

    const addPerson = (name, address, phone) => setPersons((current) =>
        [...current, { name: name, id: persons.length, address: address, phone: phone }])

    const refreshList = () => setRefreshes((value) => value + 1)

    const search = (input) => setSearchString(() => input)

    const fetchData = async () => {
        if (selected !== "") {
            console.log("fetch")
            setFetchingCollection(() => true)
            setPersons(await fetchCollection(selected))
            setFetchingCollection(() => false)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => fetchData(), [refereshes, selected])

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
        return <ContentItem name={name} address={address} phone={phone} key={id} id={id} selected={selected} requestRefresh={refreshList} />
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