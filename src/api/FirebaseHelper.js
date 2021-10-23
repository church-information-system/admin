import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../App";

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
  console.log("adding record")
  console.log(record)
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
