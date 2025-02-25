import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { db, collection, doc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot, Timestamp } from '../Components/firebaseConfig';

const TreasureHuntContext = createContext();

export const TreasureHuntProvider = ({ children }) => {
    const [quests, setQuests] = useState([]);
    const [selectedQuest, setSelectedQuest] = useState(null);


    // Fetch quests from the API
    useEffect(() => {
        fetchQuests();
    }, []);

    const fetchQuests = async () => {
        try {
            const { data } = await axios.get('/api/treasurehunt/quests');
            // console.log(data);
            setQuests(data.quests);
        } catch (error) {
            console.error("Error fetching quests:", error);
        }
    };
    // Create a quest
    const createQuest = async (questData) => {
        try {
            const { data } = await axios.post('/api/treasurehunt/quests', questData, {
                headers: { 'Content-Type': 'application/json' }
            });
            fetchQuests()
            return data;
        } catch (error) {
            console.error("Error creating quest:", error);
        }
    };

    // Join a quest
    const joinQuest = async (userId, questId) => {
        try {
            console.log(userId)
            console.log(questId)
            const { data } = await axios.post('/api/treasurehunt/quest/join', { userId, questId }, {
                headers: { 'Content-Type': 'application/json' }
            });
            fetchQuests()
            return data;

        } catch (error) {
            console.error("Error joining quest:", error);
        }
    };

    // Submit a guess
    const submitGuess = async (userId, questId, guess) => {
        try {
            const { data } = await axios.post('/api/treasurehunt/quest/guess', { userId, questId, guess }, {
                headers: { 'Content-Type': 'application/json' }
            });
            return data;
        } catch (error) {
            console.error("Error submitting guess:", error);
        }
    };

    // Real-time listener for quest updates using SSE
    useEffect(() => {
        if (!selectedQuest) return;

        const chatRef = collection(db, 'quests');

        // Firestore subscription
        const unsubscribe = onSnapshot(chatRef, (snapshot) => {
            if (!snapshot.empty) {
                const quests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setQuests(quests);
            }
        });

        // EventSource for real-time updates
        const eventSource = new EventSource(`/api/treasurehunt/quest/live/${selectedQuest}`);
        eventSource.onmessage = (event) => {
            const updatedQuest = JSON.parse(event.data);
            setQuests((prevQuests) =>
                prevQuests.map((q) => (q.id === updatedQuest.id ? updatedQuest : q))
            );
        };

        // Cleanup function
        return () => {
            unsubscribe();  // Unsubscribe Firestore listener
            eventSource.close(); // Close EventSource
        };
    }, [selectedQuest]);


    return (
        <TreasureHuntContext.Provider value={{ quests, createQuest, joinQuest, submitGuess, setSelectedQuest }}>
            {children}
        </TreasureHuntContext.Provider>
    );
};

export const useTreasureHunt = () => useContext(TreasureHuntContext);
