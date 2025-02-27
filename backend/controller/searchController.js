import { 
    db, doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, orderBy, serverTimestamp,
    arrayUnion
} from "../config/firebaseConfig.js";
import { searchFirestore } from "../util.js";

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
      searchFirestore(collectionName, query, limit, req)
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

