import { db, doc, getDoc, setDoc, updateDoc, collection, addDoc, arrayUnion, arrayRemove, getDocs, query, where, onSnapshot, serverTimestamp, Timestamp } from "../config/firebaseConfig.js";
import crypto from "crypto";
import { genId, sendNotification } from "../util.js";

// Store active SSE connections
const subscribers = new Map();

// 📌 Create a new quest
export const createQuest = async (req, res) => {
    try {
        const {
            questTitle,
            creator,
            description,
            questFace,
            reward,
            rewardType,
            rewardToken,
            questContent,
            questInstruction,
            entryAmount,
            startDate,
            endDate,
            answer
        } = req.body;

        const questId = await genId(); // Generate a unique ID

        const newQuest = {
            id: questId,
            questTitle,
            description,
            reward,
            rewardType,
            rewardToken,
            questContent,
            questFace, // URL received from frontend
            questInstruction,
            entryAmount,
            answer,
            participants: [],
            clues: [],
            status: "active",
            winner: null,
            startDate,
            endDate,
            creator,
            createdAt: serverTimestamp(),
        };

        // Store quest in Firestore
        await setDoc(doc(db, "quests", questId), newQuest);

        const userRef = doc(db, "users", creator);
        const userSnapshot = await getDoc(userRef);


        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();

            await sendNotification(userData.notificationList, creator, questId, 1)
        }

        // Notify subscribers about the new quest
        // notifySubscribers(questId, newQuest);

        res.status(201).json({ success: true, message: "Quest created successfully", quest: newQuest });
    } catch (error) {
        console.error("Error creating quest:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const submitGuess = async (req, res) => {
    try {
        const { userId, questId, guess } = req.body;

        // Reference the quest document
        const questRef = doc(db, "quests", questId);
        const questDoc = await getDoc(questRef);

        if (!questDoc.exists()) {
            return res.status(404).json({ error: "Quest not found" });
        }

        const questData = questDoc.data();

        if (questData.status === "completed") {
            return res.status(400).json({ error: "This quest has already been completed." });
        }

        // Prepare the new guess entry
        const newGuess = {
            userId,
            guess,
            createdAt: Timestamp.now(),
        };

        // Reference the "guess" collection, where each questId holds a list of guesses
        const guessRef = doc(db, "guess", questId);
        const guessDoc = await getDoc(guessRef);

        if (guessDoc.exists()) {
            // Append new guess to the existing list
            await updateDoc(guessRef, {
                guesses: arrayUnion(newGuess), // Add new guess to the list
            });
        } else {
            // Create a new document for this questId
            await setDoc(guessRef, {
                questId,
                guesses: [newGuess], // Initialize with the first guess
            });
        }

        // Check if the guess is correct
        const isCorrect = guess === questData.answer;

        if (isCorrect) {
            // Update the quest with the winner and set status to "completed"
            await updateDoc(questRef, {
                winner: userId,
                status: "completed",
            });

            return res.status(200).json({ 
                success: true, 
                correct: true, 
                message: "Congratulations! Your guess is correct."
            });
        }

        return res.status(200).json({ 
            success: true, 
            correct: false, 
            message: "Incorrect guess. Try again!"
        });

    } catch (error) {
        console.error("Error submitting guess:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const joinQuest = async (req, res) => {
    try {
        const { userId, questId } = req.body;
        const questRef = doc(db, "quests", questId);
        const questDoc = await getDoc(questRef);

        if (!questDoc.exists()) {
            return res.status(404).json({ error: "Quest not found" });
        }

        await updateDoc(questRef, { participants: arrayUnion(userId) });
        return res.status(200).json({ success: true, message: "User joined the quest" });
    } catch (error) {
        console.error("Error joining quest:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// 📌 Submit a guess for a quest
export const submitGuesss = async (req, res) => {
    try {
        const { userId, questId, guess } = req.body;
        const questRef = doc(db, "guess", questId);
        const questDoc = await getDoc(questRef);

        if (!questDoc.exists()) {
            return res.status(404).json({ error: "Quest not found" });
        }

        const questData = questDoc.data();

        if (questData.status === "completed") {
            return res.status(400).json({ error: "This quest has already been completed." });
        }

        const isCorrect = guess.trim().toLowerCase() === questData.answer.trim().toLowerCase();

        if (isCorrect) {
            // Correct answer - update winner and status
            await updateDoc(questRef, {
                winner: userId,
                status: "completed",
                clues: arrayUnion({ userId, guess, correct: true, timestamp: serverTimestamp() })
            });

            res.status(200).json({ success: true, correct: true, message: "Congratulations! Your guess is correct." });

        } else {
            // Incorrect guess - just add to the clues
            await updateDoc(questRef, {
                clues: arrayUnion({ userId, guess, correct: false, timestamp: serverTimestamp() })
            });

            res.status(200).json({ success: true, correct: false, message: "Incorrect guess. Try again!" });
        }

        // Notify subscribers of quest updates
        const updatedQuest = (await getDoc(questRef)).data();
        notifySubscribers(questId, updatedQuest);
    } catch (error) {
        console.error("Error submitting guess:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 📌 Get all quests
export const getQuests = async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "quests"));
        const quests = querySnapshot.docs.map(doc => doc.data());

        res.status(200).json({ quests });
    } catch (error) {
        console.error("Error fetching quests:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 📌 Get a single quest
export const getQuest = async (req, res) => {
    try {
        const { questId } = req.params;
        const questRef = doc(db, "quests", questId);
        const questDoc = await getDoc(questRef);

        if (!questDoc.exists()) {
            return res.status(404).json({ error: "Quest not found" });
        }

        res.status(200).json(questDoc.data());
    } catch (error) {
        console.error("Error fetching quest:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 📌 Subscribe to real-time quest updates
export const subscribeToQuest = (req, res) => {
    const { questId } = req.params;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Store the subscriber
    subscribers.set(questId, res);

    // Send initial data
    getDoc(doc(db, "quests", questId)).then(docSnap => {
        if (docSnap.exists()) {
            res.write(`data: ${JSON.stringify(docSnap.data())}\n\n`);
        }
    });

    req.on("close", () => {
        subscribers.delete(questId);
    });
};

// 📌 Notify subscribers of quest updates
export const listenToQuestUpdates = (req, res) => {
    try {
        const { questId } = req.params;
        const questRef = doc(db, "quests", questId);

        // Set SSE headers
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const unsubscribe = onSnapshot(questRef, (snapshot) => {
            if (!snapshot.exists()) {
                res.write(`data: ${JSON.stringify({ error: "Quest not found" })}\n\n`);
                return;
            }
            res.write(`data: ${JSON.stringify(snapshot.data())}\n\n`);
        });

        // Handle client disconnection
        req.on("close", () => {
            unsubscribe();
            res.end();
        });
    } catch (error) {
        console.error("Error setting up real-time listener:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
