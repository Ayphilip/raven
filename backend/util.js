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
import CryptoJS from "crypto-js";


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

export const getIsCorrect = async (item1, item2) => {
    try {
        if (!item1 || !item2) {
            console.error("Error: item1 or item2 is undefined.");
            return false;
        }

        var oracle = new Oracle('http://localhost:4000');

        var response = await oracle.notarize(() => {
            try {
                // console.log("Decrypting item1:", item1);
                // console.log("Decrypting item2:", item2);

                var decryptedItem1 = CryptoJS.AES.decrypt(item1, "ravenTestToken").toString(CryptoJS.enc.Utf8);
                var decryptedItem2 = CryptoJS.AES.decrypt(item2, "ravenTestToken").toString(CryptoJS.enc.Utf8);

                // console.log("Decrypted item1:", decryptedItem1);
                // console.log("Decrypted item2:", decryptedItem2);

                return decryptedItem1 === decryptedItem2;
            } catch (error) {
                console.error("Decryption failed:", error);
                return false;
            }
        });

        return response;
    } catch (error) {
        console.error("Error in getIsCorrect:", error);
        return false;
    }
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
