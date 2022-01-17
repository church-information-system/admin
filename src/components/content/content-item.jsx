import Swal from "sweetalert2";

import print from "../../assets/print.svg";
import edit from "../../assets/edit.svg";
import archive from "../../assets/archive.svg";
import upload from "../../assets/upload.svg";
import confirm from "../../assets/confirm.svg";
import email from "../../assets/email.svg";
import download from "../../assets/download.svg";

import deathCert from "../../documents/death_cert.docx";
import marriageCert from "../../documents/marriage_cert.docx";
import marriageCertPdf from "../../documents/marriage_cert_empty.pdf";
import deathCertPdf from "../../documents/death_cert_empty.pdf";

import {
  archiveRecord,
  editRecord,
  getFile,
  uploadFile,
} from "../../api/FirebaseHelper";
import {
  attributeSorter,
  calculateAgeInYears,
  calculateAgeInYearsDeath,
  convertCamelCase,
  convertTime12to24,
  customAlert,
  formatTime,
  getById,
  inputGetter,
} from "../../helpers";
import { useEffect, useState } from "react";
import { MiniLoader } from "../misc/loader";
import ContentTable from "../misc/content-table/content-table";
import CheckBox from "../misc/checkbox/checkbox";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

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

  const [image, setImage] = useState("");

  const [showOthers, setShowOthers] = useState(false);

  let dontShow = ["id", "dateDocumentAdded", "seen", "referrence", "verified"];

  let showEdit = !["requests", ""].includes(selected);
  let showArchive = !["events", "donation", ""].includes(selected);
  let showPrint = ["death", "marriage", ""].includes(selected);
  let showUpload = ["events"].includes(selected);
  let showConfirmDonation = selected === "donation";
  let showEmailRequest = selected === "requests";

  let showTable = !["events", "schedule", ""].includes(selected);

  const showProperty = (key) => {
    if (!showTable) return !dontShow.includes(key);
    else
      return (
        key.toLowerCase().includes("name") ||
        key.toLowerCase().includes("gcashnumber")
      );
  };

  function check(value) {
    setIsChecked(() => value);
    if (value) {
      addToSelected(record);
    } else {
      removeFromSelected(record);
    }
  }

  useEffect(() => {
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

  const generateDocument = async () => {
    loadFile(
      selected === "marriage" ? marriageCert : deathCert,
      function (error, content) {
        if (error) {
          throw error;
        }
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        if (selected === "marriage") {
          let marriageDate = new Date(record.marriageDate);
          let dateIssued = new Date(record.dateIssued);

          doc.render({
            husbandName: record.husbandName,
            husbandAge: calculateAgeInYears(new Date(record.husbandBirthday)),
            husbandBirthday: record.husbandBirthday,
            husbandPlaceOfBirth: record.husbandPlaceOfBirth,
            husbandReligion: record.husbandReligion,
            husbandResidence: record.husbandResidence,
            husbandFather: record.husbandFather,
            husbandMother: record.husbandMother,
            wifeName: record.wifeName,
            wifeAge: calculateAgeInYears(new Date(record.wifeBirthday)),
            wifeBirthday: record.wifeBirthday,
            wifePlaceOfBirth: record.wifePlaceOfBirth,
            wifeReligion: record.wifeReligion,
            wifeResidence: record.wifeResidence,
            wifeFather: record.wifeFather,
            wifeMother: record.wifeMother,
            md: marriageDate.getDate(),
            mm: marriageDate.toLocaleDateString("default", { month: "long" }),
            my: marriageDate.getFullYear(),
            priest: record.priest,
            witness: record.witness,
            residence: record.residence,
            licenseNo: record.licenseNo,
            bookNo: record.bookNo,
            pageNo: record.pageNo,
            lineNo: record.lineNo,
            dateIssued: record.dateIssued,
            dIssued: dateIssued.getDate(),
            mIssued: dateIssued.toLocaleDateString("default", {
              month: "long",
            }),
            yIssued: dateIssued.getFullYear(),
          });
          const out = doc.getZip().generate({
            type: "blob",
            mimeType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          saveAs(out, `${record.husbandName}_${record.wifeName}.docx`);
        } else {
          let dayOfDeath = new Date(record.dayOfDeath);
          let dateOfBurial = new Date(record.dateOfBurial);

          doc.render({
            name: record.name,
            dd: dayOfDeath.getDate(),
            dm: dayOfDeath.toLocaleDateString("default", { month: "long" }),
            dy: dayOfDeath.getFullYear(),
            dayOfBirth: record.dayOfBirth,
            dateOfMass: record.dateOfMass,
            age: calculateAgeInYearsDeath(
              new Date(record.dayOfBirth),
              record.dayOfDeath
            ),
            address: record.address,
            father: record.father,
            mother: record.mother,
            spouse: record.spouse,
            cemetery: record.cemetery,
            cemeteryAddress: record.cemeteryAddress,
            dateOfBurial: record.dateOfBurial,
            bd: dateOfBurial.getDate(),
            bm: dateOfBurial.toLocaleDateString("default", { month: "long" }),
            by: dateOfBurial.getFullYear(),
            causeOfDeath: record.causeOfDeath,
            received: record.receivedSacrament ? "was" : "was not",
            bookNo: record.bookNo,
            pageNo: record.pageNo,
            lineNo: record.lineNo,
            dateRecorded: record.dateRecorded,
          });
          const out = doc.getZip().generate({
            type: "blob",
            mimeType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          saveAs(out, `${record.name}.docx`);
        }
      }
    );
  };

  async function openPdf() {
    if (selected === "death") {
      loadFile(deathCertPdf, async (error, content) => {
        if (error) {
          return;
        }
        const pdfDoc = await PDFDocument.load(content);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        let dayOfDeath = new Date(record.dayOfDeath);
        let dateOfBurial = new Date(record.dateOfBurial);
        function draw(value, x, y) {
          if (value === undefined || value === null) value = "";
          firstPage.drawText(value.toString(), {
            x: x,
            y: y,
            size: 11,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
        }

        let records = [
          { value: record.name, x: 260, y: 570 },
          { value: dayOfDeath.getDate(), x: 122, y: 453 },
          {
            value: dayOfDeath.toLocaleDateString("default", { month: "long" }),
            x: 230,
            y: 453,
          },
          { value: dayOfDeath.getFullYear(), x: 356, y: 453 },
          {
            value: calculateAgeInYearsDeath(
              new Date(record.dayOfBirth),
              record.dayOfDeath
            ),
            x: 479,
            y: 453,
          },
          { value: record.address, x: 175, y: 540 },
          { value: record.mother, x: 398, y: 510 },
          { value: record.father, x: 189, y: 510 },
          { value: record.spouse, x: 261, y: 481 },
          { value: record.cemetery, x: 180, y: 425 },
          { value: record.cemeteryAddress, x: 67, y: 395 },
          { value: dateOfBurial.getDate(), x: 402, y: 395 },
          {
            value: dateOfBurial.toLocaleDateString("default", {
              month: "long",
            }),
            x: 462,
            y: 395,
          },
          { value: dateOfBurial.getFullYear(), x: 535, y: 395 },
          { value: record.causeOfDeath, x: 191, y: 376 },
          {
            value: record.receivedSacrament ? "was" : "was not",
            x: 178,
            y: 315,
          },
          { value: record.bookNo, x: 231, y: 256 },
          { value: record.pageNo, x: 312, y: 256 },
          { value: record.lineNo, x: 391, y: 256 },
          { value: record.dateRecorded, x: 354, y: 228 },
        ];

        records.forEach((rec) => {
          draw(rec.value, rec.x, rec.y);
        });

        const outputBase64 = pdfDoc.saveAsBase64();

        let pdfWindow = window.open("");
        pdfWindow.document.write(
          "<style>body{margin:0; padding:0}iframe{border:none;margin:0;padding:0}</style><iframe width='100%' height='100%' border=none src='data:application/pdf;base64, " +
            encodeURI(await outputBase64) +
            "'></iframe>"
        );
      });
    } else if (selected === "marriage") {
      loadFile(marriageCertPdf, async (error, content) => {
        if (error) {
          return;
        }
        const pdfDoc = await PDFDocument.load(content);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        let marriageDate = new Date(record.marriageDate);
        let dateIssued = new Date(record.dateIssued);
        function draw(value, x, y) {
          firstPage.drawText(value.toString(), {
            x: x,
            y: y,
            size: 11,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
        }

        let records = [
          { value: record.husbandName, x: 75, y: 574 },
          {
            value: calculateAgeInYears(new Date(record.husbandBirthday)),
            x: 90,
            y: 549,
          },
          { value: record.husbandPlaceOfBirth, x: 106, y: 524 },
          { value: record.husbandResidence, x: 112, y: 499 },
          { value: record.husbandFather, x: 106, y: 476 },
          { value: record.husbandMother, x: 105, y: 452 },
          { value: record.wifeName, x: 329, y: 574 },
          {
            value: calculateAgeInYears(new Date(record.wifeBirthday)),
            x: 329,
            y: 549,
          },
          { value: record.wifePlaceOfBirth, x: 329, y: 524 },
          { value: record.wifeResidence, x: 329, y: 501 },
          { value: record.wifeFather, x: 329, y: 476 },
          { value: record.wifeMother, x: 329, y: 452 },
          { value: marriageDate.getDate(), x: 105, y: 350 },
          {
            value: marriageDate.toLocaleDateString("default", {
              month: "long",
            }),
            x: 253,
            y: 349,
          },
          { value: marriageDate.getFullYear(), x: 461, y: 350 },
          { value: record.priest, x: 256, y: 325 },
          { value: record.witness, x: 171, y: 300 },
          { value: record.residence, x: 165, y: 277 },
          { value: record.licenseNo, x: 359, y: 202 },
          { value: record.bookNo, x: 217, y: 226 },
          { value: record.pageNo, x: 315, y: 226 },
          { value: record.lineNo, x: 401, y: 226 },
          { value: dateIssued.getDate(), x: 181, y: 177 },
          {
            value: dateIssued.toLocaleDateString("default", {
              month: "long",
            }),
            x: 324,
            y: 177,
          },
          { value: dateIssued.getFullYear(), x: 441, y: 177 },
        ];

        records.forEach((rec) => {
          draw(rec.value, rec.x, rec.y);
        });

        const outputBase64 = pdfDoc.saveAsBase64();

        let pdfWindow = window.open("");
        pdfWindow.document.write(
          "<style>body{margin:0; padding:0}iframe{border:none;margin:0;padding:0}</style><iframe width='100%' height='100%' border=none src='data:application/pdf;base64, " +
            encodeURI(await outputBase64) +
            "'></iframe>"
        );
      });
    }
  }

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
        <span className="key">{key.toString()}:</span>
        <span className="value">{value.toString()}</span>
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
        '<span class="swal2-input-label">license No</span>' +
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
        '<div id="nothingChanged" class="error-text"> </div>',
      didOpen: () => {
        getById("husbandName").value = record.husbandName;
        getById("husbandBirthday").value = record.husbandBirthday;
        getById("husbandPlaceOfBirth").value = record.husbandPlaceOfBirth;
        getById("husbandReligion").value = record.husbandReligion;
        getById("wifeName").value = record.wifeName;
        getById("wifeBirthday").value = record.wifeBirthday;
        getById("wifePlaceOfBirth").value = record.wifePlaceOfBirth;
        getById("wifeReligion").value = record.wifeReligion;
        getById("marriageDate").value = record.marriageDate;
        getById("husbandResidence").value = record.husbandResidence;
        getById("husbandFather").value = record.husbandFather;
        getById("husbandMother").value = record.husbandMother;
        getById("wifeResidence").value = record.wifeResidence;
        getById("wifeFather").value = record.wifeFather;
        getById("wifeMother").value = record.wifeMother;
        getById("priest").value = record.priest;
        getById("witness").value = record.witness;
        getById("residence").value = record.residence;
        getById("licenseNo").value = record.licenseNo;
        getById("bookNo").value = record.bookNo;
        getById("pageNo").value = record.pageNo;
        getById("lineNo").value = record.lineNo;
        getById("dateIssued").value = record.dateIssued;
      },
      preConfirm: () => {
        // TO ADD
        // birthPlace, address, father, mother, priest, presenceOf, residence,
        // churchRecord{bookNo, pageNo, line}
        // licenseNo
        // dateIssued

        //TODO: add more fields in the actionbar as well

        let husbandName = inputGetter("husbandName");
        let husbandBirthday = inputGetter("husbandBirthday");
        let husbandPlaceOfBirth = inputGetter("husbandPlaceOfBirth");
        let husbandReligion = inputGetter("husbandReligion");
        let husbandResidence = inputGetter("husbandResidence");
        let husbandFather = inputGetter("husbandFather");
        let husbandMother = inputGetter("husbandMother");

        let wifeName = inputGetter("wifeName");
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

        // let husbandResidence = inputGetter("husbandResidence");
        // let husbandFather = inputGetter("husbandFather");
        // let husbandMother = inputGetter("husbandMother");
        // let wifeResidence = inputGetter("wifeResidence");
        // let wifeFather = inputGetter("wifeFather");
        // let wifeMother = inputGetter("wifeMother");
        // let priest = inputGetter("priest");
        // let witness = inputGetter("witness");
        // let residence = inputGetter("residence");
        // let bookNo = inputGetter("bookNo");
        // let pageNo = inputGetter("pageNo");
        // let lineNo = inputGetter("lineNo");
        // let dateRecorded = inputGetter("dateRecorded");

        let noempty =
          husbandName.length > 0 &&
          husbandBirthday.length > 0 &&
          husbandPlaceOfBirth.length > 0 &&
          husbandReligion.length > 0 &&
          wifeName.length > 0 &&
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
          bookNo.length > 0 &&
          pageNo.length > 0 &&
          lineNo.length > 0 &&
          dateIssued.length > 0 &&
          licenseNo.length > 0;

        if (!noempty) getById("empty").innerHTML = "Complete all fields";
        else getById("empty").innerHTML = " ";

        let nothingChanged =
          husbandName === record.husbandName &&
          husbandBirthday === record.husbandBirthday &&
          husbandPlaceOfBirth === record.husbandPlaceOfBirth &&
          husbandReligion === record.husbandReligion &&
          wifeName === record.wifeName &&
          wifeBirthday === record.wifeBirthday &&
          wifePlaceOfBirth === record.wifePlaceOfBirth &&
          wifeReligion === record.wifeReligion &&
          marriageDate === record.marriageDate &&
          husbandResidence === record.husbandResidence &&
          husbandFather === record.husbandFather &&
          husbandMother === record.husbandMother &&
          wifeResidence === record.wifeResidence &&
          wifeFather === record.wifeFather &&
          wifeMother === record.wifeMother &&
          priest === record.priest &&
          witness === record.witness &&
          residence === record.residence &&
          bookNo === record.bookNo &&
          pageNo === record.pageNo &&
          lineNo === record.lineNo &&
          licenseNo === record.licenseNo &&
          dateIssued === record.dateIssued;

        if (nothingChanged)
          getById("nothingChanged").innerHTML = "Change atleast one value";
        else getById("nothingChanged").innerHTML = " ";

        return noempty && !nothingChanged;
      },
      showCancelButton: true,
    }).then((value) => {
      if (value.isConfirmed) {
        submit({
          husbandName: inputGetter("husbandName"),
          husbandBirthday: inputGetter("husbandBirthday"),
          husbandPlaceOfBirth: inputGetter("husbandPlaceOfBirth"),
          husbandReligion: inputGetter("husbandReligion"),
          wifeName: inputGetter("wifeName"),
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
        '<span class="swal2-input-label">Date Of Burial</span>' +
        '<input id="dateOfBurial" class="swal2-input" type="date">' +
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
        '<div id="nothingChanged" class="error-text"> </div>',
      didOpen: () => {
        getById("fullname").value = record.name;
        getById("dayOfDeath").value = record.dayOfDeath;
        getById("dayOfBirth").value = record.dayOfBirth;
        getById("dateOfMass").value = record.dateOfMass;
        getById("address").value = record.address;
        getById("father").value = record.father;
        getById("mother").value = record.mother;
        getById("spouse").value = record.spouse;
        getById("cemetery").value = record.cemetery;
        getById("cemeteryAddress").value = record.cemeteryAddress;
        getById("dateOfBurial").value = record.dateOfBurial;
        getById("causeOfDeath").value = record.causeOfDeath;
        getById("receivedSacrament").checked = record.receivedSacrament;
        getById("bookNo").value = record.bookNo;
        getById("pageNo").value = record.pageNo;
        getById("lineNo").value = record.lineNo;
        getById("dateRecorded").value = record.dateRecorded;
      },
      preConfirm: () => {
        let newName = inputGetter("fullname");
        let newDayOfBirth = inputGetter("dayOfBirth");
        let newDayOfDeath = inputGetter("dayOfDeath");
        let newDateOfMass = inputGetter("dateOfMass");

        let address = inputGetter("address");
        let father = inputGetter("father");
        let mother = inputGetter("mother");
        let spouse = inputGetter("spouse");
        let cemetery = inputGetter("cemetery");
        let cemeteryAddress = inputGetter("cemeteryAddress");
        let dateOfBurial = inputGetter("dateOfBurial");
        let causeOfDeath = inputGetter("causeOfDeath");
        let receivedSacrament = getById("receivedSacrament").checked;
        let bookNo = inputGetter("bookNo");
        let pageNo = inputGetter("pageNo");
        let lineNo = inputGetter("lineNo");
        let dateRecorded = inputGetter("dateRecorded");

        // TO ADD
        // address, father, mother, spouse, cemetery, dateOfBurial, causeOfDeath, receivedSacrament
        // churchRecord{bookNo, pageNo, line, date}

        let noempty =
          newName.length > 0 &&
          newDayOfBirth.length > 0 &&
          newDayOfDeath.length > 0 &&
          newDateOfMass.length > 0 &&
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

        let nothingChanged =
          newName === record.name &&
          newDayOfBirth === record.dayOfBirth &&
          newDayOfDeath === record.dayOfDeath &&
          newDateOfMass === record.dateOfMass &&
          address === record.address &&
          father === record.father &&
          mother === record.mother &&
          spouse === record.spouse &&
          cemetery === record.cemetery &&
          cemeteryAddress === record.cemeteryAddress &&
          dateOfBurial === record.dateOfBurial &&
          causeOfDeath === record.causeOfDeath &&
          receivedSacrament === record.receivedSacrament &&
          bookNo === record.bookNo &&
          pageNo === record.pageNo &&
          lineNo === record.lineNo &&
          dateRecorded === record.dateRecorded;

        if (nothingChanged)
          getById("nothingChanged").innerHTML = "Change atleast one value";
        else getById("nothingChanged").innerHTML = " ";

        return noempty && !nothingChanged;
      },
      showCancelButton: true,
    }).then((value) => {
      if (value.isConfirmed) {
        let newName = inputGetter("fullname");
        let newDayOfBirth = inputGetter("dayOfBirth");
        let newDayOfDeath = inputGetter("dayOfDeath");
        let newDateOfMass = inputGetter("dateOfMass");

        let address = inputGetter("address");
        let father = inputGetter("father");
        let mother = inputGetter("mother");
        let spouse = inputGetter("spouse");
        let cemetery = inputGetter("cemetery");
        let cemeteryAddress = inputGetter("cemeteryAddress");
        let dateOfBurial = inputGetter("dateOfBurial");
        let causeOfDeath = inputGetter("causeOfDeath");
        let receivedSacrament = getById("receivedSacrament").checked;
        let bookNo = inputGetter("bookNo");
        let pageNo = inputGetter("pageNo");
        let lineNo = inputGetter("lineNo");
        let dateRecorded = inputGetter("dateRecorded");

        submit({
          name: newName,
          dayOfDeath: newDayOfDeath,
          dayOfBirth: newDayOfBirth,
          dateOfMass: newDateOfMass,
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
        '<span class="swal2-input-label">First Name</span>' +
        '<input id="fullName" class="swal2-input">' +
        '<span class="swal2-input-label">Verified</span>' +
        '<input id="verified" class="swal2-input" type="checkbox">' +
        '<div id="empty" class="error-text"> </div>' +
        '<div id="nothingChanged" class="error-text"> </div>',
      didOpen: () => {
        getById("fullName").value = record.fullName;
        getById("verified").checked = record.verified;
      },
      preConfirm: () => {
        let fullName = inputGetter("fullName");
        let verified = getById("verified").checked;

        let noempty = fullName.length > 0;

        if (!noempty) getById("empty").innerHTML = "Complete all fields";
        else getById("empty").innerHTML = " ";

        let nothingChanged =
          fullName === record.fullName && verified === record.verified;

        if (nothingChanged)
          getById("nothingChanged").innerHTML = "Change atleast one value";
        else getById("nothingChanged").innerHTML = " ";

        return noempty && !nothingChanged;
      },
      showCancelButton: true,
    }).then((value) => {
      if (value.isConfirmed) {
        let fullName = inputGetter("fullName");
        let verified = getById("verified").checked;

        submit({
          fullName: fullName,
          verified: verified,
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
                  `mailto:${record.emailAddress}?subject=${record.requestedDocument} request&body=Your request has been confirmed`
                );
              }}
            />
            <ActionButton
              isShown={showPrint}
              isLoading={false}
              title="print"
              icon={print}
              onClick={async () => {
                openPdf();
              }}
            />
            <ActionButton
              isShown={showPrint}
              isLoading={false}
              title="download"
              icon={download}
              onClick={async () => {
                generateDocument();
              }}
            />
            <ActionButton
              isShown={showConfirmDonation && record.verified !== true}
              isLoading={false}
              icon={email}
              title="send email"
              onClick={async () => {
                window.open(
                  `mailto:${record.email}?subject=Donation Confirmation&body=Your Donation has been confirmed, thank you for your support`
                );
              }}
            />
            <ActionButton
              isShown={showConfirmDonation && record.verified !== true}
              isLoading={confirmingDonation}
              icon={confirm}
              title="confirm"
              onClick={() => {
                Swal.fire({
                  icon: "question",
                  title: "Do you want to mark this donation as verified?",
                  showCancelButton: true,
                  confirmButtonColor: "red",
                }).then(async (value) => {
                  if (value.isConfirmed) {
                    setConfirmingDonation(() => true);
                    record.verified = true;
                    if (await editRecord("donation", record.id, record)) {
                      customAlert("Donation verified!", "success");
                    }
                    setConfirmingDonation(() => false);
                  }
                });
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
                }
              }}
            />

            <ActionButton
              isShown={showEdit}
              isLoading={updating}
              icon={edit}
              title="edit"
              onClick={(event) => {
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

export function ActionButton({ isShown, isLoading, icon, onClick, title }) {
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
