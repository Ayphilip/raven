import { db, doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, arrayRemove, arrayUnion, serverTimestamp } from "../config/firebaseConfig.js";

// CREATE User
export const checkUser = async (req, res) => {
    try {
        const { userId, privyId, mode, username, name, profilePicture, cover, bio } = req.body;
        const userRef = doc(db, "users", username);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
            return res.status(200).json(snapshot.data());
        } else {
            const userData = {
                userId, username, name, privyId, mode, cover, profilePicture, bio,
                followers: [], following: [], bookmark: [], verified: false, createdAt: serverTimestamp()
            };
            await setDoc(userRef, userData);
            const newSnapshot = await getDoc(userRef);
            return res.status(201).json(newSnapshot.data());
        }
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// GET Single User
export const getUser = async (req, res) => {
    try {
        // console.log(req)
        const { username } = req.params;
        // console.log(username)
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return res.status(200).json(querySnapshot.docs[0].data());
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// GET All Users
export const getAllUsers = async (req, res) => {
    try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// UPDATE User
export const updateUser = async (req, res) => {
    try {
        // req.params.userId, req.body
        const { username } = req.params;
        const data = req.body;
        const userRef = doc(db, "users", username);

        await updateDoc(userRef, data);
        return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ADD Follower
export const addFollower = async (req, res) => {
    try {
        const { userId, user2Id } = req.body;
        const userRef = doc(db, "users", userId);
        const userRef2 = doc(db, "users", user2Id);

        await updateDoc(userRef, { followers: arrayUnion(user2Id) });
        await updateDoc(userRef2, { following: arrayUnion(userId) });

        return res.status(200).json({ message: "Follower added successfully" });
    } catch (error) {
        console.error("Error adding follower:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// REMOVE Follower
export const removeFollower = async (req, res) => {
    try {
        const { userId, user2Id } = req.body;
        const userRef = doc(db, "users", userId);
        const userRef2 = doc(db, "users", user2Id);

        await updateDoc(userRef, { followers: arrayRemove(user2Id) });
        await updateDoc(userRef2, { following: arrayRemove(userId) });

        return res.status(200).json({ message: "Follower removed successfully" });
    } catch (error) {
        console.error("Error removing follower:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Handle Bookmark
export const handleBookmark = async (req, res) => {
    try {
        const { userId, tweetId } = req.body;
        const userRef = doc(db, "users", userId);
        const tweetsRef = collection(db, "tweets");
        const q = query(tweetsRef, where("tweetId", "==", tweetId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({ error: "Tweet not found" });
        }

        const tweetDoc = querySnapshot.docs[0];
        const tweetRef = doc(db, "tweets", tweetDoc.id);

        const tweetData = tweetDoc.data();
        if (tweetData?.bookmarks?.includes(userId)) {
            await updateDoc(userRef, { bookmark: arrayRemove(tweetId) });
            await updateDoc(tweetRef, { bookmarks: arrayRemove(userId) });
        } else {
            await updateDoc(userRef, { bookmark: arrayUnion(tweetId) });
            await updateDoc(tweetRef, { bookmarks: arrayUnion(userId) });
        }

        return res.status(200).json({ message: "Bookmark updated successfully" });
    } catch (error) {
        console.error("Error handling bookmark:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
