import { 
    db, doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, orderBy, serverTimestamp,
    arrayUnion
} from "../config/firebaseConfig.js";

/**
 * Send a message and store it in Firestore.
 */
export const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;
        const chatId = senderId < receiverId ? `${senderId}_${receiverId}` : `${receiverId}_${senderId}`;
        const chatRef = doc(db, "chats", chatId);
        const chatSnap = await getDoc(chatRef);

        const newMessage = {
            senderId,
            receiverId,
            message,
            timestamp: serverTimestamp(),
            status: "sent",
        };

        if (chatSnap.exists()) {
            await updateDoc(chatRef, {
                messages: arrayUnion(newMessage),
                timestamp: serverTimestamp(),
            });
        } else {
            await setDoc(chatRef, {
                messages: [newMessage],
                timestamp: serverTimestamp(),
            });
        }

        res.status(200).json({ message: "Message sent successfully", data: newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Initialize a chat.
 */
export const initializeChat = async (req, res) => {
    try {
        const { userId1, userId2 } = req.body;
        if (!userId1 || !userId2) {
            return res.status(400).json({ error: 'Both userId1 and userId2 are required' });
        }

        const chatId = userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
        const chatRef = doc(db, "chats", chatId);
        const chatSnap = await getDoc(chatRef);

        if (chatSnap.exists()) {
            return res.status(200).json({ message: 'Chat already exists', chatId });
        }

        await setDoc(chatRef, {
            messages: [],
            timestamp: serverTimestamp(),
        });

        res.status(201).json({ message: 'Chat initialized', chatId });
    } catch (error) {
        console.error('Error initializing chat:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Fetch messages and mark "delivered".
 */
export const getMessages = async (req, res) => {
    try {
        const { userId, receiverId } = req.params;
        const chatId = userId < receiverId ? `${userId}_${receiverId}` : `${receiverId}_${userId}`;
        const chatRef = doc(db, "chats", chatId);
        const chatSnap = await getDoc(chatRef);

        if (!chatSnap.exists()) {
            return res.status(200).json([]);
        }

        let messages = chatSnap.data().messages || [];

        let updatedMessages = messages.map(msg =>
            msg.receiverId === userId && msg.status === "sent" ? { ...msg, status: "delivered" } : msg
        );

        await updateDoc(chatRef, { messages: updatedMessages });

        res.status(200).json(updatedMessages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Mark messages as seen.
 */
export const markMessagesAsSeen = async (req, res) => {
    try {
        const { userId, receiverId } = req.params;
        const chatId = userId < receiverId ? `${userId}_${receiverId}` : `${receiverId}_${userId}`;
        const chatRef = doc(db, "chats", chatId);
        const chatSnap = await getDoc(chatRef);

        if (!chatSnap.exists()) {
            return res.status(200).json({ message: "No messages found" });
        }

        let messages = chatSnap.data().messages || [];

        let updatedMessages = messages.map(msg =>
            msg.receiverId === userId && msg.status === "delivered" ? { ...msg, status: "seen" } : msg
        );

        await updateDoc(chatRef, { messages: updatedMessages });

        res.status(200).json({ message: "Messages marked as seen" });
    } catch (error) {
        console.error("Error updating messages as seen:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Fetch all chats for a user.
 */
export const getAllChats = async (req, res) => {
    try {
        const { userId } = req.params;
        const chatsRef = collection(db, "chats");

        const q = query(chatsRef, orderBy("timestamp", "desc"));
        const chatSnap = await getDocs(q);

        const chats = chatSnap.docs
            .map(doc => ({ id: doc.id, messages: doc.data().messages, timestamp: doc.data().timestamp }))
            .filter(chat => chat.id.includes(userId));

        return res.status(200).json(chats);
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
