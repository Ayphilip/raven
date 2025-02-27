import express from "express";
import cors from "cors";
import http from "http"; // Import HTTP for Socket.io
import { Server } from "socket.io";
import userRoutes from "./routes/users.js";
import tweetRoutes from "./routes/tweets.js";
import nftRoutes from "./routes/nfts.js";
import tokenRoutes from "./routes/tokens.js"
import chatRoutes from "./routes/chat.js";
import notifyRoutes from "./routes/notifications.js";
import treasureRoutes from "./routes/hunt.js";
import searchRoutes from "./routes/search.js"
import { fileURLToPath } from "url";
import { exec } from "child_process";
import path from "path";
import {
    db, doc, getDoc, setDoc, updateDoc, Timestamp, collection, getDocs, query, where, orderBy, serverTimestamp,
    arrayUnion
} from "./config/firebaseConfig.js";
import { genId } from "./util.js";

// Define __dirname manually for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
    cors: {
        origin: "*", // Allow any frontend origin
    }
});

app.use(cors());
app.use(express.json());

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/nfts", nftRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/notifications", notifyRoutes);
app.use("/api/treasurehunt", treasureRoutes);
app.use("/api/search", searchRoutes)


// Store Active Users
const activeUsers = new Map(); // { userId: socketId }

// Socket.io Event Handling
io.on('connection', (socket) => {
    // console.log('User connected:', socket.id);

    // Join a chat room based on chatId
    socket.on('joinChat', async ({ userId, receiverId }) => {
        const chatId = userId < receiverId ? `${userId}_${receiverId}` : `${receiverId}_${userId}`;
        socket.join(chatId);
        // console.log(`${socket.id} joined chat: ${chatId}`);

        try {
            const chatRef = doc(db, 'chats', chatId);
            const chatSnap = await getDoc(chatRef);

            let messages = chatSnap.exists() ? chatSnap.data().messages || [] : [];

            // Update "sent" messages to "delivered"
            let updatedMessages = messages.map(msg =>
                msg.receiverId === userId && msg.status === 'sent' ? { ...msg, status: 'delivered' } : msg
            );

            if (JSON.stringify(messages) !== JSON.stringify(updatedMessages)) {
                await updateDoc(chatRef, { messages: updatedMessages });
                messages = updatedMessages;
            }

            // Emit the updated chat history
            io.to(chatId).emit('chatHistory', messages);
        } catch (error) {
            console.error('Error fetching chat history:', error);
            socket.emit('error', { message: 'Failed to load chat history' });
        }
    });

    // Handle sending a message
    socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
        try {
            const chatId = senderId < receiverId ? `${senderId}_${receiverId}` : `${receiverId}_${senderId}`;
            const chatRef = doc(db, 'chats', chatId);

            const newMessage = {
                senderId,
                receiverId,
                message,
                timestamp: Timestamp.now(),
                status: "sent",
            };

            const chatSnap = await getDoc(chatRef);

            if (chatSnap.exists()) {
                await updateDoc(chatRef, {
                    messages: arrayUnion(newMessage)
                });
            } else {
                await setDoc(chatRef, { messages: [newMessage] }, { merge: true });
            }

            io.to(chatId).emit('newMessage', newMessage);
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Handle real-time message updates
    socket.on('subscribeToChat', ({ userId, receiverId }) => {
        const chatId = userId < receiverId ? `${userId}_${receiverId}` : `${receiverId}_${userId}`;
        const chatRef = doc(db, 'chats', chatId);

        const unsubscribe = onSnapshot(chatRef, (doc) => {
            if (doc.exists()) {
                io.to(chatId).emit('chatHistory', doc.data().messages || []);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            unsubscribe();
        });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


// Serve Frontend Static Files
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.post("/hello", async (req, res) => {
    const id = await genId(req)
    console.log(id)
});

// Start Server
const PORT = process.env.PORT || 5000;
// const defs = await genId2()
// console.log(defs)
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
