import Swal from "sweetalert2"
import React, { useState } from 'react'

import print from "../../assets/print.svg"
import edit from "../../assets/edit.svg"
import trash from "../../assets/delete.svg"

export default function ContentItem({ nameProp, remove, index }) {
    const [name, setName] = useState(nameProp);
    return (
        <div className="content-item">
            <h3>{name}</h3>
            <span>
                <img src={print} title="print" alt="" className="icon clickable" onClick={() => Swal.fire({ title: "print" })} />
                <img src={edit} title="edit" alt="" className="icon clickable" onClick={() => {
                    Swal.fire({
                        title: name,
                        html:
                            '<span class="swal2-input-label" >Fullname</span>' +
                            '<input id="swal-input1" class="swal2-input">',
                        showCancelButton: true,
                    }).then(() => setName(() => document.getElementById('swal-input1').value))
                }} />
                <img src={trash} title="delete" alt="delete" className="icon clickable" onClick={() =>
                    Swal.fire({
                        title: "Are you sure you want to delete this record?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Delete",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            remove(index)
                        }
                    })
                } />
            </span>
        </div>
    )
}