import Swal from "sweetalert2"

import print from "../../assets/print.svg"
import edit from "../../assets/edit.svg"
import archive from "../../assets/archive.svg"
import { archiveRecord, editRecord } from "../../api/FirebaseHelper"
import { customAlert, getById, inputGetter } from "../../helpers"
import { useState } from "react"
import { MiniLoader } from "../misc/loader"

export default function ContentItem({ name, address, phone, id, selected, requestRefresh }) {
    const [updating, setUpdating] = useState(false)
    const [archiving, setArchiving] = useState(false)

    async function submit(values) {
        setUpdating(() => true)
        if (await editRecord(selected, id, values)) {
            customAlert("Record Updated!", "success")
            requestRefresh()
        } else {
            customAlert("Failed to update record", "error")
        }
        setUpdating(false)
    }

    async function confirmArchive() {
        setArchiving(() => true)
        if (await archiveRecord("marriage", "marriage_archive", id, {
            name: name,
            address: address,
            phone: phone,
        })) {
            customAlert("Record Archived!", "success")
            requestRefresh()
        } else {
            customAlert("Failed to Archive record", "error")
        }
        setArchiving(() => false)

    }

    return (
        <div className="content-item">
            <div>
                <h3>{name}</h3>
                <p>{address}</p>
                <small>{phone}</small>
            </div>
            <span>
                <div className="icons-container">
                    <div className="icon-container">
                        <img src={print} title="print" alt="" className="icon" onClick={() => Swal.fire({ title: "print" })} />
                    </div>
                    <div className="icon-container">
                        {
                            updating ?
                                <MiniLoader /> :
                                <img src={edit} title="edit" alt="" className="icon" onClick={() => {
                                    Swal.fire({
                                        title: "Enter Details",
                                        html:
                                            '<span id="empty" class="error-text"> </span>' +
                                            '<span id="nothingChanged" class="error-text"> </span>' +
                                            '<span class="swal2-input-label">Fullname</span>' +
                                            '<input id="fullname" class="swal2-input">' +
                                            '<span class="swal2-input-label">Address</span>' +
                                            '<input id="address" class="swal2-input">' +
                                            '<span class="swal2-input-label">Phone</span>' +
                                            '<input id="phone" class="swal2-input">',
                                        didOpen: () => {
                                            getById("fullname").value = name
                                            getById("address").value = address
                                            getById("phone").value = phone
                                        },
                                        preConfirm: () => {
                                            let newname = inputGetter("fullname")
                                            let newaddress = inputGetter("address")
                                            let newphone = inputGetter("phone")

                                            let noempty = (newname.length > 0 && newaddress.length > 0 && newphone.length > 0)
                                            if (!noempty) getById("empty").innerHTML = "Complete all fields"

                                            let nothingChanged = (newname === name && newaddress === address && newphone === phone)
                                            console.log(noempty)
                                            console.log(nothingChanged)
                                            if (nothingChanged) getById("nothingChanged").innerHTML = "Change atleast one value"

                                            return noempty && !nothingChanged
                                        },
                                        showCancelButton: true,
                                    }).then((value) => {
                                        if (value.isConfirmed) {
                                            let newname = inputGetter("fullname")
                                            let newaddress = inputGetter("address")
                                            let newphone = inputGetter("phone")

                                            submit({ name: newname, address: newaddress, phone: newphone })
                                        }
                                    })
                                }} />
                        }
                    </div>
                    <div className="icon-container">
                        {
                            archiving ?
                                <MiniLoader /> :
                                <img src={archive} title="archive" alt="archive" className="icon" onClick={() =>
                                    Swal.fire({
                                        title: "Are you sure you want to archive this record?",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonText: "archive",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            confirmArchive()
                                        }
                                    })
                                } />
                        }
                    </div>
                </div>
            </span>
        </div>
    )
}