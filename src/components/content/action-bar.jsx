import add from "../../assets/add.svg";
import Swal from "sweetalert2";
import { addRecord } from "../../api/FirebaseHelper";
import { MiniLoader } from "../misc/loader";
import { useState } from "react";
import { customAlert, getById, inputGetter } from "../../helpers";
import ToggleSwitch from "../misc/toggle-switch";

export default function ActionBar({ requestRefresh, search, show, selected, toggleArchive, isArchive }) {
  const [addingRecord, setAddingRecord] = useState(false);

  async function submit(values) {
    setAddingRecord(() => true);
    if (await addRecord(selected + (isArchive ? "_archive" : ""), values)) {
      customAlert("Record Added!", "success");
      requestRefresh();
    } else {
      customAlert("Failed to add record", "error");
    }
    setAddingRecord(() => false);
  }

  function marriageDialog() {
    Swal.fire({
      title: "Enter Details",
      html:
        '<h3>Enter Husband details:</h4>' +
        '<span class="swal2-input-label">Name</span>' +
        '<input id="husbandName" class="swal2-input">' +
        '<span class="swal2-input-label">Age</span>' +
        '<input id="husbandAge" class="swal2-input" type="number">' +
        '<span class="swal2-input-label">Birthday</span>' +
        '<input id="husbandBirthday" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Place of Birth</span>' +
        '<input id="husbandPlaceOfBirth" class="swal2-input">' +
        '<span class="swal2-input-label">Religion</span>' +
        '<input id="husbandReligion" class="swal2-input">' +
        '<br></br>' +
        '<h3>Enter Wife details:</h4>' +
        '<span class="swal2-input-label">Name</span>' +
        '<input id="wifeName" class="swal2-input">' +
        '<span class="swal2-input-label">Age</span>' +
        '<input id="wifeAge" class="swal2-input" type="number">' +
        '<span class="swal2-input-label">Birthday</span>' +
        '<input id="wifeBirthday" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Place of Birth</span>' +
        '<input id="wifePlaceOfBirth" class="swal2-input">' +
        '<span class="swal2-input-label">Religion</span>' +
        '<input id="wifeReligion" class="swal2-input">' +
        '<div id="empty" class="error-text"> </div>' +
        '<div id="invalidAge" class="error-text"> </div>',
      showCancelButton: true,
      preConfirm: () => {
        let husbandName = inputGetter("husbandName");
        let husbandAge = inputGetter("husbandAge");
        let husbandBirthday = inputGetter("husbandBirthday");
        let husbandPlaceOfBirth = inputGetter("husbandPlaceOfBirth");
        let husbandReligion = inputGetter("husbandReligion");

        let wifeName = inputGetter("wifeName");
        let wifeAge = inputGetter("wifeAge");
        let wifeBirthday = inputGetter("wifeBirthday");
        let wifePlaceOfBirth = inputGetter("wifePlaceOfBirth");
        let wifeReligion = inputGetter("wifeReligion");

        let ageValid = husbandAge.length > 0 && wifeAge.length > 0
        if (!ageValid) getById("invalidAge").innerHTML = "Please make sure that the age you entered is a valid number";
        else getById("invalidAge").innerHTML = " "

        let noempty =
          husbandName.length > 0 &&
          husbandAge.length > 0 &&
          husbandBirthday.length > 0 &&
          husbandPlaceOfBirth.length > 0 &&
          husbandReligion.length > 0 &&
          wifeName.length > 0 &&
          wifeAge.length > 0 &&
          wifeBirthday.length > 0 &&
          wifePlaceOfBirth.length > 0 &&
          wifeReligion.length > 0

        if (!noempty) getById("empty").innerHTML = "Complete all fields";
        else getById("empty").innerHTML = " "

        return noempty && ageValid;
      },
    }).then((value) => {
      if (value.isConfirmed) {
        submit({
          husbandName: inputGetter("husbandName"),
          husbandAge: inputGetter("husbandAge"),
          husbandBirthday: inputGetter("husbandBirthday"),
          husbandPlaceOfBirth: inputGetter("husbandPlaceOfBirth"),
          husbandReligion: inputGetter("husbandReligion"),
          wifeName: inputGetter("wifeName"),
          wifeAge: inputGetter("wifeAge"),
          wifeBirthday: inputGetter("wifeBirthday"),
          wifePlaceOfBirth: inputGetter("wifePlaceOfBirth"),
          wifeReligion: inputGetter("wifeReligion"),
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
        '<input id="age" class="swal2-input" type="number">' +
        '<div id="empty" class="error-text"> </div>' +
        '<div id="nothingChanged" class="error-text"> </div>' +
        '<div id="invalidAge" class="error-text"> </div>',
      preConfirm: () => {
        let newName = inputGetter("fullname");
        let newDayOfBirth = inputGetter("dayOfBirth");
        let newDayOfDeath = inputGetter("dayOfDeath");
        let newDateOfMass = inputGetter("dateOfMass");
        let newAge = inputGetter("age");

        let ageValid = newAge.length > 0
        if (!ageValid) getById("invalidAge").innerHTML = "Please make sure that the age you entered is a valid number";
        else getById("invalid").innerHTML = " "

        let noempty =
          newName.length > 0 &&
          newDayOfBirth.length > 0 &&
          newDayOfDeath.length > 0 &&
          newDateOfMass.length > 0 &&
          newAge.length > 0

        if (!noempty) getById("empty").innerHTML = "Complete all fields";
        else getById("empty").innerHTML = " "

        return noempty && ageValid;
      },
      showCancelButton: true,
    }).then((value) => {
      if (value.isConfirmed) {
        let newName = inputGetter("fullname");
        let newDayOfBirth = inputGetter("dayOfBirth");
        let newDayOfDeath = inputGetter("dayOfDeath");
        let newDateOfMass = inputGetter("dateOfMass");
        let newAge = inputGetter("age");

        submit({
          name: newName,
          dayOfDeath: newDayOfDeath,
          dayOfBirth: newDayOfBirth,
          dateOfMass: newDateOfMass,
          age: newAge,
        });
      }
    });
  }

  function donationDialog() {
    Swal.fire({
      title: "Edit Details",
      html:
        '<span class="swal2-input-label">Fullname</span>' +
        '<input id="fullname" class="swal2-input">' +
        '<span class="swal2-input-label">Address</span>' +
        '<input id="address" class="swal2-input">' +
        '<span class="swal2-input-label">Phone</span>' +
        '<input id="phone" class="swal2-input" type="tel">' +
        '<div id="empty" class="error-text"> </div>' +
        '<div id="nothingChanged" class="error-text"> </div>' +
        '<div id="invalidPhone" class="error-text"> </div>',
      preConfirm: () => {
        let fullname = inputGetter("fullname");
        let address = inputGetter("address");
        let phone = inputGetter("phone");

        let phoneValid = phone.length === 11
        if (!phoneValid) getById("invalidPhone").innerHTML = "Please make sure that the phone number you entered is a valid phone number, Sample: 09xxxxxxxxx";
        else getById("invalidPhone").innerHTML = ""

        let noempty =
          fullname.length > 0 &&
          address.length > 0 &&
          phone.length > 0

        if (!noempty) getById("empty").innerHTML = "Complete all fields";
        else getById("empty").innerHTML = " "

        return noempty && phoneValid;
      },
      showCancelButton: true,
    }).then((value) => {
      if (value.isConfirmed) {
        let fullname = inputGetter("fullname");
        let address = inputGetter("address");
        let phone = inputGetter("phone");

        submit({
          name: fullname,
          address: address,
          phone: phone,
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

        let noempty = title.length > 0 && content.length > 0;

        if (!noempty) getById("empty").innerHTML = "Complete all fields";
        else getById("empty").innerHTML = " "

        return noempty;
      },
    }).then((value) => {
      if (value.isConfirmed) {
        let now = new Date();
        submit({
          title: inputGetter("title"),
          date: `${now.getFullYear()}-${now
            .getMonth()
            .toString()
            .padStart(2, 0)}-${now.getDate()}`,
          content: inputGetter("post-content"),
        });
      }
    });
  }

  return show ? (
    <div className="action-bar">
      {
        selected !== "post" ?
          <span className="search-bar">
            <input type="text" className="search-field" id="search-field" />
            <div
              className="action-button"
              title="Search"
              onClick={() => search(document.getElementById("search-field").value)}
            >
              <h4>Search</h4>
            </div>
          </span> : ""
      }
      {
        selected !== "post" && selected !== "donation" ?
          <span className="archive-bar">
            <ToggleSwitch toggleArchive={toggleArchive} />
            <h4>Toggle Archive</h4>
          </span> : ""
      }
      <span
        className="action-button add-record"
        title="Add"
        onClick={() => {
          switch (selected) {
            case "marriage":
              marriageDialog();
              break;
            case "death":
              deathDialog();
              break;
            case "donation":
              donationDialog();
              break;
            case "post":
              postDialog();
              break;
            default:
              marriageDialog();
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
