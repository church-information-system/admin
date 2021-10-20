import Swal from "sweetalert2";

export function inputGetter(id) {
    return document.getElementById(id).value;
}

export function getById(id) {
    return document.getElementById(id)
}

export function customAlert(message, icon) {
    Swal.fire({
        title: message,
        icon: icon
    })
}