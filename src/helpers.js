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
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
