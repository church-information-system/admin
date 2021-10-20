import Swal from "sweetalert2"

import print from "../../assets/print.svg"
import edit from "../../assets/edit.svg"
import archive from "../../assets/archive.svg"
import { archiveRecord, editRecord } from "../../api/FirebaseHelper"
import { customAlert, inputGetter } from "../../helpers"
import { useState } from "react"
import { MiniLoader } from "../misc/loader"

export default function ContentItem({ name, address, phone, id, requestRefresh, remove }) {
    const [updating, setUpdating] = useState(false)
    const [deleting, setDeleting] = useState(false)

    async function submit(values) {
        if (await editRecord("marriage", id, values)) {
            customAlert("Record Updated!", "success")
            requestRefresh()
        } else {
            customAlert("Failed to update record", "error")
        }
        setUpdating(false)
    }

    async function confirmArchive() {

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
        setDeleting(false)

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
                                            '<span class="swal2-input-label">Fullname</span>' +
                                            '<input id="fullname" class="swal2-input">' +
                                            '<span class="swal2-input-label">Address</span>' +
                                            '<input id="address" class="swal2-input">' +
                                            '<span class="swal2-input-label">Phone</span>' +
                                            '<input id="phone" class="swal2-input">',
                                        showCancelButton: true,
                                    }).then((value) => {
                                        if (value.isConfirmed) {
                                            submit({ name: inputGetter("fullname"), address: inputGetter("address"), phone: inputGetter("phone") })
                                            setUpdating(() => true)
                                        }
                                    })
                                }} />
                        }
                    </div>
                    <div className="icon-container">
                        {
                            deleting ?
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