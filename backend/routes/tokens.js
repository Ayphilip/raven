import express from "express";
import {
  createToken,
  getMaxSupply,
  getTotalCirculatingSupply,
  getBalance,
  mint,
  transfer
} from "../controller/tokenController.js";

const router = express.Router();

// Create Token
router.post("/create", async (req, res) => {
    try{
        await createToken(req, res);
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Max Supply of a Token
router.get("/max-supply/:symbol", async (req, res) => {
  try{
    await getMaxSupply(req, res);
}catch (error) {
    res.status(500).json({ error: error.message });
}
});

// Get Total Circulating Supply
router.get("/circulating-supply/:symbol", async (req, res) => {
  try{
    await getTotalCirculatingSupply(req, res);
}catch (error) {
    res.status(500).json({ error: error.message });
}
});

// Check Balance of a User
router.get("/balance/:address/:symbol", async (req, res) => {
  try{
    await getBalance(req, res);
}catch (error) {
    res.status(500).json({ error: error.message });
}
});

// Mint Tokens
router.post("/mint", async (req, res) => {
  try{
    await mint(req, res);
}catch (error) {
    res.status(500).json({ error: error.message });
}
});

// Transfer Tokens
router.post("/transfer", async (req, res) => {
  try{
    await transfer(req, res);
}catch (error) {
    res.status(500).json({ error: error.message });
}
});

export default router;
