import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { db, collection, doc, getDoc, setDoc, updateDoc, arrayUnion, query, where, onSnapshot, Timestamp } from '../Components/firebaseConfig';

const TreasureHuntContext = createContext();

export const TreasureHuntProvider = ({ children }) => {
    const [quests, setQuests] = useState([]);
    const [selectedQuest, setSelectedQuest] = useState(null);
    const [guesses, setGuesses] = useState([])


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
    const submitGuess = async (data2) => {
        try {
            // console.log(data2)
            const { data } = await axios.post('/api/treasurehunt/quest/guess', data2, {
                headers: { 'Content-Type': 'application/json' }
            });
            return data;
        } catch (error) {
            console.error("Error submitting guess:", error);
        }
    };

    const updateQuest = async (questId, data2) => {
        try {
            // console.log(data2)
            const { data } = await axios.put(`/api/treasurehunt/questId/${questId}`, data2, {
                headers: { 'Content-Type': 'application/json' }
            });
            return data;
        } catch (error) {
            console.error("Error submitting guess:", error);
        }
    };

    const getClue = async (data2) => {
        try {
            // console.log(data2)
            const { data } = await axios.post(`/api/treasurehunt/questId/${data2.questId}/clueId/${data2.clueId}`, {userId: data2.userId}, {
                headers: { 'Content-Type': 'application/json' }
            });
            return data;
        } catch (error) {
            console.error("Error submitting guess:", error);
        }
    };

    const submitClue = async (data2) => {
        try {
            console.log(data2)
            const { data } = await axios.post('/api/treasurehunt/quest/addClues', data2, {
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

        // Reference the selected quest document
        const questRef = doc(db, "quests", selectedQuest);

        // Firestore subscription for the selected quest
        const unsubscribeQuest = onSnapshot(questRef, (doc) => {
            if (doc.exists()) {
                setQuests((prevQuests) => {
                    const updatedQuest = { id: doc.id, ...doc.data() };
                    return prevQuests.some((q) => q.id === updatedQuest.id)
                        ? prevQuests.map((q) => (q.id === updatedQuest.id ? updatedQuest : q))
                        : [...prevQuests, updatedQuest];
                });
            }
        });

        // Firestore subscription for the guesses of the selected quest
        const guessRef = doc(db, "guess", selectedQuest); // questId is the document ID
        const unsubscribeGuesses = onSnapshot(guessRef, (doc) => {
            if (doc.exists()) {
                setGuesses(doc.data().guesses || []); // Extract only the guesses array
            } else {
                setGuesses([]); // If no document exists, reset the guesses
            }
        });

        // EventSource for real-time quest updates from the server
        const eventSource = new EventSource(`/api/treasurehunt/quest/live/${selectedQuest}`);
        eventSource.onmessage = (event) => {
            const updatedQuest = JSON.parse(event.data);
            setQuests((prevQuests) =>
                prevQuests.map((q) => (q.id === updatedQuest.id ? updatedQuest : q))
            );
        };

        // Cleanup function
        return () => {
            unsubscribeQuest(); // Unsubscribe from quest updates
            unsubscribeGuesses(); // Unsubscribe from guess updates
            eventSource.close(); // Close EventSource connection
        };
    }, [selectedQuest]);



    return (
        <TreasureHuntContext.Provider value={{ quests, guesses, createQuest, getClue, updateQuest, joinQuest, submitGuess, setSelectedQuest, submitClue }}>
            {children}
        </TreasureHuntContext.Provider>
    );
};

export const useTreasureHunt = () => useContext(TreasureHuntContext);
