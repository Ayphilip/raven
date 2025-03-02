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
} from "../config/firebaseConfig.js";
import { genId, sendNotification } from "../util.js";


// Create Tweet
export const createTweet = async (req, res) => {
    try {
        const initId = await genId(req);
        const { userId, preview, content, media, mentions, parent, visibility, type } = req.body;
        const tweetRef = doc(db, "tweets", initId);

        if ((type == 1 || type === 2) && parent) {
            const tweetRefOriginal = doc(db, "tweets", parent);
            const tweetSnapshot = await getDoc(tweetRefOriginal);

            if (!tweetSnapshot.exists()) {
                return res.status(404).json({ error: "Tweet not found" });
            }

            if (type == 1) {
                await updateDoc(tweetRefOriginal, { comments: arrayUnion(initId) });
            } else {
                await updateDoc(tweetRefOriginal, { retweets: arrayUnion(initId) });
            }
        }
        
        const tweetData = {
            tweetId: initId,
            userId: userId,
            content: content || '',
            media: media || [],
            likes: [],
            retweets: [],
            comments: [],
            bookmarks: [],
            type: type,
            preview: preview,
            mentions: Array.isArray(mentions) ? mentions : [],
            parent: parent || 'original',
            visibility: visibility,
            createdAt: serverTimestamp(),
        };

        await setDoc(tweetRef, tweetData);

        // Fetch user data to get notification list
        const userRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userRef);
        let notificationList = Array.isArray(mentions) ? mentions : [];

        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            if (Array.isArray(userData.notificationList)) {
                notificationList = [...new Set([...userData.notificationList, ...notificationList])]; // Merge & remove duplicates
            }
        }

        await sendNotification(notificationList, initId, 0, req)

        return res.status(201).json({ message: "Tweet created successfully" });
    } catch (error) {
        console.error("Error creating tweet:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



// Get a single Tweet
export const getTweet = async (req, res) => {
    try {
        const { tweetId } = req.params;
        const tweetRef = doc(db, "tweets", tweetId);
        const tweetSnapshot = await getDoc(tweetRef);

        if (!tweetSnapshot.exists()) {
            return res.status(404).json({ error: "Tweet not found" });
        }

        return res.status(200).json({ id: tweetSnapshot.id, ...tweetSnapshot.data() });
    } catch (error) {
        console.error("Error fetching tweet:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllTweets = async (req, res) => {
    try {
        const tweetsRef = collection(db, "tweets");

        // Order by createdAt in descending order (latest first)
        const q = query(tweetsRef, orderBy("createdAt", "desc"));

        const snapshot = await getDocs(q);
        let tweets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Randomize slightly using Fisher-Yates Shuffle
        // for (let i = tweets.length - 1; i > 0; i--) {
        //     const j = Math.floor(Math.random() * (i + 1));
        //     [tweets[i], tweets[j]] = [tweets[j], tweets[i]];
        // }

        return res.status(200).json(tweets);
    } catch (error) {
        console.error("Error fetching tweets:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Like or Unlike a Tweet
export const likeTweet = async (req, res) => {
    try {
        const { tweetId, userId } = req.body;
        const tweetRef = doc(db, "tweets", tweetId);
        const tweetSnapshot = await getDoc(tweetRef);

        if (!tweetSnapshot.exists()) {
            return res.status(404).json({ error: "Tweet not found" });
        }

        const tweetData = tweetSnapshot.data();
        if (tweetData.likes.includes(userId)) {
            await updateDoc(tweetRef, { likes: arrayRemove(userId) });
        } else {
            await updateDoc(tweetRef, { likes: arrayUnion(userId) });
        }

        return res.status(200).json({ message: "Like status updated successfully" });
    } catch (error) {
        console.error("Error liking tweet:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Retweet a Tweet
export const retweetTweet = async (req, res) => {
    try {
        const { tweetId, userId } = req.body;
        const tweetRef = doc(db, "tweets", tweetId);
        const tweetSnapshot = await getDoc(tweetRef);

        if (!tweetSnapshot.exists()) {
            return res.status(404).json({ error: "Tweet not found" });
        }

        const tweetData = tweetSnapshot.data();
        if (tweetData.retweets.includes(userId)) {
            await updateDoc(tweetRef, { retweets: arrayRemove(userId) });
        } else {
            await updateDoc(tweetRef, { retweets: arrayUnion(userId) });
        }

        return res.status(200).json({ message: "Retweet status updated successfully" });
    } catch (error) {
        console.error("Error retweeting:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete a Tweet
export const deleteTweet = async (req, res) => {
    try {
        const { tweetId } = req.params;
        const tweetRef = doc(db, "tweets", tweetId);
        await deleteDoc(tweetRef);
        return res.status(200).json({ message: "Tweet deleted successfully" });
    } catch (error) {
        console.error("Error deleting tweet:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
