import express from "express";
import {
  checkUser,
  getUser,
  getAllUsers,
  updateUser,
  addFollower,
  removeFollower,
  handleBookmark
} from "../controller/userController.js";

const router = express.Router();

// Create or check user
router.post("/user", async (req, res) => {
  try {
    // const { userId, privyId, mode, username, name, profilePicture, cover, bio } = req.body;
    const user = await checkUser(req, res);
    // res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by username
router.get("/:username", async (req, res) => {
  try {
    // console.log(req.params)
    const user = await getUser(req, res);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers(req, res);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put("/:username", async (req, res) => {
  try {
    await updateUser(req, res);
    // res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add follower
router.post("/user/follow", async (req, res) => {
  try {
    const { userId, user2Id } = req.body;
    const success = await addFollower(userId, user2Id);
    if (success) {
      res.status(200).json({ message: "Follower added successfully" });
    } else {
      res.status(400).json({ message: "Error adding follower" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove follower
router.post("/user/unfollow", async (req, res) => {
  try {
    const { userId, user2Id } = req.body;
    const success = await removeFollower(userId, user2Id);
    if (success) {
      res.status(200).json({ message: "Follower removed successfully" });
    } else {
      res.status(400).json({ message: "Error removing follower" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle bookmark
router.post("/user/bookmark", async (req, res) => {
  try {
    const { userId, user2Id } = req.body;
    await handleBookmark(req, res);
    res.status(200).json({ message: "Bookmark updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
