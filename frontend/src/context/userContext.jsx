import React, { createContext, useContext, useState, useEffect } from "react";
import { avatars } from "../Components/avatars";
import axios from "axios";
import Cookies from "js-cookie";

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
            const allUsers = await axios.get('/api/users');
            const userList = allUsers.data.map((doc) => ({
                id: doc.username, // Firebase User ID
                display: `@${doc.name}`, // Ensure display includes "@"
            }));
            // console.log("Users Data:", userList); // Debugging step
            setUserList(userList);
            setUsers(allUsers.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const addFollow = async (userId, user2Id) => {
        setLoading(true);
        try {
            const allUsers = await axios.post('/api/users/follow', {
                userId: userId,
                user2Id: user2Id
            })
            // const allUsers = await addFollower(userId, user2Id);
            // setUsers(allUsers);
            fetchUsers()
            return allUsers.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            return false
        } finally {
            setLoading(false);
        }
    };

    const addNotifier = async (userId, user2Id) => {
        setLoading(true);
        try {
            const allUsers = await axios.post('/api/users/addnotifier', {
                userId: userId,
                user2Id: user2Id
            })
            // const allUsers = await addFollower(userId, user2Id);
            // setUsers(allUsers);
            
            return allUsers.data;
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
            const allUsers = await axios.post('/api/users/unfollow', {
                userId: userId,
                user2Id: user2Id
            })
            // removeFollower(userId, user2Id);
            // setUsers(allUsers);
            return allUsers.data;
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
            const allTweets = await axios.get(`/api/users/${id}`);
            // console.log(allTweets)
            // setTweet(allTweets);
            return allTweets.data
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
            const userData = await axios.post('/api/users', {
                userId: userId,
                privyId: privyId,
                mode: mode,
                username: username,
                name: name,
                profilePicture: rands.toString(),
                cover: cover,
                bio: bio
            });
            fetchUsers();
            return userData.data;
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };



    const modifyUser = async (userId, data) => {
        try {
            // Send update request
            const response = await axios.put(`/api/users/${userId}`, data);
            
            // Retrieve existing user data from cookies
            const storedUser = Cookies.get("userDetails");
            let existingUser = storedUser ? JSON.parse(storedUser) : {};

            const data2 = await fetchUser(userId)

            console.log(data2)

            // console.log(response.data)
            // console.log(existingUser)
    
            // Merge old data with the updated response
            const updatedUser = { ...existingUser, ...data2 };
            console.log(updatedUser)
    
            // Save updated user back to cookies
            Cookies.set("userDetails", JSON.stringify(updatedUser), { expires: 7 });
    
            // Refresh user list
            fetchUsers();
    
            return updatedUser;
        } catch (error) {
            console.error("Error updating user:", error);
            return false;
        }
    };
    

    return (
        <UserContext.Provider value={{ users, userList, loading, addUser, fetchUser, addFollow, removeFollow, modifyUser, addNotifier }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = () => {
    return useContext(UserContext);
};
