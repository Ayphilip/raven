import express from "express";
import { 
    sendNotification, 
    getNotifications, 
    markAsRead, 
    deleteNotification, 
    clearNotifications 
} from "../controller/notificationController.js";

const router = express.Router();

router.post("/send", sendNotification); // Send a notification
router.get("/:userId", getNotifications); // Get notifications for a user
router.patch("/read", markAsRead); // Mark a notification as read
router.delete("/delete", deleteNotification); // Delete a single notification
router.delete("/clear/:userId", clearNotifications); // Clear all notifications

export default router;
