import { db, doc, getDoc, setDoc, updateDoc, collection, getDocs } from "../Components/firebaseConfig";

// CREATE User
export const checkUser = async (userId, privyId, mode, username, name, profilePicture, cover, bio) => {
    const userRef = doc(db, "users", username);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        return snapshot.data();
    } else {
        const userData = {
            userId,
            username,
            name,
            privyId,
            mode,
            cover,
            profilePicture,
            bio,
            followers: [],
            following: [],
            createdAt: new Date()
        };

        await setDoc(userRef, userData);
        const newSnapshot = await getDoc(userRef);
        return newSnapshot.data();
    }
};

export const getAllUsers = async () => {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const users = snapshot.docs.map(doc => ({
        id: doc.id,  // Include the document ID
        ...doc.data()
    }));

    // console.log(users)

    return users;
};




// UPDATE User
export const updateUser = async (userId, data) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);
};
