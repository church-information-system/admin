import { collection, getDocs, addDoc } from "firebase/firestore";
import { firestore } from "../App";

export async function fetchCollection(collectionName) {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    let datas = [];
    querySnapshot.forEach((doc) => {
        let data = doc.data()
        data["id"] = doc.id
        datas.push(data)
    });
    return datas;
}

export async function addRecord(collectionName, record) {
    let success
    try {
        await addDoc(collection(firestore, collectionName), record);
        success = true
    } catch (e) {
        success = false
    }
    return success
}