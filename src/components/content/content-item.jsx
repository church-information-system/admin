import Swal from "sweetalert2";

import print from "../../assets/print.svg";
import edit from "../../assets/edit.svg";
import archive from "../../assets/archive.svg";
import upload from "../../assets/upload.svg";
import confirm from "../../assets/confirm.svg";
import email from "../../assets/email.svg";
import {
  archiveRecord,
  editRecord,
  getFile,
  hasCertificate,
  uploadFile,
} from "../../api/FirebaseHelper";
import {
  attributeSorter,
  convertCamelCase,
  convertTime12to24,
  customAlert,
  formatTime,
  getById,
  inputGetter,
} from "../../helpers";
import emailJS from "emailjs-com";
import { useEffect, useRef, useState } from "react";
import { MiniLoader } from "../misc/loader";
import ContentTable from "../misc/content-table/content-table";
import CheckBox from "../misc/checkbox/checkbox";

export default function ContentItem({
  record,
  selected,
  requestRefresh,
  isArchive,
  isSelect,
  addToSelected,
  removeFromSelected,
}) {
  const [updating, setUpdating] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmingDonation, setConfirmingDonation] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const [hasCert, setHasCert] = useState(false);
  const [image, setImage] = useState(false);

  const [showOthers, setShowOthers] = useState(false);

  let dontShow = ["id", "dateDocumentAdded", "seen", "referrence", "verified"];

  let showEdit = !["requests", "donation", ""].includes(selected);
  let showArchive = !["events", "donation", ""].includes(selected);
  let showPrint = !["events", "donation", ""].includes(selected);
  let showUpload = !["schedule", "donation", "requests", ""].includes(selected);
  let showConfirmDonation = selected === "donation";
  let showEmailRequest = selected === "requests";

  let showTable = !["events", "schedule", ""].includes(selected);

  const showProperty = (key) => {
    if (!showTable) return !dontShow.includes(key);
    else return key.toLowerCase().includes("name");
  };

  function check(value) {
    setIsChecked(() => value);
    if (value) {
      addToSelected(record);
    } else {
      removeFromSelected(record);
    }
  }

  const form = useRef();

  useEffect(() => {
    async function checkCert() {
      let res = await hasCertificate(
        record.referrence !== undefined ? record.referrence : record.id,
        selected
      );
      setHasCert(() => res);
    }
    checkCert();

    function markSeen() {
      record["seen"] = true;
      editRecord(selected, record.id, record);
    }

    if (
      ["requests", "donation"].includes(selected.toLowerCase()) &&
      record["seen"] !== true
    ) {
      markSeen();
    }

    async function getImage() {
      let imgSrc = await getFile(record.id, "events", "jpg");
      setImage(() => imgSrc);
    }

    if (selected === "events") {
      getImage();
    }
  }, [record.id, isArchive, selected, record]);

  async function submit(values, override = false) {
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

  async function submitFile(file, type) {
    setUploading(() => true);
    await uploadFile(
      record.referrence !== undefined ? record.referrence : record.id,
      file,
      selected,
      type
    );
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
    key = convertCamelCase(key);

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
        "<h3>Date Of Marriage</h3>" +
        '<input id="marriageDate" class="swal2-input" type="date">' +
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
        getById("marriageDate").value = record.marriageDate;
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

        let marriageDate = inputGetter("marriageDate");

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
          marriageDate.length > 0;

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
          wifeReligion === record.wifeReligion &&
          marriageDate === record.marriageDate;

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
          marriageDate: inputGetter("marriageDate"),
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
      backdrop: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: (value) => {
        let isValid = value !== null && value.type === "application/pdf";
        if (!isValid) getById("invalid").innerHTML = "choose a pdf file";
        return isValid ? value : false;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        submitFile(result.value, "pdf");
      }
    });
  }

  function uploadImage() {
    Swal.fire({
      title: "Upload Image",
      input: "file",
      html: "<span id='invalid' class='error-text'></span>",
      showCancelButton: true,
      confirmButtonText: "Upload",
      showLoaderOnConfirm: true,
      backdrop: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: (value) => {
        let isValid = value !== null && value.type.includes("image");
        if (!isValid) getById("invalid").innerHTML = "choose an image";
        return isValid ? value : false;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        submitFile(result.value, "jpg");
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

  const sendEmail = () => {
    emailJS
      .sendForm(
        "service_iredyvh",
        "template_cf0wjy5",
        form.current,
        "user_NRZC9vjUaHFQ7n72dO765"
      )
      .then(
        () => {
          customAlert("Email has been sent", "success");
          setVerified();
          setConfirmingDonation(false);
        },
        (error) => {
          customAlert("Something went wrong", "error");
          setConfirmingDonation(false);
        }
      );

    emailJS.sendForm(
      "service_iredyvh",
      "template_tpwuinn",
      form.current,
      "user_NRZC9vjUaHFQ7n72dO765"
    );
  };

  function setVerified() {
    record.verified = true;
    editRecord("donation", record.id, record);
  }

  return (
    <div
      className="content-item"
      onClick={() => setShowOthers((current) => !current)}
    >
      <div className="content-details">
        <div className="record-datas">
          {attributeSorter(selected, record).map((key) => {
            if (showProperty(key)) return recordDetail(key, record[key]);
            else return null;
          })}
        </div>
        <span>
          <div className="icons-container">
            {isSelect ? (
              <CheckBox isChecked={isChecked} onChange={check} />
            ) : (
              ""
            )}
            <ActionButton
              isShown={showEmailRequest}
              isLoading={false}
              icon={email}
              title="email"
              onClick={async (e) => {
                window.open(
                  `mailto:${record.emailAddress}?subject=${record.requestedDocument} request&body=`
                );
              }}
            />
            <ActionButton
              isShown={showPrint && hasCert}
              isLoading={false}
              title={print}
              icon={print}
              onClick={async () => {
                let file = await getFile(
                  record.referrence !== undefined
                    ? record.referrence
                    : record.id,
                  selected,
                  "pdf"
                );
                window.open(file);
              }}
            />
            <form ref={form} className="no-display">
              <input type="email" name="user_email" value={record.email} />
              <input
                type="email"
                name="admin_email"
                defaultValue={"fdoreennicole@gmail.com"}
              />
              <input type="text" name="donor" defaultValue={record.firstName} />
            </form>
            <ActionButton
              isShown={showConfirmDonation && record.verified !== true}
              isLoading={confirmingDonation}
              icon={confirm}
              title="confirm"
              onClick={async () => {
                setConfirmingDonation(() => true);
                sendEmail();
              }}
            />
            <ActionButton
              isShown={showUpload}
              isLoading={uploading}
              icon={upload}
              title="upload"
              onClick={async () => {
                if (selected === "events") {
                  uploadImage();
                } else {
                  uploadDialog();
                }
              }}
            />

            <ActionButton
              isShown={showEdit}
              isLoading={updating}
              icon={edit}
              title="edit"
              onClick={(event) => {
                console.log(event);
                // e.stopPropagation();
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
                }
              }}
            />
            <ActionButton
              isShown={showArchive}
              isLoading={archiving}
              icon={archive}
              title="archive"
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
          </div>
        </span>
      </div>
      {showOthers && showTable ? (
        <ContentTable
          columns={attributeSorter(selected, record).filter(
            (key) =>
              ![...dontShow].includes(key) &&
              !key.toString().toLowerCase().includes("name")
          )}
          data={record}
        />
      ) : (
        ""
      )}
      {selected === "events" && image !== null ? (
        <img src={image} alt="" className="event-image" />
      ) : (
        ""
      )}
    </div>
  );
}

function ActionButton({ isShown, isLoading, icon, onClick, title }) {
  return isShown ? (
    <div className="icon-container">
      {isLoading ? (
        <MiniLoader />
      ) : (
        <img
          src={icon}
          title={title}
          alt={title}
          className="icon"
          onClick={(event) => {
            event.stopPropagation();
            onClick();
          }}
        />
      )}
    </div>
  ) : (
    ""
  );
}
