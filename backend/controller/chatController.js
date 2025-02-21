import { db, doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, orderBy, serverTimestamp } from "../config/firebaseConfig.js";

/**
 * Send a message and store it in Firestore.
 */
export const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;
        const chatId = senderId < receiverId ? `${senderId}_${receiverId}` : `${receiverId}_${senderId}`;

        const chatRef = db.collection("chats").doc(chatId);
        const chatSnap = await chatRef.get();

        const newMessage = {
            senderId,
            receiverId,
            message,
            timestamp: new Date().toISOString(),
            status: "sent", // Initial status
        };

        if (chatSnap.exists) {
            await chatRef.update({
                messages: admin.firestore.FieldValue.arrayUnion(newMessage),
            });
        } else {
            await chatRef.set({ messages: [newMessage] });
        }

        res.status(200).json({ message: "Message sent successfully", data: newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Fetch messages and update "delivered" status
 */
export const getMessages = async (req, res) => {
    try {
        const { userId, receiverId } = req.params;
        const chatId = userId < receiverId ? `${userId}_${receiverId}` : `${receiverId}_${userId}`;

        const chatRef = db.collection("chats").doc(chatId);
        const chatSnap = await chatRef.get();

        if (!chatSnap.exists) {
            return res.status(200).json([]);
        }

        let messages = chatSnap.data().messages || [];

        // Update "sent" messages to "delivered" for the receiver
        let updatedMessages = messages.map(msg =>
            msg.receiverId === userId && msg.status === "sent" ? { ...msg, status: "delivered" } : msg
        );

        await chatRef.update({ messages: updatedMessages });

        res.status(200).json(updatedMessages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Mark messages as seen when the user opens the chat.
 */
export const markMessagesAsSeen = async (req, res) => {
    try {
        const { userId, receiverId } = req.params;
        const chatId = userId < receiverId ? `${userId}_${receiverId}` : `${receiverId}_${userId}`;

        const chatRef = db.collection("chats").doc(chatId);
        const chatSnap = await chatRef.get();

        if (!chatSnap.exists) {
            return res.status(200).json({ message: "No messages found" });
        }

        let messages = chatSnap.data().messages || [];

        let updatedMessages = messages.map(msg =>
            msg.receiverId === userId && msg.status === "delivered" ? { ...msg, status: "seen" } : msg
        );

        await chatRef.update({ messages: updatedMessages });

        res.status(200).json({ message: "Messages marked as seen" });
    } catch (error) {
        console.error("Error updating messages as seen:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllChats = async (req, res) => {
    try {
        const { userId } = req.params;
        const chatsRef = collection(db, "chats");

        const q = query(chatsRef, orderBy("timestamp", "desc"));
        const chatSnap = await getDocs(q);

        const chats = chatSnap.docs
            .map(doc => ({ id: doc.id, messages: doc.data().messages }))
            .filter(chat => chat.id.includes(userId));

        return res.status(200).json(chats);
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
