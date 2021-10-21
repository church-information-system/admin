import add from "../../assets/add.svg"
import Swal from "sweetalert2"
import { addRecord } from "../../api/FirebaseHelper"
import { MiniLoader } from "../misc/loader"
import { useState } from "react"
import { customAlert, getById, inputGetter } from "../../helpers"

export default function ActionBar({ requestRefresh, search, show, selected }) {
    const [addingRecord, setAddingRecord] = useState(false)

    async function submit(name, address, phone) {
        setAddingRecord(() => true)
        if (await addRecord(selected, {
            name: name,
            address: address,
            phone: phone,
        })) {
            customAlert("Record Added!", "success")
            requestRefresh()
        } else {
            customAlert("Failed to add record", "error")
        }
        setAddingRecord(() => false)
    }

    return show ? (
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
                        '<span id="empty" class="error-text"> </span>' +
                        '<span class="swal2-input-label">Fullname</span>' +
                        '<input id="fullname" class="swal2-input">' +
                        '<span class="swal2-input-label">Address</span>' +
                        '<input id="address" class="swal2-input">' +
                        '<span class="swal2-input-label">Phone</span>' +
                        '<input id="phone" class="swal2-input">',
                    showCancelButton: true,
                    preConfirm: () => {
                        let newname = inputGetter("fullname")
                        let newaddress = inputGetter("address")
                        let newphone = inputGetter("phone")

                        let noempty = (newname.length > 0 && newaddress.length > 0 && newphone.length > 0)
                        if (!noempty) getById("empty").innerHTML = "Complete all fields"

                        return noempty
                    },
                }).then((value) => {
                    if (value.isConfirmed) {
                        submit(inputGetter("fullname"), inputGetter("address"), inputGetter("phone"))
                    }
                })
            }}>
                {addingRecord ? <MiniLoader /> : <img src={add} alt="add" className="icon" />}
                <h4>Add Record</h4>
            </span>
        </div >
    ) : ""
}