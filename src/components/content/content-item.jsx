import Swal from "sweetalert2";

import print from "../../assets/print.svg";
import edit from "../../assets/edit.svg";
import archive from "../../assets/archive.svg";
import { archiveRecord, editRecord } from "../../api/FirebaseHelper";
import { customAlert, getById, inputGetter } from "../../helpers";
import { useState } from "react";
import { MiniLoader } from "../misc/loader";

export default function ContentItem({
  person,
  selected,
  requestRefresh,
}) {
  const [updating, setUpdating] = useState(false);
  const [archiving, setArchiving] = useState(false);

  async function submit(values) {
    setUpdating(() => true);
    if (await editRecord(selected, person.id, values)) {
      customAlert("Record Updated!", "success");
      requestRefresh();
    } else {
      customAlert("Failed to update record", "error");
    }
    setUpdating(false);
  }

  async function confirmArchive() {
    setArchiving(() => true);
    if (
      await archiveRecord(selected, `${selected}_archive`, person.id, {
        name: person.name,
        address: person.address,
        phone: person.phone,
      })
    ) {
      customAlert("Record Archived!", "success");
      requestRefresh();
    } else {
      customAlert("Failed to Archive record", "error");
    }
    setArchiving(() => false);
  }

  function personDetail(key, value) {
    switch (key) {
      case "dateOfMass":
        key = "Date Of Mass"
        break
      case "dayOfDeath":
        key = "Day Of Death"
        break
      case "dayOfBirth":
        key = "Day Of Birth"
        break
      default:
    }
    return (
      <div className="key-value-pair" key={key}>
        <span className="key">{key}:</span>
        <span className="value">{value}</span>
      </div>
    )
  }

  function marriageDialog() {
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
        getById("fullname").value = person.name;
        getById("address").value = person.address;
        getById("phone").value = person.phone;
      },
      preConfirm: () => {
        let newname = inputGetter("fullname");
        let newaddress = inputGetter("address");
        let newphone = inputGetter("phone");
        let noempty =
          newname.length > 0 &&
          newaddress.length > 0 &&
          newphone.length > 0;
        if (!noempty)
          getById("empty").innerHTML = "Complete all fields";
        let nothingChanged =
          newname === person.name &&
          newaddress === person.address &&
          newphone === person.phone;
        console.log(noempty);
        console.log(nothingChanged);
        if (nothingChanged)
          getById("nothingChanged").innerHTML =
            "Change atleast one value";
        return noempty && !nothingChanged;
      },
      showCancelButton: true,
    }).then((value) => {
      if (value.isConfirmed) {
        let newname = inputGetter("fullname");
        let newaddress = inputGetter("address");
        let newphone = inputGetter("phone");

        submit({
          name: newname,
          address: newaddress,
          phone: newphone,
        });
      }
    });
  }

  function deathDialog() {
    Swal.fire({
      title: "Edit Details",
      html:
        '<span class="swal2-input-label">Fullname</span>' +
        '<input id="fullname" class="swal2-input">' +
        '<span class="swal2-input-label">Address</span>' +
        '<input id="address" class="swal2-input">' +
        '<span class="swal2-input-label">Day Of Death</span>' +
        '<input id="dayOfDeath" class="swal2-input">' +
        '<span class="swal2-input-label">Day Of Birth</span>' +
        '<input id="dayOfBirth" class="swal2-input">' +
        '<span class="swal2-input-label">Date Of Mass</span>' +
        '<input id="dateOfMass" class="swal2-input">' +
        '<span class="swal2-input-label">Age</span>' +
        '<input id="age" class="swal2-input">' +
        '<span id="empty" class="error-text"> </span>' +
        '<span id="nothingChanged" class="error-text"> </span>',
      didOpen: () => {
        getById("fullname").value = person.name;
        getById("dayOfDeath").value = person.dayOfDeath;
        getById("dayOfBirth").value = person.dayOfBirth;
        getById("dateOfMass").value = person.dateOfMass;
        getById("age").value = person.age;
        getById("address").value = person.address;
      },
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

        let nothingChanged =
          newName === person.name &&
          newDayOfBirth === person.dayOfBirth &&
          newDayOfDeath === person.dayOfDeath &&
          newDateOfMass === person.dateOfMass &&
          newAddress === person.address &&
          newAge === person.age

        if (nothingChanged)
          getById("nothingChanged").innerHTML =
            "Change atleast one value";

        return noempty && !nothingChanged;
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

  return (
    <div className="content-item">
      <div className="person-datas">
        {
          Object.keys(person).sort((a, b) => a < b).map((key) => {
            if (key !== "id")
              return personDetail(key, person[key])
            else return null
          })
        }
      </div>
      <span>
        <div className="icons-container">
          <div className="icon-container">
            <img
              src={print}
              title="print"
              alt=""
              className="icon"
              onClick={() => Swal.fire({ title: "print" })}
            />
          </div>
          <div className="icon-container">
            {updating ? (
              <MiniLoader />
            ) : (
              <img
                src={edit}
                title="edit"
                alt=""
                className="icon"
                onClick={() => {
                  switch (selected) {
                    case "marriage":
                      marriageDialog()
                      break
                    case "death":
                      deathDialog()
                      break
                    default:
                      marriageDialog()
                  }
                }}
              />
            )}
          </div>
          <div className="icon-container">
            {archiving ? (
              <MiniLoader />
            ) : (
              <img
                src={archive}
                title="archive"
                alt="archive"
                className="icon"
                onClick={() =>
                  Swal.fire({
                    title: "Are you sure you want to archive this record?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "archive",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      confirmArchive();
                    }
                  })
                }
              />
            )}
          </div>
        </div>
      </span>
    </div>
  );
}
