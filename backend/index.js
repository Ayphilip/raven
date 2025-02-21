import express from "express";
import cors from "cors";
import http from "http"; // Import HTTP for Socket.io
import { Server } from "socket.io";
import userRoutes from "./routes/users.js";
import tweetRoutes from "./routes/tweets.js";
import nftRoutes from "./routes/nfts.js";
import tokenRoutes from "./routes/tokens.js"
import chatRoutes from "./routes/chat.js";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import path from "path";

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

// Store Active Users
const activeUsers = new Map(); // { userId: socketId }

// Socket.io Event Handling
io.on("connection", (socket) => {
    console.log(`⚡ New user connected: ${socket.id}`);

    // User joins with their userId
    socket.on("join", (userId) => {
        activeUsers.set(userId, socket.id);
        console.log(`👤 User ${userId} connected`);
    });

    // Handle sending messages
    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
        const receiverSocketId = activeUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", { senderId, message });
        }
    });

    // Mark message as seen
    socket.on("markAsSeen", ({ senderId, receiverId }) => {
        const senderSocketId = activeUsers.get(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageSeen", { receiverId });
        }
    });

    // Mark message as read
    socket.on("markAsRead", ({ senderId, receiverId }) => {
        const senderSocketId = activeUsers.get(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageRead", { receiverId });
        }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        for (let [userId, socketId] of activeUsers.entries()) {
            if (socketId === socket.id) {
                activeUsers.delete(userId);
                console.log(`❌ User ${userId} disconnected`);
                break;
            }
        }
    });
});

// Serve Frontend Static Files
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
