import express from "express";
import {
  checkUser,
  getUser,
  getAllUsers,
  updateUser,
  addFollower,
  removeFollower,
  handleBookmark,
  addNotifier
} from "../controller/userController.js";

const router = express.Router();

// Create or check user
router.post("/", async (req, res) => {
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
router.post("/follow", async (req, res) => {
  try {
    const { userId, user2Id } = req.body;
    const success = await addFollower(req, res);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove follower
router.post("/unfollow", async (req, res) => {
  try {
    const { userId, user2Id } = req.body;
    const success = await removeFollower(req, res);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/addnotifier", async (req, res) => {
  try {
    await addNotifier(req, res);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle bookmark
router.post("/bookmark", async (req, res) => {
  try {
    const { userId, user2Id } = req.body;
    await handleBookmark(req, res);
    // res.status(200).json({ message: "Bookmark updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
