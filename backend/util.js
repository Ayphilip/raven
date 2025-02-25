import { Oracle } from "@chopinframework/core";
import {
    db,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    getDocs,
    query,
    orderBy,
    where,
    arrayRemove,
    arrayUnion,
    serverTimestamp,
    Timestamp,
} from "./config/firebaseConfig.js";


// import { Oracle } from "chopinframework";
// import { Timestamp } from "./config/firebaseConfig";

// export const randomNumber = async() => {
//     const result = await Oracle.random()
//     return result
// }

export const genId = async () => {
    var oracle = new Oracle('http://localhost:4000');
    var Id = await oracle.notarize(() => crypto.randomUUID())
    // var addr = await useAddress().
    // console.log(addr.address)

    return Id;
};

export const genId2 = async () => {
    var oracle = new Oracle('http://localhost:4000');
    // var Id = await oracle.notarize(() =>crypto.randomUUID())
    // var name = await oracle.random(50)
    // var Id = await oracle.now()
    // var Id = await oracle.random()
    var Id = await oracle.notarize(() => {

        return 'Hello World'
    }
    )
    // var id = await Oracle.notarize(() =>crypto.randomUUID())
    // var id = crypto.randomUUID()
    // var addr = await useAddress().
    // console.log(addr.address)

    return Id;
};

// export const timeStampsChopin = async () => {
//     var time = Timestamp.now()
//     return time;
// }


export const sendNotification = async (users, message, type) => {
    try {
        //type 0 = Tweet Notification
        //type 1 = Quest Notification
        await Promise.all(users.map(async (use) => {

            const initId = await genId();
            const notificationData = {
                id: initId,
                message,
                type,
                isRead: false,
                timestamp: Timestamp.now()
            };

            const userNotifRef = doc(db, "notifications", use);
            const userNotifDoc = await getDoc(userNotifRef);

            if (!userNotifDoc.exists()) {
                await setDoc(userNotifRef, { userId, notifications: [notificationData] });
            } else {
                await updateDoc(userNotifRef, { notifications: arrayUnion(notificationData) });
            }
        }));
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};
