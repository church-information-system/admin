import Swal from "sweetalert2"

import print from "../../assets/print.svg"
import edit from "../../assets/edit.svg"
import archive from "../../assets/archive.svg"

export default function ContentItem({ name, address, phone, id, rename, remove }) {
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
                        <img src={edit} title="edit" alt="" className="icon" onClick={() => {
                            Swal.fire({
                                title: name,
                                html:
                                    '<span class="swal2-input-label" >Fullname</span>' +
                                    '<input id="swal-input1" class="swal2-input">',
                                showCancelButton: true,
                            }).then(() => {
                                rename(document.getElementById('swal-input1').value, id)
                            })
                        }} />
                    </div>
                    <div className="icon-container">
                        <img src={archive} title="archive" alt="archive" className="icon" onClick={() =>
                            Swal.fire({
                                title: "Are you sure you want to delete this record?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "archive",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    remove(id)
                                }
                            })
                        } />
                    </div>
                </div>
            </span>
        </div>
    )
}