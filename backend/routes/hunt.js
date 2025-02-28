import express from "express";
import { addClues, buyClues, createQuest, getQuest, getQuests, joinQuest, listenToQuestUpdates, submitGuess, subscribeToQuest, updateQuest } from "../controller/huntController.js";


const router = express.Router();

router.post("/quests", createQuest); // Create a new quest
router.get("/quests", getQuests); // Get all quests
router.put("/questId/:questId", updateQuest);
router.post("/quest/addClues", addClues);
router.post("/questId/:questId/clueId/:clueId", buyClues);
router.get("/quest/:questId", getQuest); // Get a single quest
router.post("/quest/join", joinQuest); // Join a quest
router.post("/quest/guess", submitGuess); // Submit a guess
router.get("/quest/live/:questId", subscribeToQuest);
router.get("/quest/listen/:questId", listenToQuestUpdates);

export default router;
