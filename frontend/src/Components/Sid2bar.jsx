import React, { useEffect, useState } from 'react'
import { avatars } from './avatars'
import { useTweets } from '../context/tweetContext';
import { useUsers } from '../context/userContext';
import { useLoginService } from '../services/authenticationService';
import { useOthers } from '../context/otherContext';
import { useAddress } from '@chopinframework/react';
import { useTreasureHunt } from '../context/treasureHuntContext';
import { useChats } from '../context/chatContext';
import { useNavigate } from 'react-router-dom';
import { getTopWords } from './CapsuleInstance';

function Sid2bar({ ps }) {

    const [isMintAvailable, setIsMintAvailable] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");

    const { tweets, likeTweet, retweetTweet, addTweet, topWords } = useTweets();
    const { users, userList, addUser, modifyUser, addFollow } = useUsers();

    const { address, isLoading, isLoginError, logout, revalidate } = useAddress();
    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate } = useLoginService();

    const { ptoken, mintToken } = useOthers()

    const [searchWord, setSearchWord] = useState('')



    const { chats, allChats, fetchMessages } = useChats();

    const { quests } = useTreasureHunt()

    const navigate = useNavigate()

    const saveFollow = (userId, user2Id) => {

        var hive = addFollow(userId, user2Id)
        if (hive) {
            setStat(true)
        } else {
            setStat(false)
        }
    }


    const handleMint = () => {
        if (isMintAvailable) {
            mintToken({
                userId: userDetails?.username,
                amount: 5,
                symbol: ptoken
            })
            localStorage.setItem("lastMintTime", new Date().getTime());
            setIsMintAvailable(false);
            setTimeLeft("24:00:00"); // Reset countdown
        }
    };

    const executeSearch = (word, event) => {
        event.preventDefault(); // Prevents form from reloading the page
        if (!word) {
            console.error("Search word is empty!");
            return;
        }
        navigate(`/search?q=${encodeURIComponent(word)}`);
    };

    const formatTime = (ms) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };




    useEffect(() => {

        const checkMintStatus = () => {

            const lastMintTime = localStorage.getItem("lastMintTime");
            if (!lastMintTime) {
                setIsMintAvailable(true);
                return;
            }

            const now = new Date().getTime();
            const timeElapsed = now - parseInt(lastMintTime, 10);
            const remainingTime = 24 * 60 * 60 * 1000 - timeElapsed;

            if (remainingTime <= 0) {
                setIsMintAvailable(true);
                localStorage.removeItem("lastMintTime"); // Reset when time expires
            } else {
                setIsMintAvailable(false);
                setTimeLeft(formatTime(remainingTime));
                setTimeout(checkMintStatus, 1000); // Update countdown every second
            }
        };

        checkMintStatus();

        return () => {

        }
    }, [isLoading, isMintAvailable, users])
    return (
        <div class="2xl:w-[380px] lg:w-[330px] w-full">

            <div class="lg:space-y-4 lg:pb-8 max-lg:grid sm:grid-cols-2 max-lg:gap-6"
                uk-sticky="media: 1024; end: #js-oversized; offset: 80">

                {ps !== 'search' && <form onSubmit={(e) => executeSearch(searchWord, e)} class="xl:w-auto sm:w-96 sm:relative rounded-xl overflow-hidden bg-secondery max-md:hidden w-screen left-0 max-sm:fixed max-sm:top-2 dark:!bg-white/5">
                    <button type='submit'><ion-icon name="search" class="absolute left-4 top-1/2 -translate-y-1/2"></ion-icon></button>
                    <input type="text" required onChange={(e) => setSearchWord(e.target.value)} placeholder="Search Friends, videos .." class="w-full !pl-10 !font-normal !bg-transparent h-12 !text-sm" />
                </form>}

                {topWords && <div class="box p-5 px-6 border1 dark:bg-dark1">

                    <div class="flex justify-between text-black dark:text-white">
                        <h3 class="font-bold text-base"> Trends for you </h3>
                        <button type="button"> <ion-icon name="sync-outline" class="text-xl"></ion-icon> </button>
                    </div>

                    <div class="space-y-3.5 capitalize text-xs font-normal mt-5 mb-2 text-gray-600 dark:text-white/80">
                        {topWords?.map(trends => <a href={"/search?q=" + trends.word}>
                            <div class="flex items-center gap-3 p">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 -mt-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                                </svg>
                                <div class="flex-1">
                                    <h4 class="font-semibold text-black dark:text-white text-sm">  {trends.word} </h4>
                                    <div class="mt-0.5"> {trends.posts} post </div>
                                </div>
                            </div>
                        </a>)}

                    </div>


                </div>}

                <div class="box p-5 px-6 border1 dark:bg-dark1">

                    <div class="flex items-baseline justify-between text-black dark:text-white">
                        <h3 class="font-bold text-base"> People you may know </h3>
                        {/* <a href="#" class="text-sm text-blue-500">See all</a> */}
                    </div>

                    <div class="side-list">

                        {users
                            .filter(use => userDetails && use.username !== userDetails.username) // Filter out the current user
                            // .sort(() => Math.random() - 0.5) // Shuffle the array randomly
                            .slice(0, 5) // Limit to 5 random users
                            .map(use => (
                                <div class="side-list-item" key={use.id}>
                                    <a href={"/timeline/" + use.id}>
                                        <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="side-list-image rounded-full" />
                                    </a>
                                    <div class="flex-1">
                                        <a href={"/timeline/" + use.id}>
                                            <h4 class="side-list-title"> {use.name} </h4>
                                        </a>
                                        <div class="side-list-info"> {use.followers.length} Following </div>
                                    </div>
                                    {use.followers.some(fol => fol === userDetails.username) ? (
                                        <button class="button bg-primary-soft text-primary dark:text-white">unfollow</button>
                                    ) : (
                                        <button onClick={() => saveFollow(use.username, userDetails?.username)} class="button bg-primary-soft text-primary dark:text-white">follow</button>
                                    )}
                                </div>
                            ))}


                        <button class="bg-secondery button w-full mt-2 hidden">See all</button>

                    </div>

                </div>




                <div class="box p-5 px-6 border1 dark:bg-dark1 hidden">

                    <div class="flex justify-between text-black dark:text-white">
                        <h3 class="font-bold text-base"> Peaple You might know </h3>
                        <button type="button"> <ion-icon name="sync-outline" class="text-xl"></ion-icon> </button>
                    </div>

                    <div class="space-y-4 capitalize text-xs font-normal mt-5 mb-2 text-gray-500 dark:text-white/80">

                        <div class="flex items-center gap-3">
                            <a href="timeline.html">
                                <img src="assets/images/avatars/avatar-7.jpg" alt="" class="bg-gray-200 rounded-full w-10 h-10" />
                            </a>
                            <div class="flex-1">
                                <a href="timeline.html"><h4 class="font-semibold text-sm text-black dark:text-white">  Johnson smith</h4></a>
                                <div class="mt-0.5"> Suggested For You </div>
                            </div>
                            <button type="button" class="text-sm rounded-full py-1.5 px-4 font-semibold bg-secondery"> Follow </button>
                        </div>
                        <div class="flex items-center gap-3">
                            <a href="timeline.html">
                                <img src="assets/images/avatars/avatar-5.jpg" alt="" class="bg-gray-200 rounded-full w-10 h-10" />
                            </a>
                            <div class="flex-1">
                                <a href="timeline.html"><h4 class="font-semibold text-sm text-black dark:text-white"> James Lewis</h4></a>
                                <div class="mt-0.5"> Followed by Johnson </div>
                            </div>
                            <button type="button" class="text-sm rounded-full py-1.5 px-4 font-semibold bg-secondery"> Follow </button>
                        </div>
                        <div class="flex items-center gap-3">
                            <a href="timeline.html">
                                <img src="assets/images/avatars/avatar-2.jpg" alt="" class="bg-gray-200 rounded-full w-10 h-10" />
                            </a>
                            <div class="flex-1">
                                <a href="timeline.html"><h4 class="font-semibold text-sm text-black dark:text-white"> John Michael</h4></a>
                                <div class="mt-0.5"> Followed by Monroe  </div>
                            </div>
                            <button type="button" class="text-sm rounded-full py-1.5 px-4 font-semibold bg-secondery"> Follow </button>
                        </div>
                        <div class="flex items-center gap-3">
                            <a href="timeline.html">
                                <img src="assets/images/avatars/avatar-3.jpg" alt="" class="bg-gray-200 rounded-full w-10 h-10" />
                            </a>
                            <div class="flex-1">
                                <a href="timeline.html"><h4 class="font-semibold text-sm text-black dark:text-white">  Monroe Parker</h4></a>
                                <div class="mt-0.5"> Suggested For You </div>
                            </div>
                            <button type="button" class="text-sm rounded-full py-1.5 px-4 font-semibold bg-secondery"> Follow </button>
                        </div>
                        <div class="flex items-center gap-3">
                            <a href="timeline.html">
                                <img src="assets/images/avatars/avatar-4.jpg" alt="" class="bg-gray-200 rounded-full w-10 h-10" />
                            </a>
                            <div class="flex-1">
                                <a href="timeline.html"><h4 class="font-semibold text-sm text-black dark:text-white">  Martin Gray</h4></a>
                                <div class="mt-0.5"> Suggested For You </div>
                            </div>
                            <button type="button" class="text-sm rounded-full py-1.5 px-4 font-semibold bg-secondery"> Follow </button>
                        </div>
                    </div>

                </div>



                <div class="box p-5 px-6 border1 dark:bg-dark2">

                    <div class="flex justify-between text-black dark:text-white">
                        <h3 class="font-bold text-base"> Treasure Hunt </h3>
                        <button type="button"> <ion-icon name="sync-outline" class="text-xl"></ion-icon> </button>
                    </div>

                    <div class="relative capitalize font-medium text-sm text-center mt-4 mb-2" tabindex="-1" uk-slider="autoplay: true;finite: true">

                        <div class="overflow-hidden uk-slider-container">

                            <ul class="-ml-2 uk-slider-items w-[calc(100%+0.5rem)]">

                                {quests.filter(quest => quest.status === 'active').map(quest => <li class="w-1/2 pr-2">

                                    <a href={'/ravenhunt/quest/' + quest.id}>
                                        <div class="relative overflow-hidden rounded-lg">
                                            <div class="relative w-full h-40">
                                                <img src={quest.questFace} alt="" class="object-cover w-full h-full inset-0" />
                                            </div>
                                            <div class="absolute right-0 top-0 m-2 bg-white/60 rounded-full py-0.5 px-2 text-sm font-semibold dark:bg-slate-800/60"> {quest.rewardType === '1' ? quest.reward : (quest.participants.length * quest.entryAmount)} {quest.rewardToken} </div>
                                        </div>
                                        <div class="mt-3 w-full"> {quest.questTitle} </div>
                                    </a>
                                </li>)}


                            </ul>

                            <button type="button" class="absolute bg-white rounded-full top-16 -left-4 grid w-9 h-9 place-items-center shadow dark:bg-dark3" uk-slider-item="previous"> <ion-icon name="chevron-back" class="text-2xl"></ion-icon></button>
                            <button type="button" class="absolute -right-4 bg-white rounded-full top-16 grid w-9 h-9 place-items-center shadow dark:bg-dark3" uk-slider-item="next"> <ion-icon name="chevron-forward" class="text-2xl"></ion-icon></button>

                        </div>

                    </div>


                </div>

                <div className="box p-5 px-6 border1 dark:bg-dark1">
                    <div className="flex items-baseline justify-between text-black dark:text-white">
                        <h3 className="font-bold text-base">Daily Minting</h3>
                    </div>

                    <div className="side-list">
                        <div className="side-list-item">
                            <div className="flex-1">
                                <h4 className="side-list-title">Daily Mint</h4>
                                <div className="side-list-info">
                                    Note this mints only the active token.
                                </div>
                            </div>
                            <button
                                onClick={handleMint}
                                disabled={!isMintAvailable}
                                className={`button ${isMintAvailable
                                    ? "bg-primary-soft text-primary dark:text-white"
                                    : "bg-primary-soft text-primary dark:text-white"
                                    }`}
                            >
                                {isMintAvailable ? `Mint ${ptoken}` : `${timeLeft}`}
                            </button>
                        </div>
                    </div>
                </div>


                <div class="box p-5 px-6 border1 dark:bg-dark2">

                    <div class="flex justify-between text-black dark:text-white">
                        <h3 class="font-bold text-base"> Online Friends </h3>
                        <button type="button"> <ion-icon name="sync-outline" class="text-xl"></ion-icon> </button>
                    </div>

                    <div class="grid grid-cols-6 gap-3 mt-4">

                        {allChats.map(chat => {
                            const parts = chat.id?.split("_") || [];
                            const otherId = parts.find((part) => part !== userDetails?.username)
                            return users.filter(use => use.username === otherId).map(use =>
                                < a href={"/timeline/" + use.username} >
                                    <div class="w-10 h-10 relative">
                                        <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-full h-full absolute inset-0 rounded-full" />
                                        <div class="absolute bottom-0 right-0 m-0.5 bg-green-500 rounded-full w-2 h-2"></div>
                                    </div>
                                </a>
                            )
                        }
                        )}

                    </div>


                </div>


                <div style={{ textAlign: 'center' }} class="text-xs align-center center font-medium flex flex-wrap gap-2 gap-y-0.5 p-2 mt-2">
                    Raven X is a decentralized Twitter-like application built on Web3, leveraging the Celestia blockchain for storing tweets and user interactions.
                </div>




            </div>
        </div >
    )
}

export default Sid2bar