import { serverTimestamp } from "firebase/firestore";
import { db, collection, addDoc, doc, getDoc, setDoc, where, updateDoc, arrayUnion, query, orderBy, arrayRemove, getDocs } from "../Components/firebaseConfig";

const genId = async () => {
  return crypto.randomUUID();
};
// CREATE Tweet
export const createTweet = async (data) => {
  // console.log(data)

  try {
    if (!data.userId) {
      throw new Error("Missing required fields: userId or content");
    }

    const initId = await genId();
    const tweetRef = collection(db, "tweets");

    await addDoc(tweetRef, {
      tweetId: initId,
      userId: data.userId,
      content: data.content || '',
      media: data.media || [], // Ensure media is an array
      likes: [],
      retweets: [],
      comments: [],
      bookmarks: [],
      mentions: data.mentions,
      createdAt: serverTimestamp(), // More reliable timestamp
      parent: data.parent || null, // Ensure parent is explicitly set
      visibility: data.visibility
    });
  } catch (error) {
    console.error("Error creating tweet:", error);
    throw error;
  }
  // const initId = await genId();
  // const tweetRef = collection(db, "tweets");
  // // Visibility 1 = All
  // // Visibility 2 = Friends Only
  // // Visibility 3 = Private
  // await addDoc(tweetRef, { tweetId: initId, userId, content, media, likes: [], retweets: [], createdAt: new Date(), parent, visibility });
};


// READ Tweet
export const getTweetz = async (tweetId) => {

  const tweetRef = doc(db, "tweets", tweetId);
  const snapshot = await getDoc(tweetRef);
  return snapshot.exists() ? snapshot.data() : null;
};

export const getTweet = async (tweetId) => {
  try {
    const tweetsRef = collection(db, "tweets"); // Reference to tweets collection
    const q = query(tweetsRef, where("tweetId", "==", tweetId)); // Query for tweetId
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Return the first matching document's data
      return querySnapshot.docs[0].data();
    } else {
      return null; // No matching tweet found
    }
  } catch (error) {
    console.error("Error fetching tweet:", error);
    throw error;
  }
};

export const getAllTweet = async () => {

  const tweetRef = collection(db, "tweets");
  const tweetQuery = query(tweetRef, orderBy("createdAt", "desc")); // Sorts in ascending order

  const snapshot = await getDocs(tweetQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  // console.log(users)

  // return users;
};

export const deleteTweet = async (tweetId) => {
  try {
      const tweetRef = doc(db, "tweets", tweetId); // Get reference to tweet
      await deleteDoc(tweetRef); // Delete document
      console.log(`Tweet with ID: ${tweetId} deleted successfully`);
  } catch (error) {
      console.error("Error deleting tweet:", error);
  }
};

// LIKE Tweet
export const likesTweets = async (tweetId, userId) => {
  try {
    const tweetsRef = collection(db, "tweets"); // Reference to tweets collection
    const q = query(tweetsRef, where("tweetId", "==", tweetId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("Tweet not found");
      return;
    }

    const tweetDoc = querySnapshot.docs[0]; // Get the first matching document
    const tweetData = tweetDoc.data(); // Get the document data
    const tweetRef = doc(db, "tweets", tweetDoc.id); // Get the document reference

    if (tweetData.likes.includes(userId)) {
      // User already liked the tweet, remove like
      
      await updateDoc(tweetRef, { likes: arrayRemove(userId) });
      // console.log("Like removed");
    } else {
      // User has not liked the tweet, add like
      await updateDoc(tweetRef, { likes: arrayUnion(userId) });
      // console.log("Like added");
    }
  } catch (error) {
    console.error("Error updating likes:", error);
  }
};

// RETWEET
export const retweet = async (tweetId, userId) => {
  try {
    const tweetsRef = collection(db, "tweets"); // Reference to tweets collection
    const q = query(tweetsRef, where("tweetId", "==", tweetId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("Tweet not found");
      return;
    }

    const tweetDoc = querySnapshot.docs[0]; // Get the first matching document
    const tweetData = tweetDoc.data(); // Get the document data
    const tweetRef = doc(db, "tweets", tweetDoc.id); // Get the document reference
    // console.log(tweetData)

    const data = {
      userId: userId,
      parent: tweetId,
      visibility: '1',
      mentions: []
    };

    if (tweetData.retweets.includes(userId)) {
      // await deleteTweet()
      // console.log('sait')
      await updateDoc(tweetRef, { retweets: arrayRemove(userId) });
    } else {
      // console.log('ait')
      await createTweet(data); // Create a new retweet
      await updateDoc(tweetRef, { retweets: arrayUnion(userId) });
    }

    // console.log("Retweet successful!");
  } catch (error) {
    console.error("Error retweeting:", error);
  }
};
