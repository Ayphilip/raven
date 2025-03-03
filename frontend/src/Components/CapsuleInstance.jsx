import React from "react";
import { Tooltip } from "react-tooltip";
import { avatars } from "./avatars";
import CryptoJS from 'crypto-js';
import { useUsers } from "../context/userContext";
// import { useUsers } from "../context/userContext";
import Logo from '../asset/images/logo.png'
import { useNavigate } from "react-router-dom";


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
        <div key={userId} className="mention inline-flex items-center z-[100]">
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
              <a href={`/timeline/${user.username}`} class="button bg-primary w-100 flex items-center gap-2 text-white py-2 px-1.5 max-sm:flex-1">
                <ion-icon name="add-circle" class="text-sm"></ion-icon>
                <span class="text-sm"> View Profile  </span>
              </a>
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

function getTopWords(tweets) {
  const wordCount = {}; // Tracks total word occurrences
  const postCount = {}; // Tracks in how many tweets a word appears

  tweets.forEach(tweet => {
    const words = tweet.content.toLowerCase().match(/\b\w+\b/g) || []; // Extract words
    const uniqueWords = new Set(words); // Get unique words in the tweet

    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1; // Count occurrences
    });

    uniqueWords.forEach(word => {
      postCount[word] = (postCount[word] || 0) + 1; // Count posts containing the word
    });
  });

  // Convert to array and sort by total occurrences
  const sortedWords = Object.keys(wordCount)
    .map(word => ({ word, count: wordCount[word], posts: postCount[word] }))
    .sort((a, b) => b.count - a.count) // Sort descending by count
    .slice(0, 5); // Get top 10

  return sortedWords;
}

function viewFollowing(userDetails, user, users, onback) {
  const { addFollow } = useUsers();

  const saveFollow = (userId, user2Id) => {

    var hive = addFollow(userId, user2Id)
    if (hive) {
      // setStat(true)
    } else {
      // setStat(false)
    }
  }


  return (


    <div class="flex max-lg:flex-col 2xl:gap-12 gap-10 2xl:max-w-[1220px] max-w-[1065px] mx-auto" id="js-oversized">

      <div class="flex-1">

        <div class="max-w-[680px] w-full mx-auto">

          <div class="page-heading">
            <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>


              <button onClick={onback}><ion-icon name="arrow-back-outline" class="text-xl"></ion-icon></button>
              <div style={{ padding: '20px' }}>

                <h1 class="page-title"> {user.name} </h1>
                <h5>@{user.username.slice(0, 6)}...{user.username.slice(-4)}</h5>
              </div>
            </div>

            <nav class="nav__underline">

              <ul class="group" uk-switcher="connect: #page-tabs ; animation: uk-animation-slide-right-medium, uk-animation-slide-left-medium">

                <li> <a href="#"> Verified Followers  </a> </li>
                <li> <a href="#"> Followers </a> </li>
                <li> <a href="#"> Following </a> </li>

              </ul>

            </nav>

          </div>

          <div id="page-tabs" class="uk-switcher mt-10">



            <div class="grid sm:grid-cols-3 grid-cols-2 gap-3 w-[500px]" uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 100 ;repeat: true">

              {users.filter(use => use.verified && user.followers.some(fol => fol === use.username)).map(use =>
                <div class="card">
                  <a href={"/timeline/" + use.username}>
                    <div class="card-media sm:aspect-[2/1.7] h-40">
                      <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" />
                      <div class="card-overly"></div>
                    </div>
                  </a>
                  <div class="card-body">
                    <a href={"/timeline/" + use.username}> <h4 class="card-title"> {use.name} {use?.verified && <ion-icon name="shield-checkmark-outline" class="text-blue-500 font-medium text-xl"></ion-icon>} </h4> </a>
                    <p class="card-text">{use.followers.length} Following</p>
                    {use.followers.includes(userDetails?.username) ?
                      <button type="button" class="button bg-black text-white">Unfollow</button>
                      : <button onClick={() => saveFollow(use.username, userDetails?.username)} type="button" class="button bg-primary text-white">Follow</button>
                    }
                  </div>
                </div>)}
            </div>



            <div class="grid sm:grid-cols-3 grid-cols-2 gap-3 w-[500px]" uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 100 ;repeat: true">

              {users.filter(use => user.followers.some(fol => fol === use.username)).map(use =>
                <div class="card">
                  <a href={"/timeline/" + use.username}>
                    <div class="card-media sm:aspect-[2/1.7] h-40">
                      <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" />
                      <div class="card-overly"></div>
                    </div>
                  </a>
                  <div class="card-body">
                    <a href={"/timeline/" + use.username}> <h4 class="card-title"> {use.name} {use?.verified && <ion-icon name="shield-checkmark-outline" class="text-blue-500 font-medium text-xl"></ion-icon>} </h4> </a>
                    <p class="card-text">{use.followers.length} Following</p>
                    {use.followers.includes(userDetails?.username) ?
                      <button type="button" class="button bg-black text-white">Unfollow</button>
                      : <button onClick={() => saveFollow(use.username, userDetails?.username)} type="button" class="button bg-primary text-white">Follow</button>
                    }
                  </div>
                </div>)}
            </div>




            <div class="grid sm:grid-cols-3 grid-cols-2 gap-3 w-[500px]" uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 100 ;repeat: true">

              {users.filter(use => user.following.some(fol => fol === use.username)).map(use =>
                <div class="card">
                  <a href={"/timeline/" + use.username}>
                    <div class="card-media sm:aspect-[2/1.7] h-40">
                      <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" />
                      <div class="card-overly"></div>
                    </div >
                  </a>
                  <div class="card-body">
                    <a href={"/timeline/" + use.username}> <h4 class="card-title"> {use.name} {use?.verified && <ion-icon name="shield-checkmark-outline" class="text-blue-500 font-medium text-xl"></ion-icon>} </h4> </a>
                    <p class="card-text">{use.followers.length} Following</p>
                    {use.followers.includes(userDetails?.username) ?
                      <button type="button" class="button bg-black text-white">Unfollow</button>
                      : <button onClick={() => saveFollow(use.username, userDetails?.username)} type="button" class="button bg-primary text-white">Follow</button>
                    }
                  </div>
                </div>)}
            </div>

          </div>

        </div>


      </div>

    </div>


  )

}

export { renderContentWithMentions, encryptText, LoadingView, getTopWords, viewFollowing };
