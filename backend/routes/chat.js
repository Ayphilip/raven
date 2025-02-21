import express from "express";
import { sendMessage, getMessages, markMessagesAsSeen, getAllChats } from "../controller/chatController.js";

const router = express.Router();

router.post("/send", sendMessage);  // Send a message
router.get("/:userId/:receiverId", getMessages);  // Fetch messages
router.post("/seen/:userId/:receiverId", markMessagesAsSeen); // Mark messages as seen
router.get("/:userId", getAllChats);

export default router;
