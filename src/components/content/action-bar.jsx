import add from "../../assets/add.svg";
import archive from "../../assets/archive.svg";

import Swal from "sweetalert2";
import { addRecord } from "../../api/FirebaseHelper";
import { MiniLoader } from "../misc/loader";
import { useState } from "react";
import { customAlert, formatTime, getById, inputGetter } from "../../helpers";
import ToggleSwitch from "../misc/toggle-switch";

export default function ActionBar({
  requestRefresh,
  search,
  show,
  selected,
  toggleArchive,
  toggleSelectMode,
  isArchive,
  isSelect,
  archiveSelected,
}) {
  const [addingRecord, setAddingRecord] = useState(false);

  let showArchive = !["events", "donation", ""].includes(selected);

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
        "<h3>Enter Wife details:</h4>" +
        '<span class="swal2-input-label">Name</span>' +
        '<input id="wifeName" class="swal2-input">' +
        '<span class="swal2-input-label">Age</span>' +
        '<input id="wifeAge" class="swal2-input" type="number" min="1">' +
        '<span class="swal2-input-label">Birthday</span>' +
        '<input id="wifeBirthday" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Religion</span>' +
        '<input id="wifeReligion" class="swal2-input">' +
        '<span class="swal2-input-label">Place of Birth</span>' +
        '<input id="wifePlaceOfBirth" class="swal2-input">' +
        '<span class="swal2-input-label">Residence</span>' +
        '<input id="wifeResidence" class="swal2-input">' +
        '<span class="swal2-input-label">Father</span>' +
        '<input id="wifeFather" class="swal2-input">' +
        '<span class="swal2-input-label">Mother</span>' +
        '<input id="wifeMother" class="swal2-input">' +
        "<br></br>" +
        "<h3>Enter Husband details:</h4>" +
        '<span class="swal2-input-label">Name</span>' +
        '<input id="husbandName" class="swal2-input">' +
        '<span class="swal2-input-label">Age</span>' +
        '<input id="husbandAge" class="swal2-input" type="number" min="1">' +
        '<span class="swal2-input-label">Birthday</span>' +
        '<input id="husbandBirthday" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Religion</span>' +
        '<input id="husbandReligion" class="swal2-input">' +
        '<span class="swal2-input-label">Place of Birth</span>' +
        '<input id="husbandPlaceOfBirth" class="swal2-input">' +
        '<span class="swal2-input-label">Residence</span>' +
        '<input id="husbandResidence" class="swal2-input">' +
        '<span class="swal2-input-label">Father</span>' +
        '<input id="husbandFather" class="swal2-input">' +
        '<span class="swal2-input-label">Mother</span>' +
        '<input id="husbandMother" class="swal2-input">' +
        "<h3>Marriage Details</h3>" +
        '<span class="swal2-input-label">Date Of marriage</span>' +
        '<input id="marriageDate" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Priest </span>' +
        '<input id="priest" class="swal2-input">' +
        '<span class="swal2-input-label">Witness </span>' +
        '<input id="witness" class="swal2-input">' +
        '<span class="swal2-input-label">Residence </span>' +
        '<input id="residence" class="swal2-input">' +
        "<h3>Church Record</h3>" +
        '<span class="swal2-input-label">License No</span>' +
        '<input id="licenseNo" class="swal2-input" type="number">' +
        '<span class="swal2-input-label">Book No</span>' +
        '<input id="bookNo" class="swal2-input" type="number">' +
        '<span class="swal2-input-label">Page No</span>' +
        '<input id="pageNo" class="swal2-input" type="number">' +
        '<span class="swal2-input-label">Line No</span>' +
        '<input id="lineNo" class="swal2-input" type="number">' +
        '<span class="swal2-input-label">Marriage License Issued Date</span>' +
        '<input id="dateIssued" class="swal2-input" type="date">' +
        '<div id="empty" class="error-text"> </div>' +
        '<div id="invalidAge" class="error-text"> </div>',
      showCancelButton: true,
      preConfirm: () => {
        getById("husbandAge").value = getById("husbandAge").value.replace(
          /[^0-9]/g,
          ""
        );
        getById("wifeAge").value = getById("wifeAge").value.replace(
          /[^0-9]/g,
          ""
        );

        let husbandName = inputGetter("husbandName");
        let husbandAge = inputGetter("husbandAge");
        let husbandBirthday = inputGetter("husbandBirthday");
        let husbandPlaceOfBirth = inputGetter("husbandPlaceOfBirth");
        let husbandReligion = inputGetter("husbandReligion");
        let husbandResidence = inputGetter("husbandResidence");
        let husbandFather = inputGetter("husbandFather");
        let husbandMother = inputGetter("husbandMother");

        let wifeName = inputGetter("wifeName");
        let wifeAge = inputGetter("wifeAge");
        let wifeBirthday = inputGetter("wifeBirthday");
        let wifePlaceOfBirth = inputGetter("wifePlaceOfBirth");
        let wifeReligion = inputGetter("wifeReligion");
        let wifeResidence = inputGetter("wifeResidence");
        let wifeFather = inputGetter("wifeFather");
        let wifeMother = inputGetter("wifeMother");

        let marriageDate = inputGetter("marriageDate");

        let priest = inputGetter("priest");
        let witness = inputGetter("witness");
        let residence = inputGetter("residence");

        let licenseNo = inputGetter("licenseNo");

        let bookNo = inputGetter("bookNo");
        let pageNo = inputGetter("pageNo");
        let lineNo = inputGetter("lineNo");
        let dateIssued = inputGetter("dateIssued");

        let ageValid =
          husbandAge.length > 0 &&
          wifeAge.length > 0 &&
          husbandAge > 0 &&
          wifeAge > 0;
        if (!ageValid)
          getById("invalidAge").innerHTML =
            "Please make sure that the age you entered is a valid number";
        else getById("invalidAge").innerHTML = " ";

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
          wifeReligion.length > 0 &&
          marriageDate.length > 0 &&
          husbandResidence.length > 0 &&
          husbandFather.length > 0 &&
          husbandMother.length > 0 &&
          wifeResidence.length > 0 &&
          wifeFather.length > 0 &&
          wifeMother.length > 0 &&
          priest.length > 0 &&
          witness.length > 0 &&
          residence.length > 0 &&
          licenseNo.length > 0 &&
          bookNo.length > 0 &&
          pageNo.length > 0 &&
          lineNo.length > 0 &&
          dateIssued.length > 0;

        if (!noempty) getById("empty").innerHTML = "Complete all fields";
        else getById("empty").innerHTML = " ";

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
          marriageDate: inputGetter("marriageDate"),
          husbandResidence: inputGetter("husbandResidence"),
          husbandFather: inputGetter("husbandFather"),
          husbandMother: inputGetter("husbandMother"),
          wifeResidence: inputGetter("wifeResidence"),
          wifeFather: inputGetter("wifeFather"),
          wifeMother: inputGetter("wifeMother"),
          priest: inputGetter("priest"),
          witness: inputGetter("witness"),
          residence: inputGetter("residence"),
          licenseNo: inputGetter("licenseNo"),
          bookNo: inputGetter("bookNo"),
          pageNo: inputGetter("pageNo"),
          lineNo: inputGetter("lineNo"),
          dateIssued: inputGetter("dateIssued"),
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
        '<span class="swal2-input-label" type="date">Day Of Death</span>' +
        '<input id="dayOfDeath" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Day Of Birth</span>' +
        '<input id="dayOfBirth" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Date Of Mass</span>' +
        '<input id="dateOfMass" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Date Of Burial</span>' +
        '<input id="dateOfBurial" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Age</span>' +
        '<input id="age" class="swal2-input" type="number" min="1">' +
        '<span class="swal2-input-label">Address</span>' +
        '<input id="address" class="swal2-input">' +
        '<span class="swal2-input-label">Father\'s name</span>' +
        '<input id="father" class="swal2-input">' +
        '<span class="swal2-input-label">Mother\'s name</span>' +
        '<input id="mother" class="swal2-input">' +
        '<span class="swal2-input-label">Spouse\' Name</span>' +
        '<input id="spouse" class="swal2-input">' +
        '<span class="swal2-input-label">Cemetery</span>' +
        '<input id="cemetery" class="swal2-input">' +
        '<span class="swal2-input-label">Cemetery Address</span>' +
        '<input id="cemeteryAddress" class="swal2-input">' +
        '<span class="swal2-input-label">Cause Of Death</span>' +
        '<input id="causeOfDeath" class="swal2-input">' +
        '<span class="swal2-input-label">Has Received Sacrament</span>' +
        '<input id="receivedSacrament" class="swal2-input" type="checkbox">' +
        "<h3>Church Record</h3>" +
        '<span class="swal2-input-label">Book No</span>' +
        '<input id="bookNo" class="swal2-input" type="number">' +
        '<span class="swal2-input-label">Page No</span>' +
        '<input id="pageNo" class="swal2-input" type="number">' +
        '<span class="swal2-input-label">Line No</span>' +
        '<input id="lineNo" class="swal2-input" type="number">' +
        '<span class="swal2-input-label">Date Recorded</span>' +
        '<input id="dateRecorded" class="swal2-input" type="date">' +
        '<div id="empty" class="error-text"> </div>' +
        '<div id="invalidAge" class="error-text"> </div>',
      preConfirm: () => {
        getById("age").value = getById("age").value.replace(/[^0-9]/g, "");

        let newName = inputGetter("fullname");
        let newDayOfBirth = inputGetter("dayOfBirth");
        let newDayOfDeath = inputGetter("dayOfDeath");
        let newDateOfMass = inputGetter("dateOfMass");
        let newAge = inputGetter("age");

        let address = inputGetter("address");
        let father = inputGetter("father");
        let mother = inputGetter("mother");
        let spouse = inputGetter("spouse");
        let cemetery = inputGetter("cemetery");
        let cemeteryAddress = inputGetter("cemeteryAddress");
        let dateOfBurial = inputGetter("dateOfBurial");
        let causeOfDeath = inputGetter("causeOfDeath");
        let bookNo = inputGetter("bookNo");
        let pageNo = inputGetter("pageNo");
        let lineNo = inputGetter("lineNo");
        let dateRecorded = inputGetter("dateRecorded");

        let ageValid = newAge.length > 0 && newAge > 0;
        if (!ageValid)
          getById("invalidAge").innerHTML =
            "Please make sure that the age you entered is a valid number";
        else getById("invalidAge").innerHTML = " ";

        let noempty =
          newName.length > 0 &&
          newDayOfBirth.length > 0 &&
          newDayOfDeath.length > 0 &&
          newDateOfMass.length > 0 &&
          newAge.length > 0 &&
          address.length > 0 &&
          father.length > 0 &&
          mother.length > 0 &&
          spouse.length > 0 &&
          cemetery.length > 0 &&
          cemeteryAddress.length > 0 &&
          dateOfBurial.length > 0 &&
          causeOfDeath.length > 0 &&
          bookNo.length > 0 &&
          pageNo.length > 0 &&
          lineNo.length > 0 &&
          dateRecorded.length > 0;

        if (!noempty) getById("empty").innerHTML = "Complete all fields";
        else getById("empty").innerHTML = " ";

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

        let address = inputGetter("address");
        let father = inputGetter("father");
        let mother = inputGetter("mother");
        let spouse = inputGetter("spouse");
        let cemetery = inputGetter("cemetery");
        let cemeteryAddress = inputGetter("cemeteryAddress");
        let dateOfBurial = inputGetter("dateOfBurial");
        let causeOfDeath = inputGetter("causeOfDeath");
        let receivedSacrament = inputGetter("receivedSacrament");
        let bookNo = inputGetter("bookNo");
        let pageNo = inputGetter("pageNo");
        let lineNo = inputGetter("lineNo");
        let dateRecorded = inputGetter("dateRecorded");

        submit({
          name: newName,
          dayOfDeath: newDayOfDeath,
          dayOfBirth: newDayOfBirth,
          dateOfMass: newDateOfMass,
          age: newAge,
          address: address,
          father: father,
          mother: mother,
          spouse: spouse,
          cemetery: cemetery,
          cemeteryAddress: cemeteryAddress,
          dateOfBurial: dateOfBurial,
          causeOfDeath: causeOfDeath,
          receivedSacrament: receivedSacrament,
          bookNo: bookNo,
          pageNo: pageNo,
          lineNo: lineNo,
          dateRecorded: dateRecorded,
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
        getById("phone").value = getById("phone").value.replace(/[^0-9]/g, "");

        let fullname = inputGetter("fullname");
        let address = inputGetter("address");
        let phone = inputGetter("phone");

        let phoneValid = phone.length === 11;
        if (!phoneValid)
          getById("invalidPhone").innerHTML =
            "Please make sure that the phone number you entered is a valid phone number, Sample: 09xxxxxxxxx";
        else getById("invalidPhone").innerHTML = "";

        let noempty =
          fullname.length > 0 && address.length > 0 && phone.length > 0;

        if (!noempty) getById("empty").innerHTML = "Complete all fields";
        else getById("empty").innerHTML = " ";

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

  function eventDialog() {
    Swal.fire({
      title: "Enter Details",
      html:
        '<span class="swal2-input-label">Title</span>' +
        '<input id="title" class="swal2-input">' +
        '<span class="swal2-input-label">Date</span>' +
        '<input id="date" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Content</span>' +
        '<textarea id="post-content" class="swal2-input"></textarea>' +
        '<div id="empty" class="error-text"> </div>',
      showCancelButton: true,
      preConfirm: () => {
        let title = inputGetter("title");
        let content = inputGetter("post-content");
        let date = inputGetter("date");

        let noempty = title.length > 0 && content.length > 0 && date.length > 0;

        if (!noempty) getById("empty").innerHTML = "Complete all fields";
        else getById("empty").innerHTML = " ";

        return noempty;
      },
    }).then((value) => {
      if (value.isConfirmed) {
        submit({
          title: inputGetter("title"),
          date: inputGetter("date"),
          content: inputGetter("post-content"),
        });
      }
    });
  }

  function scheduleDialog() {
    Swal.fire({
      title: "Create a Schedule",
      html:
        '<span class="swal2-input-label">Day</span>' +
        '<input id="day" class="swal2-input" placeholder="sunday">' +
        `<div id="times">
        <span class="swal2-input-label">Times</span>
        <input class="swal2-input" type="time">
        </div>` +
        `<div style="margin: 20px">
          <button id="add-time" class="action-button">add time</button>
          <button id="remove-time" class="action-button">remove time</button>
        <div>` +
        "" +
        '<div id="empty" class="error-text"> </div>',
      showCancelButton: true,
      didOpen: () => {
        getById("add-time").onclick = () => {
          let timeInput = document.createElement("input");
          timeInput.classList.add("swal2-input");
          timeInput.type = "time";
          getById("times").appendChild(timeInput);
        };
        getById("remove-time").onclick = () =>
          getById("times").removeChild(getById("times").lastChild);
      },
      preConfirm: () => {
        let day = inputGetter("day");

        let noempty = day.length > 0;

        document.querySelectorAll("input[type='time']").forEach((element) => {
          if (formatTime(element.value).length < 8) {
            noempty = false;
          }
        });

        if (!noempty) getById("empty").innerHTML = "Complete all fields";
        else getById("empty").innerHTML = " ";

        return noempty;
      },
    }).then((value) => {
      if (value.isConfirmed) {
        let record = { day: inputGetter("day") };

        document.querySelectorAll("input[type='time']").forEach((element) => {
          record[`time${Object.keys(record).length}`] = formatTime(
            element.value
          );
        });

        submit(record);
      }
    });
  }

  return show ? (
    <div className="action-bar">
      {selected !== "events" ? (
        <span className="search-bar">
          <input
            type="text"
            className="search-field"
            id="search-field"
            onChange={() =>
              search(document.getElementById("search-field").value)
            }
          />
          <div
            className="action-button"
            title="Search"
            onClick={() =>
              search(document.getElementById("search-field").value)
            }
          >
            <h4>Search</h4>
          </div>
        </span>
      ) : (
        ""
      )}
      {selected !== "events" && selected !== "donation" ? (
        <span className="archive-bar">
          <ToggleSwitch toggle={toggleArchive} label="Toggle Archive" />
          {showArchive ? (
            <ToggleSwitch toggle={toggleSelectMode} label="Multi Select" />
          ) : (
            ""
          )}
        </span>
      ) : (
        ""
      )}
      <div className="action-button-container">
        {showArchive && isSelect ? (
          <span
            className="action-button add-record"
            title="Archive selected"
            onClick={() => {
              archiveSelected();
            }}
          >
            {addingRecord ? (
              <MiniLoader />
            ) : (
              <img src={archive} alt="add" className="icon" />
            )}
            <h4> {isArchive ? "Un-Archive" : "Archive"}</h4>
          </span>
        ) : (
          <span></span>
        )}
        {selected !== "donation" && selected !== "requests" ? (
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
                case "events":
                  eventDialog();
                  break;
                case "schedule":
                  scheduleDialog();
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
            <h4>Add </h4>
          </span>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  ) : (
    ""
  );
}
