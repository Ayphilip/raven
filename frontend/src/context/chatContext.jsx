import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { db, collection, doc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot, Timestamp } from '../Components/firebaseConfig';
import Cookies from "js-cookie";

const socket = io('/', { autoConnect: false });

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]); // Active chat messages
    const [allChats, setAllChats] = useState([]); // All user chats
    const [selectedChat, setSelectedChat] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = Cookies.get("userDetails");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchAllChats(parsedUser.username);
        }
    }, []);

    const markMessages = async (userId, receiverId) => {
        try {
            // console.log('Here')
            await axios.post(`/api/chats/seen/${userId}/${receiverId}`);
            // setAllChats(response.data);
            fetchAllChats(user.username)
        } catch (error) {
            console.error('Error fetching all chats:', error);
        }
    }

    // Fetch all user chats
    const fetchAllChats = async (userId) => {
        try {


            const response = await axios.get(`/api/chats/${userId}`);
            setAllChats(response.data);
        } catch (error) {
            console.error('Error fetching all chats:', error);
        }
    };

    const initializeChat = async (userId1, userId2) => {
        try {
            const response = await axios.post('/api/chats/initialize', { userId1, userId2 });
            setAllChats(response.data);
            window.location.href = "/chat"; // Corrected navigation syntax
        } catch (error) {
            console.error('Error initializing chat:', error);
        }
    };

    // Fetch messages from Firestore when a chat is selected
    const fetchMessages = async (receiverId) => {
        if (!user) return;
        const chatId = user.username < receiverId ? `${user.username}_${receiverId}` : `${receiverId}_${user.username}`;
        const chatRef = doc(db, 'chats', chatId);

        try {

            const chatSnap = await getDoc(chatRef);
            if (chatSnap.exists()) {
                // console.log('here')
                // console.log(chatSnap.data().messages)
                setChats(chatSnap.data().messages || []);
            } else {
                // console.log('her2')
                setChats([]);
            }

            // Join socket room and listen for updates
            socket.emit('joinChat', { userId: user.username, receiverId });

            // Listen for real-time changes in Firebase
            const unsubscribe = onSnapshot(chatRef, (doc) => {
                if (doc.exists()) {
                    // console.log(doc.data().messages)
                    setChats(doc.data().messages || []);
                    fetchAllChats(user.username)
                }
            });

            return () => unsubscribe(); // Unsubscribe on unmount
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Send a new message
    const sendMessage = async (receiverId, message) => {
        if (!user) return;
        const newMessage = {
            senderId: user.username,
            receiverId,
            message,
            timestamp: Timestamp.now(),
            status: "sent",
        };

        const response = await axios.post('/api/chats/send', newMessage);


        // socket.emit('sendMessage', newMessage);
    };

    return (
        <ChatContext.Provider value={{ allChats, chats, markMessages, fetchMessages, initializeChat, sendMessage, setSelectedChat }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChats = () => {
    return useContext(ChatContext);
};
