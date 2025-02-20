import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
// import tweetRoutes from "./routes/tweets.js";

const app = express();
app.use(cors());
app.use(express.json());

// Use Routes
app.use("/api/users", userRoutes);
// app.use("/tweet", tweetRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
