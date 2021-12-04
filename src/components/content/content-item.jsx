import Swal from "sweetalert2";

import print from "../../assets/print.svg";
import edit from "../../assets/edit.svg";
import archive from "../../assets/archive.svg";
import upload from "../../assets/upload.svg";
import {
  archiveRecord,
  editRecord,
  getFile,
  hasCertificate,
  uploadCert,
} from "../../api/FirebaseHelper";
import {
  convertTime12to24,
  customAlert,
  formatTime,
  getById,
  inputGetter,
} from "../../helpers";
import { useEffect, useState } from "react";
import { MiniLoader } from "../misc/loader";

export default function ContentItem({
  record,
  selected,
  requestRefresh,
  isArchive,
}) {
  const [updating, setUpdating] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasCert, setHasCert] = useState(false);

  useEffect(() => {
    async function checkCert() {
      let res = await hasCertificate(
        record.id,
        selected + (isArchive ? "_archive" : "")
      );
      setHasCert(() => res);
    }
    checkCert();

    function markSeen() {
      record["seen"] = true;
      editRecord(selected, record.id, record);
    }
    if (selected === "requests" && record["seen"] === false) {
      markSeen();
    }
  }, [record.id, isArchive, selected, record]);

  async function submit(values, override = false, silent = false) {
    setUpdating(() => true);
    if (
      await editRecord(
        selected + (isArchive ? "_archive" : ""),
        record.id,
        values,
        override
      )
    ) {
      customAlert("Record Updated!", "success");
      requestRefresh();
    } else {
      customAlert("Failed to update record", "error");
    }
    setUpdating(false);
  }

  async function submitFile(file) {
    setUploading(() => true);
    await uploadCert(record.id, file, selected + (isArchive ? "_archive" : ""));
    setUploading(() => false);
    requestRefresh();
  }

  async function confirmArchive() {
    setArchiving(() => true);
    if (
      await archiveRecord(
        isArchive ? `${selected}_archive` : selected,
        isArchive ? selected : `${selected}_archive`,
        record.id,
        record
      )
    ) {
      customAlert("Record Archived!", "success");
      requestRefresh();
    } else {
      customAlert("Failed to Archive record", "error");
    }
    setArchiving(() => false);
  }

  function recordDetail(key, value) {
    try {
      key = key.charAt(0).toUpperCase() + key.slice(1);
      key = key.match(/[A-Z][a-z]+|[0-9]+/g).join(" ");
    } catch {}

    return (
      <div className="key-value-pair" key={key}>
        <span className="key">{key}:</span>
        <span className="value">{value}</span>
      </div>
    );
  }

  function marriageDialog() {
    Swal.fire({
      title: "Enter Details",
      html:
        "<h3>Enter Husband details:</h4>" +
        '<span class="swal2-input-label">Name</span>' +
        '<input id="husbandName" class="swal2-input">' +
        '<span class="swal2-input-label">Age</span>' +
        '<input id="husbandAge" class="swal2-input" type="number" min="1">' +
        '<span class="swal2-input-label">Birthday</span>' +
        '<input id="husbandBirthday" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Place of Birth</span>' +
        '<input id="husbandPlaceOfBirth" class="swal2-input">' +
        '<span class="swal2-input-label">Religion</span>' +
        '<input id="husbandReligion" class="swal2-input">' +
        "<br></br>" +
        "<h3>Enter Wife details:</h4>" +
        '<span class="swal2-input-label">Name</span>' +
        '<input id="wifeName" class="swal2-input">' +
        '<span class="swal2-input-label">Age</span>' +
        '<input id="wifeAge" class="swal2-input" type="number" min="1">' +
        '<span class="swal2-input-label">Birthday</span>' +
        '<input id="wifeBirthday" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Place of Birth</span>' +
        '<input id="wifePlaceOfBirth" class="swal2-input">' +
        '<span class="swal2-input-label">Religion</span>' +
        '<input id="wifeReligion" class="swal2-input">' +
        '<div id="empty" class="error-text"> </div>' +
        '<div id="nothingChanged" class="error-text"> </div>' +
        '<div id="invalidAge" class="error-text"> </div>',
      didOpen: () => {
        getById("husbandName").value = record.husbandName;
        getById("husbandAge").value = record.husbandAge;
        getById("husbandBirthday").value = record.husbandBirthday;
        getById("husbandPlaceOfBirth").value = record.husbandPlaceOfBirth;
        getById("husbandReligion").value = record.husbandReligion;
        getById("wifeName").value = record.wifeName;
        getById("wifeAge").value = record.wifeAge;
        getById("wifeBirthday").value = record.wifeBirthday;
        getById("wifePlaceOfBirth").value = record.wifePlaceOfBirth;
        getById("wifeReligion").value = record.wifeReligion;
      },
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

        let wifeName = inputGetter("wifeName");
        let wifeAge = inputGetter("wifeAge");
        let wifeBirthday = inputGetter("wifeBirthday");
        let wifePlaceOfBirth = inputGetter("wifePlaceOfBirth");
        let wifeReligion = inputGetter("wifeReligion");

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
          wifeReligion.length > 0;

        if (!noempty) getById("empty").innerHTML = "Complete all fields";
        else getById("empty").innerHTML = " ";

        let nothingChanged =
          husbandName === record.husbandName &&
          husbandAge === record.husbandAge &&
          husbandBirthday === record.husbandBirthday &&
          husbandPlaceOfBirth === record.husbandPlaceOfBirth &&
          husbandReligion === record.husbandReligion &&
          wifeName === record.wifeName &&
          wifeAge === record.wifeAge &&
          wifeBirthday === record.wifeBirthday &&
          wifePlaceOfBirth === record.wifePlaceOfBirth &&
          wifeReligion === record.wifeReligion;

        if (nothingChanged)
          getById("nothingChanged").innerHTML = "Change atleast one value";
        else getById("nothingChanged").innerHTML = " ";

        return noempty && !nothingChanged && ageValid;
      },
      showCancelButton: true,
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
      title: "Edit Details",
      html:
        '<span class="swal2-input-label">Fullname</span>' +
        '<input id="fullname" class="swal2-input">' +
        '<span class="swal2-input-label" type="date">Day Of Death</span>' +
        '<input id="dayOfDeath" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Day Of Birth</span>' +
        '<input id="dayOfBirth" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Date Of Mass</span>' +
        '<input id="dateOfMass" class="swal2-input" type="date">' +
        '<span class="swal2-input-label">Age</span>' +
        '<input id="age" class="swal2-input" type="number" min="1">' +
        '<div id="empty" class="error-text"> </div>' +
        '<div id="nothingChanged" class="error-text"> </div>' +
        '<div id="invalidAge" class="error-text"> </div>',
      didOpen: () => {
        getById("fullname").value = record.name;
        getById("dayOfDeath").value = record.dayOfDeath;
        getById("dayOfBirth").value = record.dayOfBirth;
        getById("dateOfMass").value = record.dateOfMass;
        getById("age").value = record.age;
      },
      preConfirm: () => {
        getById("age").value = getById("age").value.replace(/[^0-9]/g, "");

        let newName = inputGetter("fullname");
        let newDayOfBirth = inputGetter("dayOfBirth");
        let newDayOfDeath = inputGetter("dayOfDeath");
        let newDateOfMass = inputGetter("dateOfMass");
        let newAge = inputGetter("age");

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
          newAge.length > 0;

        if (!noempty) getById("empty").innerHTML = "Complete all fields";
        else getById("empty").innerHTML = " ";

        let nothingChanged =
          newName === record.name &&
          newDayOfBirth === record.dayOfBirth &&
          newDayOfDeath === record.dayOfDeath &&
          newDateOfMass === record.dateOfMass &&
          newAge === record.age;

        if (nothingChanged)
          getById("nothingChanged").innerHTML = "Change atleast one value";
        else getById("nothingChanged").innerHTML = " ";

        return noempty && !nothingChanged && ageValid;
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
        '<input id="phone" class="swal2-input" type="tel" pattern="[+]{1}[0-9]{11,14}">' +
        '<div id="empty" class="error-text"> </div>' +
        '<div id="nothingChanged" class="error-text"> </div>' +
        '<div id="invalidPhone" class="error-text"> </div>',
      didOpen: () => {
        getById("fullname").value = record.name;
        getById("address").value = record.address;
        getById("phone").value = record.phone;
      },
      preConfirm: () => {
        getById("phone").value = getById("phone").value.replace(/[^0-9]/g, "");

        let fullname = inputGetter("fullname");
        let address = inputGetter("address");
        let phone = inputGetter("phone");

        let phoneValid = phone.length === 11;
        if (!phoneValid)
          getById("invalidPhone").innerHTML =
            "Please make sure that the phone number you entered is a valid phone number, Sample: 09xxxxxxxxx";
        else getById("invalidPhone").innerHTML = " ";

        let noempty =
          fullname.length > 0 && address.length > 0 && phone.length > 0;

        if (!noempty) getById("empty").innerHTML = "Complete all fields";
        else getById("empty").innerHTML = " ";

        let nothingChanged =
          fullname === record.name &&
          address === record.address &&
          phone === record.phone;

        if (nothingChanged)
          getById("nothingChanged").innerHTML = "Change atleast one value";
        else getById("nothingChanged").innerHTML = " ";

        return noempty && !nothingChanged && phoneValid;
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
        '<div id="empty" class="error-text"> </div>' +
        '<div id="nothingChanged" class="error-text"> </div>',
      showCancelButton: true,
      didOpen: () => {
        getById("title").value = record.title;
        getById("post-content").value = record.content;
        getById("date").value = record.date;
      },
      preConfirm: () => {
        let title = inputGetter("title");
        let content = inputGetter("post-content");
        let date = inputGetter("date");

        let noempty = title.length > 0 && content.length > 0 && date.length > 0;

        if (!noempty) getById("empty").innerHTML = "Complete all fields";
        else getById("empty").innerHTML = " ";

        let nothingChanged =
          title === record.title &&
          content === record.content &&
          date === record.date;

        if (nothingChanged)
          getById("nothingChanged").innerHTML = "Change atleast one value";
        else getById("nothingChanged").innerHTML = " ";

        return noempty && !nothingChanged;
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

  function uploadDialog() {
    Swal.fire({
      title: "Upload Certificate",
      input: "file",
      html: "<span id='invalid' class='error-text'></span>",
      showCancelButton: true,
      confirmButtonText: "Upload",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: (value) => {
        let isValid = value.type === "application/pdf";
        if (!isValid) getById("invalid").innerHTML = "choose a pdf file";
        return isValid ? value : false;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        submitFile(result.value);
      }
    });
  }

  function scheduleDialog() {
    Swal.fire({
      title: "Edit the Schedule",
      html:
        '<span class="swal2-input-label">Day</span>' +
        '<input id="day" class="swal2-input" placeholder="sunday">' +
        `<div id="times">
        <span class="swal2-input-label">Times</span>
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
        getById("remove-time").onclick = () => {
          let toRemove = getById("times").lastChild;
          toRemove.remove();
        };

        getById("day").value = record.day;

        let timeKeys = Object.keys(record).filter((key) =>
          key.includes("time")
        );
        timeKeys.sort((a, b) => {
          if (a.length !== b.length) {
            return a.length - b.length;
          } else {
            return a > b;
          }
        });

        timeKeys.forEach((key) => {
          let timeInput = document.createElement("input");
          timeInput.classList.add("swal2-input");
          timeInput.type = "time";
          timeInput.value = convertTime12to24(record[key]);
          getById("times").appendChild(timeInput);
        });
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
        let newRecord = { day: inputGetter("day") };

        document.querySelectorAll("input[type='time']").forEach((element) => {
          newRecord[`time${Object.keys(newRecord).length}`] = formatTime(
            element.value
          );
        });

        submit(newRecord, true);
      }
    });
  }

  return (
    <div className="content-item">
      <div className="record-datas">
        {Object.keys(record)
          .sort((a, b) => {
            if (a.length !== b.length) {
              return a.length - b.length;
            } else {
              return a > b;
            }
          })
          .map((key) => {
            if (key !== "id" && key !== "dateDocumentAdded" && key !== "seen")
              return recordDetail(key, record[key]);
            else return null;
          })}
      </div>
      <span>
        <div className="icons-container">
          {selected !== "events" && selected !== "donation" ? (
            <div className="icon-container">
              {hasCert ? (
                <img
                  src={print}
                  title="print"
                  alt=""
                  className="icon"
                  onClick={async () => {
                    let file = await getFile(
                      record.id,
                      selected + (isArchive ? "_archive" : "")
                    );
                    window.open(file);
                  }}
                />
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {selected !== "events" &&
          selected !== "donation" &&
          selected !== "schedule" &&
          selected !== "requests" ? (
            <div className="icon-container">
              {uploading ? (
                <MiniLoader />
              ) : (
                <img
                  src={upload}
                  title="upload"
                  alt="upload"
                  className="icon"
                  onClick={async () => {
                    uploadDialog();
                  }}
                />
              )}
            </div>
          ) : (
            ""
          )}
          {selected !== "requests" && selected !== "donation" ? (
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
                />
              )}
            </div>
          ) : (
            ""
          )}
          {selected !== "events" && selected !== "donation" ? (
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
                      title: `Are you sure you want to ${
                        isArchive ? "un-archive" : "archive"
                      } this record?`,
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: isArchive ? "un-archive" : "archive",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        confirmArchive();
                      }
                    })
                  }
                />
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </span>
    </div>
  );
}
