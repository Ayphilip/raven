import React from "react";
import { Tooltip } from "react-tooltip";
import { avatars } from "./avatars";
// import { useUsers } from "../context/userContext";

// const { users, userList, addUser, modifyUser } = useUsers();

const renderContentWithMentions = (text, users) => {
    const mentionRegex = /\[@([^\]]+)\]\((0x[a-fA-F0-9]+)\)/g;

    return text.split(mentionRegex).map((part, index, arr) => {
        if (index % 3 === 1) {
            const userId = arr[index + 1];
            console.log(userId)
            const user = users.find((u) => u.username === userId); // ✅ Find user by ID
            // const user = users.find((u) => u.username === username);

            if (!user) return userId; // Fallback to raw text if user not found

            return (
                <span key={userId} className="mention inline-flex items-center">
                    <span
                        className="text-blue-500 font-medium cursor-pointer hover:underline"
                        data-tooltip-id={`mention-${userId}`}
                    >
                        {user.name} {/* ✅ Show only name */}
                    </span>
                    <Tooltip id={`mention-${userId}`} place="top" className="custom-tooltip">
                        <div className="p-3 w-64 bg-white dark:bg-dark2 shadow-lg rounded-lg">
                            {/* {user.profilePic && (
                                <img 
                                    src={user.profilePic} 
                                    alt={user.name} 
                                    className="w-12 h-12 rounded-full mb-2"
                                />
                            )} */}
                            <img src={user?.profilePicture ? avatars[parseInt(user.profilePicture)] : avatars[0]} alt="" class="w-10 h-10 rounded-full shadow" />
                            <strong className="text-gray-900 text-lg">{user.name}</strong>
                            <p className="text-gray-500 text-sm">@{user.username}</p>
                            {user.bio && <p className="text-gray-700 text-sm mt-2">{user.bio}</p>}
                        </div>
                    </Tooltip>
                </span>
            );
        }
        if (index % 3 === 0) {
            return part; // Normal text
        }
        return null; // Skip wallet addresses
    }).filter(Boolean); // Remove null values
};



export { renderContentWithMentions };
