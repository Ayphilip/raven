import { serverTimestamp } from "firebase/firestore";
import { db, collection, addDoc, doc, getDoc, setDoc, updateDoc, arrayUnion, query, orderBy, arrayRemove, getDocs } from "../Components/firebaseConfig";

const genId = async () => {
  return crypto.randomUUID();
};
// CREATE Tweet
export const createTweet = async (data) => {
  console.log(data)

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
export const getTweet = async (tweetId) => {
  
  const tweetRef = doc(db, "tweets", tweetId);
  const snapshot = await getDoc(tweetRef);
  return snapshot.exists() ? snapshot.data() : null;
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

// LIKE Tweet
export const likeTweets = async (tweetId, userId) => {
  const tweetRef = doc(db, "tweets", tweetId);
  await updateDoc(tweetRef, { likes: arrayUnion(userId) });
};

// RETWEET
export const retweet = async (tweetId, userId) => {
  const tweetRef = doc(db, "tweets", tweetId);
  await updateDoc(tweetRef, { retweets: arrayUnion(userId) });
};
