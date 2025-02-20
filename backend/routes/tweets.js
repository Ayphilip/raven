import express from "express";
import {
  createTweet,
  getTweet,
  getAllTweets,
  likeTweet,
  retweetTweet,
  deleteTweet
} from "../controller/tweetController.js";

const router = express.Router();

// Create a tweet
router.post("/", async (req, res) => {
  try {
    await createTweet(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single tweet by ID
router.get("/:tweetId", async (req, res) => {
  try {
    await getTweet(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all tweets
router.get("/", async (req, res) => {
  try {
    await getAllTweets(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like or Unlike a tweet
router.post("/like", async (req, res) => {
  try {
    await likeTweet(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retweet
router.post("/retweet", async (req, res) => {
  try {
    await retweetTweet(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a tweet
router.delete("/:tweetId", async (req, res) => {
  try {
    await deleteTweet(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
