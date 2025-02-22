import React from "react";
import { Tooltip } from "react-tooltip";
import { avatars } from "./avatars";
// import { useUsers } from "../context/userContext";

// const { users, userList, addUser, modifyUser } = useUsers();

const renderContentWithMentions = (text, users, me) => {
    const mentionRegex = /\[@([^\]]+)\]\((0x[a-fA-F0-9]+)\)/g;

    return text.split(mentionRegex).map((part, index, arr) => {
        if (index % 3 === 1) {
            const userId = arr[index + 1];
            // console.log(userId)
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
                    <div class="p-4 bg-white rounded-lg shadow-md w-80 dark:bg-slate-700 z-[100]"
                        uk-drop="offset:10;pos: bottom-right ; animation: uk-animation-slide-bottom-small">

                        <div className="bg-white dark:bg-dark3 xl:space-y-6 space-y-3">
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                                <img src={user?.profilePicture ? avatars[parseInt(user.profilePicture)] : avatars[0]} alt="" class="w-10 h-10 rounded-full shadow" />
                                {user.followers.includes(me.username) ? <button class="button bg-secondery flex items-center gap-2 text-white py-2 px-1.5 max-sm:flex-1">
                                    <ion-icon name="add-circle" class="text-sm"></ion-icon>
                                    <span class="text-sm"> Following  </span>
                                </button> : <button class="button bg-primary flex items-center gap-2 text-white py-2 px-1.5 max-sm:flex-1">
                                    <ion-icon name="add-circle" class="text-sm"></ion-icon>
                                    <span class="text-sm"> Follow  </span>
                                </button>}
                            </div>
                            <div>

                                <h6 className="text-sm font-small text-black"><strong>{user.name}</strong></h6>
                                <h6 className="text-sm font-small text-black">@{user.username.slice(0, 6)}...
                                    {user.username.slice(-4)}</h6>
                            </div>
                            <p className="text-sm font-small text-black">{user.bio}</p>
                            <h6>{user.followers.length} Followers | {user.following.length} Following</h6>
                            {user.bio && <p className="text-gray-700 text-sm mt-2">{user.bio}</p>}
                            <p>
                                Followed by {(() => {
                                    const filteredUsers = users.filter(use =>
                                        me?.following?.includes(use.id) && user.followers.includes(use.id)
                                    );

                                    if(!filteredUsers.length > 0){
                                        return 'No one you follow'
                                    }

                                    const firstFour = filteredUsers.slice(0, 4).map(use => use.name);
                                    const remainingCount = filteredUsers.length - 4;

                                    return remainingCount > 0
                                        ? `${firstFour.join(", ")} and ${remainingCount} others`
                                        : firstFour.join(", ");
                                })()}
                            </p>
                            <button class="button bg-primary w-100 flex items-center gap-2 text-white py-2 px-1.5 max-sm:flex-1">
                                <ion-icon name="add-circle" class="text-sm"></ion-icon>
                                <span class="text-sm"> View Profile  </span>
                            </button>
                        </div>
                    </div>
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
