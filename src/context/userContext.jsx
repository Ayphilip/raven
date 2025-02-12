import React, { createContext, useContext, useState, useEffect } from "react";
import { checkUser, getAllUsers, updateUser } from "../services/userServices";
import { avatars } from "../Components/avatars";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const allUsers = await getAllUsers();
            setUsers(allUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
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
        <UserContext.Provider value={{ users, loading, addUser, modifyUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = () => {
    return useContext(UserContext);
};
