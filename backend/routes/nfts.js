
import express from "express";
import {
    createCollection,
    mintNFT,
    getOwner
} from "../controller/nftController.js";

const router = express.Router();

// Create NFT Collection
router.post("/collection", async (req, res) => {
    try {
        console.log(req.body)
        await createCollection(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mint NFT
router.post("/mint", async (req, res) => {
    try {
        await mintNFT(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get NFT Owner
router.get("/:collectionName/:nftId", async (req, res) => {
    try {
        await getOwner(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
