import { collection, getDocs } from "firebase/firestore";
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