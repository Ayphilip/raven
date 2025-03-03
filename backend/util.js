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

// export const genId2 = async () => {
//     var oracle = new Oracle('http://localhost:4000');
//     // var Id = await oracle.notarize(() =>crypto.randomUUID())
//     // var name = await oracle.random(50)
//     // var Id = await oracle.now()
//     // var Id = await oracle.random()
//     var Id = await oracle.notarize(() => {

//         return 'Hello World'
//     }
//     )
//     // var id = await Oracle.notarize(() =>crypto.randomUUID())
//     // var id = crypto.randomUUID()
//     // var addr = await useAddress().
//     // console.log(addr.address)

//     return Id;
// };

export const genId = async (req) => {
    const callbackUrl = req.headers["x-callback-url"];
    var oracle = new Oracle(callbackUrl);
    var Id = await oracle.notarize(() => crypto.randomUUID())
    return Id;
};

export const getIsCorrect = async (item1, item2, req) => {
    try {
        if (!item1 || !item2) {
            console.error("Error: item1 or item2 is undefined.");
            return false;
        }
        const callbackUrl = req.headers["x-callback-url"];

        var oracle = new Oracle(callbackUrl);

        var response = await oracle.notarize(() => {
            try {
                // console.log("Decrypting item1:", item1);
                // console.log("Decrypting item2:", item2);

                var decryptedItem1 = CryptoJS.AES.decrypt(item1, "ravenTestToken").toString(CryptoJS.enc.Utf8);
                var decryptedItem2 = CryptoJS.AES.decrypt(item2, "ravenTestToken").toString(CryptoJS.enc.Utf8);

                console.log("Decrypted item1:", decryptedItem1);
                console.log("Decrypted item2:", decryptedItem2);

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

export const getUrlMetaData = async (url, req) => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API Key is missing");
        // console.log(`https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}&api_key=${apiKey}`)
        const apiUrl = `https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}&api_key=${apiKey}`;
        
        const response = await fetch(apiUrl);
        console.log(response.json)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json(); // Return parsed JSON
    } catch (error) {
        console.error("Failed to fetch URL metadata:", error.message);
        return null; // Return null instead of undefined
    }
};

export const getUrlMetaDataOracle = async (url, req) => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API Key is missing");
        // console.log(`https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}&api_key=${apiKey}`)
        const callbackUrl = req.headers["x-callback-url"];

        var oracle = new Oracle(callbackUrl);
        const apiUrl = `https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}&api_key=${apiKey}`;
        var resp = await oracle.fetch(apiUrl)
        // console.log(resp.json)

        // var response = await oracle.notarize(async() => {

            
        //     const response = await fetch(apiUrl);
        //     console.log(response.json)
        //     if (!response.ok) {
        //         // throw new Error(`Error: ${response.status} - ${response.statusText}`);
        //         return null;
        //     }
    
        //     return await response.json(); // Return parsed JSON
        // })
        return resp.json;
    } catch (error) {
        console.error("Failed to fetch URL metadata:", error.message);
        return null; // Return null instead of undefined
    }
};


export const sendNotification = async (users, message, user, type, req) => {
    try {
        //type 0 = Tweet Notification
        //type 1 = Quest Notification
        //type 2 = Follow Notification
        //type 3 = Retweet Notification
        //type 4 = Like notification
        await Promise.all(users.map(async (use) => {

            const initId = await genId(req);
            const notificationData = {
                id: initId,
                message,
                type,
                user: user,
                isRead: false,
                timestamp: Timestamp.now()
            };

            // console.log('Im here')

            const userNotifRef = doc(db, "notifications", use);
            const userNotifDoc = await getDoc(userNotifRef);
            // console.log(use)

            if (!userNotifDoc.exists()) {
                await setDoc(userNotifRef, { use, notifications: [notificationData] });
            } else {
                await updateDoc(userNotifRef, { notifications: arrayUnion(notificationData) });
            }
        }));
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};

/**
 * Search for documents in a Firestore collection using Firebase SDK
 * @param {string} collectionName - Firestore collection name
 * @param {string} query - Search query
 * @param {number} limit - Max results per collection
 * @returns {Promise<object[]>} - Search results
 */
export const searchFirestore = async (collectionName, query, limit, req) => {

    const callbackUrl = req.headers["x-callback-url"];

    var oracle = new Oracle(callbackUrl);
    var response = await oracle.notarize(async () => {
        const results = [];
        const lowercaseQuery = query.toLowerCase();

        // Get reference to the Firestore collection
        const colRef = collection(db, collectionName);
        const snapshot = await getDocs(colRef);

        snapshot.forEach((doc) => {
            const data = doc.data();
            const matchFound = Object.values(data).some(
                (value) =>
                    typeof value === "string" &&
                    value.toLowerCase().includes(lowercaseQuery)
            );

            if (matchFound) {
                results.push({ id: doc.id, ...data });
            }
        });

        return results.slice(0, limit); // Apply limit after filtering
    })
    return response;
};

