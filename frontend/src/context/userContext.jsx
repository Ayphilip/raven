import React, { createContext, useContext, useState, useEffect } from "react";
import { addFollower, checkUser, getAllUsers, getUser, handleBookmark, removeFollower, updateUser } from "../services/userServices";
import { avatars } from "../Components/avatars";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [userList, setUserList] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const allUsers = await getAllUsers();
            const userList = allUsers.map((doc) => ({
                id: doc.username, // Firebase User ID
                display: `@${doc.name}`, // Ensure display includes "@"
            }));
            // console.log("Users Data:", userList); // Debugging step
            setUserList(userList);
            setUsers(allUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const addFollow = async (userId, user2Id) => {
        setLoading(true);
        try {
            const allUsers = await addFollower(userId, user2Id);
            // setUsers(allUsers);
            return allUsers;
        } catch (error) {
            console.error("Error fetching users:", error);
            return false
        } finally {
            setLoading(false);
        }
    };

    const removeFollow = async (userId, user2Id) => {
        setLoading(true);
        try {
            const allUsers = await removeFollower(userId, user2Id);
            // setUsers(allUsers);
            return allUsers;
        } catch (error) {
            console.error("Error fetching users:", error);
            return false
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async (id) => {
        setLoading(true);
        try {
            const allTweets = await getUser(id);
            console.log(allTweets)
            // setTweet(allTweets);
            return allTweets
        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
        }
    };

    function getRandomBetween() {
        return Math.random() * (avatars.length - 0) + 0;
    }

    const addUser = async (userId, privyId, mode, username, name, profilePicture, cover, bio) => {
        try {
            var rands = getRandomBetween();
            const userData = await checkUser(userId, privyId, mode, username, name, rands.toString(), cover, bio);
            fetchUsers();
            return userData;
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };



    const modifyUser = async (userId, data) => {
        try {
            await updateUser(userId, data);
            fetchUsers();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <UserContext.Provider value={{ users, userList, loading, addUser, fetchUser, addFollow, removeFollow, modifyUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = () => {
    return useContext(UserContext);
};
