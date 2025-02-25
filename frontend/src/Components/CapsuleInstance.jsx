import React from "react";
import { Tooltip } from "react-tooltip";
import { avatars } from "./avatars";
import CryptoJS from 'crypto-js';
import { useUsers } from "../context/userContext";
// import { useUsers } from "../context/userContext";
import Logo from '../asset/images/logo.png'


const renderContentWithMentions = (text, users, me) => {
    const mentionRegex = /\[@([^\]]+)\]\((0x[a-fA-F0-9]+)\)/g;
    const { userList, addUser, modifyUser, addFollow } = useUsers();

    return text.split(mentionRegex).map((part, index, arr) => {
        if (index % 3 === 1) {
            const userId = arr[index + 1];
            // console.log(userId)
            const user = users.find((u) => u.username === userId); // ✅ Find user by ID
            // const user = users.find((u) => u.username === username);

            if (!user) return userId; // Fallback to raw text if user not found

            return (
                <div key={userId} className="mention inline-flex items-center z-200000">
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
                                </button> : <button class="button bg-primary flex items-center gap-2 text-white py-2 px-1.5 max-sm:flex-1" onClick={() => addFollow(user.username, me.username)}>
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

                                    if (!filteredUsers.length > 0) {
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
                </div>
            );
        }
        if (index % 3 === 0) {
            return part; // Normal text
        }
        return null; // Skip wallet addresses
    }).filter(Boolean); // Remove null values
};

const encryptText = (data) => {
    var mesg = CryptoJS.AES.encrypt(data, "ravenTestToken").toString()
    return mesg
}

const LoadingView = () => {
    return <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.0)", // Transparent background
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999, // Ensures it's above everything
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Stack image & loader vertically
        alignItems: "center",
        justifyContent: "center",
        gap: "15px", // Spacing between image and loader
      }}
    >
      {/* Centered Image */}
      <img
        src={Logo}
        alt="Loading"
        style={{
          width: "150px", // Adjust size as needed
          height: "auto",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)", // Soft glow effect
        }}
      />

      {/* Loader (Spinner) */}
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid rgba(255, 255, 255, 0.3)",
          borderTop: "4px solid #3396FF",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
    </div>

    {/* CSS Animation for Loader */}
    <style>
      {`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}
    </style>
  </div>
}


export { renderContentWithMentions, encryptText, LoadingView };
