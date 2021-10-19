import add from "../../assets/add.svg"
import Swal from "sweetalert2"
import { addRecord } from "../../api/FirebaseHelper"
import { useState } from "react/cjs/react.development"
import { MiniLoader } from "../misc/loader"

export default function ActionBar({ addPerson, search }) {
    const [addingRecord, setAddingRecord] = useState(false)


    async function submit(name, address, phone) {
        if (await addRecord("marriage", {
            name: name,
            address: address,
            phone: phone,
        })) {
            addPerson(name, address, phone)
            setAddingRecord(false)
        }
    }

    function inputGetter(id) {
        return document.getElementById(id).value;
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
                        '<input id="fullname" class="swal2-input">' +
                        '<span class="swal2-input-label">Address</span>' +
                        '<input id="address" class="swal2-input">' +
                        '<span class="swal2-input-label">Phone</span>' +
                        '<input id="phone" class="swal2-input">',
                    showCancelButton: true,
                }).then((value) => {
                    if (value.isConfirmed) {
                        submit(inputGetter("fullname"), inputGetter("address"), inputGetter("phone"))
                        setAddingRecord(true)
                    }
                })
            }}>
                {addingRecord ? <MiniLoader /> : <img src={add} alt="add" className="icon" />}
                <h4>Add Record</h4>
            </span>
        </div >
    )
}