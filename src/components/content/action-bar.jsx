import add from "../../assets/add.svg";
import Swal from "sweetalert2";
import { addRecord } from "../../api/FirebaseHelper";
import { MiniLoader } from "../misc/loader";
import { useState } from "react";
import { customAlert, getById, inputGetter } from "../../helpers";

export default function ActionBar({ requestRefresh, search, show, selected }) {
  const [addingRecord, setAddingRecord] = useState(false);

  async function submit(values) {
    setAddingRecord(() => true);
    if (
      await addRecord(selected, values)) {
      customAlert("Record Added!", "success");
      requestRefresh();
    } else {
      customAlert("Failed to add record", "error");
    }
    setAddingRecord(() => false);
  }

  function marriageDialog() {
    Swal.fire({
      title: "Enter Name",
      html:
        '<div id="empty" class="error-text"> </div>' +
        '<span class="swal2-input-label">Fullname</span>' +
        '<input id="fullname" class="swal2-input">' +
        '<span class="swal2-input-label">Address</span>' +
        '<input id="address" class="swal2-input">' +
        '<span class="swal2-input-label">Phone</span>' +
        '<input id="phone" class="swal2-input">',
      showCancelButton: true,
      preConfirm: () => {
        let newname = inputGetter("fullname");
        let newaddress = inputGetter("address");
        let newphone = inputGetter("phone");

        let noempty =
          newname.length > 0 &&
          newaddress.length > 0 &&
          newphone.length > 0;
        if (!noempty) getById("empty").innerHTML = "Complete all fields";

        return noempty;
      },
    }).then((value) => {
      if (value.isConfirmed) {
        submit({
          name: inputGetter("fullname"),
          address: inputGetter("address"),
          phone: inputGetter("phone")
        });
      }
    });
  }

  function deathDialog() {
    Swal.fire({
      title: "Add Details",
      html:
        '<span class="swal2-input-label">Fullname</span>' +
        '<input id="fullname" class="swal2-input">' +
        '<span class="swal2-input-label">Day Of Death</span>' +
        '<input id="dayOfDeath" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Day Of Birth</span>' +
        '<input id="dayOfBirth" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Date Of Mass</span>' +
        '<input id="dateOfMass" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Age</span>' +
        '<input id="age" class="swal2-input">' +
        '<span class="swal2-input-label">Address</span>' +
        '<input id="address" class="swal2-input">' +
        '<div id="empty" class="error-text"> </div>' +
        '<div id="nothingChanged" class="error-text"> </div>',
      preConfirm: () => {
        let newName = inputGetter("fullname");
        let newDayOfBirth = inputGetter("dayOfBirth");
        let newDayOfDeath = inputGetter("dayOfDeath");
        let newDateOfMass = inputGetter("dateOfMass");
        let newAddress = inputGetter("address");
        let newAge = inputGetter("age");

        let noempty =
          newName.length > 0 &&
          newDayOfBirth.length > 0 &&
          newDayOfDeath.length > 0 &&
          newDateOfMass.length > 0 &&
          newAddress.length > 0 &&
          newAge.length > 0

        if (!noempty)
          getById("empty").innerHTML = "Complete all fields";

        return noempty
      },
      showCancelButton: true,
    }).then((value) => {
      if (value.isConfirmed) {
        let newName = inputGetter("fullname");
        let newDayOfBirth = inputGetter("dayOfBirth");
        let newDayOfDeath = inputGetter("dayOfDeath");
        let newDateOfMass = inputGetter("dateOfMass");
        let newAddress = inputGetter("address");
        let newAge = inputGetter("age");

        submit({
          name: newName,
          dayOfDeath: newDayOfDeath,
          dayOfBirth: newDayOfBirth,
          dateOfMass: newDateOfMass,
          age: newAge,
          address: newAddress,
        });
      }
    });
  }

  function postDialog() {
    Swal.fire({
      title: "Enter Name",
      html:
        '<div id="empty" class="error-text"> </div>' +
        '<span class="swal2-input-label">Title</span>' +
        '<input id="title" class="swal2-input">' +
        '<span class="swal2-input-label">Content</span>' +
        '<textarea id="post-content" class="swal2-input"></textarea>',
      showCancelButton: true,
      preConfirm: () => {
        let title = inputGetter("title");
        let content = inputGetter("post-content");

        let noempty =
          title.length > 0 &&
          content.length > 0

        if (!noempty) getById("empty").innerHTML = "Complete all fields";
        console.log()

        return noempty;
      },
    }).then((value) => {
      if (value.isConfirmed) {
        let now = new Date()
        submit({
          title: inputGetter("title"),
          date: `${now.getFullYear()}-${now.getMonth().toString().padStart(2, 0)}-${now.getDate()}`,
          content: inputGetter("post-content"),
        });
      }
    });
  }

  return show ? (
    <div className="action-bar">
      <span className="search-bar">
        <input type="text" className="search-field" id="search-field" />
        <div
          className="action-button"
          title="Search"
          onClick={() => search(document.getElementById("search-field").value)}
        >
          <h4>Search</h4>
        </div>
      </span>
      <span
        className="action-button add-record"
        title="Add"
        onClick={() => {
          switch (selected) {
            case "marriage":
              marriageDialog()
              break
            case "death":
              deathDialog()
              break
            case "post":
              postDialog()
              break
            default:
              marriageDialog()
          }
        }}
      >
        {addingRecord ? (
          <MiniLoader />
        ) : (
          <img src={add} alt="add" className="icon" />
        )}
        <h4>Add Record</h4>
      </span>
    </div>
  ) : (
    ""
  );
}
