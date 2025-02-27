import express from "express";
import { addClues, createQuest, getQuest, getQuests, joinQuest, listenToQuestUpdates, submitGuess, subscribeToQuest } from "../controller/huntController.js";


const router = express.Router();

router.post("/quests", createQuest); // Create a new quest
router.get("/quests", getQuests); // Get all quests
router.post("/quest/addClues", addClues);
router.get("/quest/:questId", getQuest); // Get a single quest
router.post("/quest/join", joinQuest); // Join a quest
router.post("/quest/guess", submitGuess); // Submit a guess
router.get("/quest/live/:questId", subscribeToQuest);
router.get("/quest/listen/:questId", listenToQuestUpdates);

export default router;
