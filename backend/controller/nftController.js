import { db, doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from "../config/firebaseConfig.js";

// CREATE Collection
export const createCollection = async (req, res) => {
    try {
        const { name, symbol, base_uri } = req.body;
        const collectionRef = doc(db, "nftCollections", name);
        const collectionData = { name, symbol, base_uri }
        await setDoc(collectionRef, collectionData);
        return res.status(201).json({ message: "Collection created successfully" });
    } catch (error) {
        console.error("Error creating collection:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// MINT NFT
export const mintNFT = async (req, res) => {
    try {
        const { collectionName, owner, metadata } = req.body;
        const collectionRef = doc(db, "nftCollections", collectionName);
        const collectionSnap = await getDoc(collectionRef);
        
        if (!collectionSnap.exists()) {
            return res.status(404).json({ error: "Collection not found" });
        }
        
        const nftRef = doc(collection(db, "nfts"));
        await setDoc(nftRef, { collectionName, owner, metadata });
        return res.status(201).json({ message: "NFT minted successfully" });
    } catch (error) {
        console.error("Error minting NFT:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// CHECK NFT OWNERSHIP
export const getOwner = async (req, res) => {
    try {
        const { collectionName, nftId } = req.params;
        const q = query(collection(db, "nfts"), where("collectionName", "==", collectionName), where("id", "==", nftId));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return res.status(404).json({ error: "NFT not found" });
        }
        return res.status(200).json({ owner: querySnapshot.docs[0].data().owner });
    } catch (error) {
        console.error("Error fetching NFT owner:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
