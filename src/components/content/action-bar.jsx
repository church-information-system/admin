import add from "../../assets/add.svg"
import Swal from "sweetalert2"
import { addRecord } from "../../api/FirebaseHelper"
import { useState } from "react/cjs/react.development"
import { MiniLoader } from "../misc/loader"

export default function ActionBar({ addPerson, search }) {
    const [addingRecord, setAddingRecord] = useState(false)


    async function submit(name) {
        if (await addRecord("marriage", {
            name: name,
            address: "somewhere",
            phone: "0999",
        })) {
            addPerson(name)
            setAddingRecord(false)
        }
    }

    return (
        <div className="action-bar">
            <span className="search-bar">
                <input type="text" className="search-field" id="search-field" />
                <div className="action-button" title="Search" onClick={
                    () => search(document.getElementById("search-field").value)
                }><h4>Search</h4></div>
            </span>
            <span className="action-button" title="Add" onClick={() => {
                Swal.fire({
                    title: "Enter Name",
                    html:
                        '<span class="swal2-input-label">Fullname</span>' +
                        '<input id="swal-input1" class="swal2-input">',
                    showCancelButton: true,
                }).then(() => {
                    submit(document.getElementById('swal-input1').value)
                    setAddingRecord(true)
                })
            }}>
                {addingRecord ? <MiniLoader /> : <img src={add} alt="add" className="icon" />}
                <h4>Add Record</h4>
            </span>
        </div>
    )
}