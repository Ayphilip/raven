import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import tweetRoutes from "./routes/tweets.js";
import nftRoutes from "./routes/nfts.js";
import { fileURLToPath } from "url"; // Import fileURLToPath from 'url'
import { exec } from "child_process"; // Import child_process module
import path from 'path'

// Define __dirname manually for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/nfts", nftRoutes);


const startFrontend = () => {
    console.log("Starting frontend...");
    exec("cd ../frontend && npm run dev", (err, stdout, stderr) => {
        if (err) {
            console.error(`Error starting frontend: ${err}`);
            return;
        }
        console.log(stdout);
        console.error(stderr);
    });
};

// Start Server
const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/dist/index.html`));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
