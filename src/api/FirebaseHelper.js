import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  addDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import Swal from "sweetalert2";
import { firestore, storage } from "../App";
import { customAlert } from "../helpers";

import loading from "../assets/loading.gif";

export async function getFile(id, directory, type) {
  try {
    return await getDownloadURL(ref(storage, `${directory}/${id}.${type}`));
  } catch (e) {
    return null;
  }
}

export async function uploadFile(id, file, directory, type) {
  return await uploadBytes(ref(storage, `${directory}/${id}.${type}`), file);
}

export async function hasCertificate(id, directory) {
  try {
    await getDownloadURL(ref(storage, `${directory}/${id}.pdf`));
    return true;
  } catch {
    return false;
  }
}

export async function fetchCollection(collectionName) {
  const querySnapshot = await getDocs(collection(firestore, collectionName));
  let datas = [];
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    data["id"] = doc.id;
    datas.push(data);
  });
  return datas;
}

export async function notificationCounter(collectionName, countCallback) {
  onSnapshot(
    query(collection(firestore, collectionName), where("seen", "!=", true)),
    (data) => {
      countCallback(data);
    }
  );
}

export async function recordCounter(collectionName, countCallback) {
  onSnapshot(collection(firestore, collectionName), (data) => {
    countCallback(data);
  });
}

export async function addRecord(collectionName, record) {
  let success;
  record["dateDocumentAdded"] = new Date();
  try {
    await addDoc(collection(firestore, collectionName), record);
    success = true;
  } catch (e) {
    success = false;
  }
  return success;
}

export async function editRecord(collectionName, docId, value, override) {
  let success;
  try {
    if (override) {
      value["dateDocumentAdded"] = new Date();
      await setDoc(doc(collection(firestore, collectionName), docId), value);
    } else {
      await updateDoc(doc(collection(firestore, collectionName), docId), value);
    }
    success = true;
  } catch (e) {
    success = false;
  }
  return success;
}

export async function deleteRecord(collectionName, docId) {
  let success;
  try {
    await deleteDoc(doc(collection(firestore, collectionName), docId));
    success = true;
  } catch (e) {
    success = false;
  }
  return success;
}

export async function archiveMultipleRecords(
  currentCollectionName,
  targetCollectionName,
  records,
  isArchive,
  onFinished
) {
  if (records.length > 0) {
    Swal.fire({
      title: `${
        isArchive ? "Un-Archiving" : "Archiving"
      } multiple records Please wait`,
      html: `<img src="${loading}"/>`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    records.forEach(async (record, index) => {
      await archiveRecord(
        currentCollectionName,
        targetCollectionName,
        record.id,
        record
      );
      if (index === records.length - 1) {
        customAlert(
          `Done ${isArchive ? "Un-Archiving" : "Archiving"}`,
          "success"
        );
        onFinished();
      }
    });
  } else {
    customAlert("Nothing selected", "info");
  }
}

export async function archiveRecord(
  currentCollectionName,
  targetCollectionName,
  docId,
  record
) {
  if (record.referrence === undefined) record["referrence"] = record["id"];
  let success = false;
  try {
    if (await addRecord(targetCollectionName, record)) {
      if (await deleteRecord(currentCollectionName, docId)) {
        success = true;
      }
    }
  } catch (e) {
    success = false;
  }
  return success;
}

export async function login(username, password) {
  let admins = await fetchCollection("admins");
  for (let i = 0; i < admins.length; i++) {
    if (admins[i].username === username && admins[i].password === password) {
      return admins[i].id;
    }
  }
  return false;
}

export async function changePassword(id, oldPassword, newPassword) {
  let admins = await fetchCollection("admins");
  let loggedIn = admins.find((o) => (o.id = id));

  if (loggedIn.password === oldPassword) {
    loggedIn.password = newPassword;
    if (await editRecord("admins", id, loggedIn)) {
      return { success: true, message: "Password Changed, Please login again" };
    } else {
      return { success: false, message: "Failed to Update password" };
    }
  } else {
    return { success: false, message: "Old password didn't match" };
  }
}
