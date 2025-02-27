import { db, doc, getDoc, setDoc, updateDoc, collection, arrayUnion, arrayRemove, getDocs, query, where } from "../config/firebaseConfig.js";
import { genId } from "../util.js";




export const sendNotification = async (req, res) => {
    try {
        const { userId, message, type } = req.body;
        const initId = await genId(req);
        const notificationData = {
            id: initId,
            message,
            type,
            isRead: false,
            timestamp: serverTimestamp()
        };

        const userNotifRef = doc(db, "notifications", userId);
        const userNotifDoc = await getDoc(userNotifRef);

        if (!userNotifDoc.exists()) {
            await setDoc(userNotifRef, { userId, notifications: [notificationData] });
        } else {
            await updateDoc(userNotifRef, { notifications: arrayUnion(notificationData) });
        }

        return res.status(200).json({ success: true, message: "Notification sent successfully" });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const userNotifRef = doc(db, "notifications", userId);
        const userNotifDoc = await getDoc(userNotifRef);

        if (!userNotifDoc.exists()) {
            return res.status(200).json({ notifications: [] });
        }

        return res.status(200).json({ notifications: userNotifDoc.data().notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const markAsRead = async (req, res) => {
    try {
        const { userId } = req.body;  // No need for notifId since we are marking all as read
        const userNotifRef = doc(db, "notifications", userId);
        const userNotifDoc = await getDoc(userNotifRef);

        if (!userNotifDoc.exists()) {
            return res.status(404).json({ error: "No notifications found" });
        }

        // Update all notifications to isRead: true
        const notifications = userNotifDoc.data().notifications.map(notif => ({
            ...notif,
            isRead: true
        }));

        await updateDoc(userNotifRef, { notifications });

        return res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const deleteNotification = async (req, res) => {
    try {
        const { userId, notifId } = req.body;
        const userNotifRef = doc(db, "notifications", userId);
        const userNotifDoc = await getDoc(userNotifRef);

        if (!userNotifDoc.exists()) {
            return res.status(404).json({ error: "No notifications found" });
        }

        const notifications = userNotifDoc.data().notifications;
        const updatedNotifications = notifications.filter(notif => notif.id !== notifId);

        await updateDoc(userNotifRef, { notifications: updatedNotifications });
        return res.status(200).json({ success: true, message: "Notification deleted" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const clearNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const userNotifRef = doc(db, "notifications", userId);

        await updateDoc(userNotifRef, { notifications: [] });
        return res.status(200).json({ success: true, message: "All notifications cleared" });
    } catch (error) {
        console.error("Error clearing notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
