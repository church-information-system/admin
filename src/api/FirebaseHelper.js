import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { firestore, storage } from "../App";

export async function getFile(id, directory) {
  return await getDownloadURL(ref(storage, `${directory}/${id}.pdf`));
}

export async function uploadCert(id, file, directory) {
  return await uploadBytes(ref(storage, `${directory}/${id}.pdf`), file);
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

export async function editRecord(collectionName, docId, value) {
  let success;
  try {
    await updateDoc(doc(collection(firestore, collectionName), docId), value);
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

export async function archiveRecord(
  currentCollectionName,
  targetCollectionName,
  docId,
  record
) {
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
