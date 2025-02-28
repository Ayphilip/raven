import { db, doc, getDoc, setDoc, updateDoc, collection, addDoc, arrayUnion, arrayRemove, getDocs, query, where, onSnapshot, serverTimestamp, Timestamp } from "../config/firebaseConfig.js";
import crypto from "crypto";
import { genId, getIsCorrect, sendNotification } from "../util.js";


const subscribers = new Map();


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

        const questId = await genId(req); // Generate a unique ID

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
        const isCorrect = getIsCorrect(guess, questData.answer, req);

        // console.log(isCorrect)

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

export const addClues = async (req, res) => {
    try {
        const { clue, questId } = req.body;
        const questRef = doc(db, "quests", questId);
        const questDoc = await getDoc(questRef);
        const initId = await genId(req)
        const newClue = {
            id: initId,
            clue: clue,
            access: []
        }

        if (!questDoc.exists()) {
            return res.status(404).json({ error: "Quest not found" });
        }

        await updateDoc(questRef, { clues: arrayUnion(newClue) });
        return res.status(200).json({ success: true, message: "New clue added" });
    } catch (error) {
        console.error("Error Adding clue:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const buyClues = async (req, res) => {
    const { questId, clueId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const questRef = doc(db, "quests", questId);
        const questSnapshot = await getDoc(questRef);

        if (!questSnapshot.exists()) {
            return res.status(404).json({ error: "Quest not found" });
        }

        let questData = questSnapshot.data();
        let clues = questData.clues || [];

        // Find the correct clue by ID
        let clueIndex = clues.findIndex(clue => clue.id === clueId);
        if (clueIndex === -1) {
            return res.status(404).json({ error: "Clue not found" });
        }

        // Ensure the `access` array exists
        if (!Array.isArray(clues[clueIndex].access)) {
            clues[clueIndex].access = [];
        }

        // Check if the user is already in the access list
        if (clues[clueIndex].access.includes(userId)) {
            return res.status(400).json({ error: "User already has access" });
        }

        // Add user to the access list
        clues[clueIndex].access.push(userId);

        // Update Firestore
        await updateDoc(questRef, { clues });

        return res.status(200).json({ message: "User added to access list" });
    } catch (error) {
        console.error("Error updating access list:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



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
