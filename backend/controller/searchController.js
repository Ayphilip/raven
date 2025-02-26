import { 
    db, doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, orderBy, serverTimestamp,
    arrayUnion
} from "../config/firebaseConfig.js";

/**
 * Perform a search across multiple Firestore collections
 * @param {string} query - The search query
 * @param {number} limit - Limit per collection
 * @returns {object} Search results grouped by collection
 */
export const searchAcrossCollections = async (req, res) => {
  try {
    const { query } = req.query;
    const limit = parseInt(req.query.limit) || 10; // Limit results per collection

    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchCollections = ["users", "tweets", "quests"];
    const searchPromises = searchCollections.map((collectionName) =>
      searchFirestore(collectionName, query, limit)
    );

    const results = await Promise.all(searchPromises);

    const response = {
      users: results[0],
      tweets: results[1],
      quests: results[2], // Fix: changed "treasurehunt" to "quests" to match Firestore collections
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Search for documents in a Firestore collection using Firebase SDK
 * @param {string} collectionName - Firestore collection name
 * @param {string} query - Search query
 * @param {number} limit - Max results per collection
 * @returns {Promise<object[]>} - Search results
 */
const searchFirestore = async (collectionName, query, limit) => {
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
};
