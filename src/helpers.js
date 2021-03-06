import Swal from "sweetalert2";

export function inputGetter(id) {
  return document.getElementById(id).value;
}

export function getById(id) {
  return document.getElementById(id);
}

export async function customAlert(message, icon) {
  await Swal.fire({
    title: message,
    icon: icon,
  });
}

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function toDateTime(secs) {
  var t = new Date(1970, 0, 1);
  t.setSeconds(secs);
  return t;
}

export function calculateAgeInYears(date) {
  var now = new Date();
  var current_year = now.getFullYear();
  var year_diff = current_year - date.getFullYear();
  var birthday_this_year = new Date(
    current_year,
    date.getMonth(),
    date.getDate()
  );
  var has_had_birthday_this_year = now >= birthday_this_year;

  return has_had_birthday_this_year ? year_diff : year_diff - 1;
}

export function calculateAgeInYearsDeath(date, death) {
  var now = new Date(death);
  var current_year = now.getFullYear();
  var year_diff = current_year - date.getFullYear();
  var birthday_this_year = new Date(
    current_year,
    date.getMonth(),
    date.getDate()
  );
  var has_had_birthday_this_year = now >= birthday_this_year;

  return has_had_birthday_this_year ? year_diff : year_diff - 1;
}

export function formatTime(timeStr) {
  const hours = timeStr.substring(0, 2);
  const mins = timeStr.substring(3, 5);

  const isTwelve = parseInt(hours) === 0 || parseInt(hours) === 12;
  const isPM = parseInt(hours) >= 12;

  return `${
    isTwelve ? "12" : isPM ? `0${parseInt(hours) % 12}` : hours
  }:${mins} ${isPM ? "PM" : "AM"}`;
}

export function convertTime12to24(time12h) {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
}

export function attributeSorter(selected, obj) {
  let sortingArray = [];

  switch (selected) {
    case "marriage":
      sortingArray = [
        "wifeName",
        "wifeAge",
        "wifeBirthday",
        "wifeReligion",
        "wifePlaceOfBirth",
        "husbandName",
        "husbandAge",
        "husbandBirthday",
        "husbandReligion",
        "husbandPlaceOfBirth",
        "marriageDate",
        "priest",
        "witness",
        "residence",
        "licenseNo",
        "bookNo",
        "pageNo",
        "lineNo",
        "dateIssued",
      ];
      break;
    case "death":
      sortingArray = [
        "name",
        "dayOfBirth",
        "dayOfDeath",
        "dateOfMass",
        "age",
        "address",
        "father",
        "mother",
        "spouse",
        "cemetery",
        "cemeteryAddress",
        "receivedSacrament",
        "address",
        "bookNo",
        "pageNo",
        "lineNo",
        "dateRecorded",
      ];
      break;
    case "requests":
      sortingArray = [
        "firstName",
        "lastName",
        "address",
        "requestedDocument",
        "requestMethod",
        "wifeName",
        "husbandName",
        "fullname",
      ];
      break;
    case "donation":
      sortingArray = [
        "firstName",
        "lastName",
        "gender",
        "address",
        "city",
        "country",
        "phoneNumber",
        "amount",
        "gcashNumber",
        "email",
      ];
      break;

    default:
      return Object.keys(obj).sort((a, b) => {
        if (a.length !== b.length) {
          return a.length - b.length;
        } else {
          return a > b;
        }
      });
  }

  return Object.keys(obj).sort(
    (a, b) => sortingArray.indexOf(a) - sortingArray.indexOf(b)
  );
}

export function chunkArray(inputArray) {
  let perChunk = 5;

  let result = inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  return result;
}

export function convertCamelCase(word) {
  try {
    word = word.charAt(0).toUpperCase() + word.slice(1);
    word = word.match(/[A-Z][a-z]+|[0-9]+/g).join(" ");
    return word;
  } catch {
    return word;
  }
}

export const showArchive = (selected) =>
  !["events", "donation", ""].includes(selected);
