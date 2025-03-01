import React, { useEffect, useState } from 'react'
import Sidbar from '../Components/Sidbar'
import Sid2bar from '../Components/Sid2bar'
import { useNavigate, useParams } from 'react-router-dom';
import { useAddress } from '@chopinframework/react';
import { useLoginService } from '../services/authenticationService';
import { useUsers } from '../context/userContext';
import { useTweets } from '../context/tweetContext';
import { useTreasureHunt } from '../context/treasureHuntContext';
import { avatars } from '../Components/avatars';
import formatTimestamp from '../Components/timeStamping';
import { useOthers } from '../context/otherContext';
import CryptoJS from 'crypto-js';
import { encryptText } from '../Components/CapsuleInstance';

function QuestDetails() {

    const { tweets, likeTweet, retweetTweet, addTweet, fetchTweet } = useTweets();
    const { users, addUser, modifyUser } = useUsers();



    // const fileInputRef = useRef(null);

    const { address, isLoading, isLoginError, logout, revalidate } = useAddress();
    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate, useBookmark } = useLoginService();

    const { quests, guesses, setSelectedQuest, joinQuest, submitGuess, submitClue, getClue, updateQuest } = useTreasureHunt()
    const { tokenBal, ptoken, makeTransfer } = useOthers()

    const [loadingQuest, setLoading] = useState(false)
    const [questSelected, setSelectedQuests] = useState(null)

    const navigate = useNavigate()
    // const dispatch = useDispatch()

    const params = useParams()

    const [tweet, setTweet] = useState(null)

    const [openGuess, setOpenGuess] = useState(false)

    const [password, setPassword] = useState('')

    const [serverResponse, setServerResponse] = useState('')

    const [clueText, setClueText] = useState('')

    const checkGuess = async () => {
        setLoading(true)
        var mesg = encryptText(password)
        const data = {
            userId: userDetails?.username,
            questId: questSelected.id,
            guess: mesg
        }
        const response = await submitGuess(data)
        setServerResponse(response.message)
        // console.log(response.message)
        setLoading(false)
    }

    const saveClue = async () => {
        setLoading(true)
        // var clue = encryptText(clue)
        const data2 = {
            questId: questSelected.id,
            clue: clueText
        }
        const response = await submitClue(data2)


        setLoading(false)
        setClueText('')
    }

    const claimHunt = async (amount) => {
        const data = {
            from: '',
            amount: amount,
            to: userDetails?.username,
            symbol: ptoken
        }
        const response = makeTransfer(data)
        if (response) {
            const data2 = {
                status: 'finished'
            }
            await updateQuest(questSelected.id, data2)
        }

    }


    const joininQuest = () => {
        setLoading(true)
        if (ptoken !== questSelected?.rewardToken) {
            return alert('Wrong Chain, Switch Token to ' + questSelected.rewardToken + ' and try again.')
        }
        const data = {
            from: userDetails?.username,
            amount: questSelected.entryAmount ? questSelected.entryAmount : 0,
            to: '',
            symbol: questSelected.rewardToken
        }
        const response = makeTransfer(data)
        if (response) {
            // alert('Successfull')
            // const dats = { verfied: true }
            const resp = joinQuest(userDetails?.username, questSelected.id)

        }
        setLoading(false)
    }




    // const saveRetweet = (tweetId) => {
    //     // alert('Here')
    //     retweetTweet(tweetId, userDetails?.username)
    // }

    // console.log(params)

    useEffect(() => {
        const findQuest = async () => {
            setLoading(true);

            if (!quests || quests.length === 0) {
                console.warn("Quests data is empty or undefined");
                setLoading(false);
                return;
            }

            const item = quests.find(quest => quest.id === params.id);

            if (!item) {
                console.warn("Quest not found for ID:", params.id);
            }

            document.title = `${item.questTitle}, ${item.description} - Quest / Raven`

            setSelectedQuest(params.id);
            setSelectedQuests(item || null);
            setLoading(false);
        };

        findQuest();
    }, [params.id, quests]);
    return (
        !loading && questSelected && <div id="wrapper">
            <Sidbar ps={6} />

            <main id="site__main" class="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh-var(--m-top))] mt-[--m-top]">

                <div class="max-w-[1065px] mx-auto">


                    <div class="bg-white shadow lg:rounded-b-2xl lg:-mt-10 dark:bg-dark2">


                        <div class="relative overflow-hidden lg:h-72 h-36 w-full">
                            <img src={questSelected.questFace} alt="" class="h-full w-full object-cover inset-0" />


                            <div class="w-full bottom-0 absolute left-0 bg-gradient-to-t from -black/60 pt-10 z-10"></div>



                        </div>

                        <div class="lg:px-10 md:p-5 p-3">

                            <div class="flex flex-col justify-center md:-mt-20 -mt-12">

                                <div class="md:w-20 md:h-20 w-12 h-12 overflow-hidden shadow-md rounded-md z-10 mb-5">
                                    {/* <div class="w-full md:h-5 bg-rose-500 h-3"></div> */}
                                    {/* <div class="grid place-items-center text-black font-semibold md:text-3xl text-lg h-full md:pb-5 pb-3">
                                        
                                    </div> */}
                                </div>

                                <div class="flex lg:items-center justify-between max-lg:flex-col max-lg:gap-2">

                                    <div class="flex-1">
                                        <p class="text-sm font-semibold text-rose-600 mb-1.5">{questSelected.endDate} </p>
                                        <h3 class="md:text-2xl text-base font-bold text-black dark:text-white"> {questSelected.questTitle} </h3>
                                        <p class="font-normal text-gray-500 mt-2 flex gap-2 dark:text-white/80">
                                            <span> {questSelected.status} </span>
                                            <span> • </span>
                                            <span> Online event </span>
                                        </p>
                                    </div>

                                    <div>
                                        {questSelected.status === 'active' ? 'Timer to end of quest' : 'Quest Ended'}
                                        {questSelected.status === 'active' && <div uk-countdown={`date: ${questSelected.endDate}`}
                                            class="flex gap-3 text-2xl font-semibold text-primary dark:text-white max-lg:justify-center">

                                            <div class="bg-primary-soft/40 flex flex-col items-center justify-center rounded-lg w-16 h-16 lg:border-4 border-white md:shadow dark:border-slate-700">
                                                <span class="uk-countdown-days"></span>
                                                <span class="inline-block text-xs">Days</span>
                                            </div>
                                            <div class="bg-primary-soft/40 flex flex-col items-center justify-center rounded-lg w-16 h-16 lg:border-4 border-white md:shadow dark:border-slate-700">
                                                <div class="uk-countdown-hours"></div>
                                                <span class="inline-block text-xs">Hours</span>
                                            </div>
                                            <div class="bg-primary-soft/40 flex flex-col items-center justify-center rounded-lg w-16 h-16 lg:border-4 border-white md:shadow dark:border-slate-700">
                                                <div class="uk-countdown-minutes"></div>
                                                <span class="inline-block text-xs">min </span>
                                            </div>
                                            <div class="bg-primary-soft/40 flex flex-col items-center justify-center rounded-lg w-16 h-16 lg:border-4 border-white md:shadow dark:border-slate-700">
                                                <div class="uk-countdown-seconds"></div>
                                                <span class="inline-block text-xs">sec </span>
                                            </div>

                                        </div>}
                                    </div>

                                </div>

                            </div>

                        </div>

                        <div class="flex items-center justify-between px-2 max-md:flex-col">

                            <div class="flex items-center gap-2 text-sm py-2 pr-1 lg:order-1">
                                <button type="button" onClick={() => setOpenGuess(true)} class="button bg-secondery flex items-center gap-2 py-2 px-3.5 dark:bg-dark3">
                                    
                                    <ion-icon name="leaf-outline" class="text-xl"></ion-icon>
                                    <span class="text-sm"> Submit Guess </span>
                                </button>
                                <button type="button" class="rounded-lg bg-secondery flex px-2.5 py-2 dark:bg-dark3">
                                    <ion-icon name="arrow-redo-outline" class="text-xl"></ion-icon>
                                </button>

                                <div>
                                    <button type="button" class="rounded-lg bg-secondery flex px-2.5 py-2 dark:bg-dark3">
                                        <ion-icon name="ellipsis-horizontal" class="text-xl"></ion-icon>
                                    </button>
                                    <div class="w-[240px]" uk-dropdown="pos: bottom-right; animation: uk-animation-scale-up uk-transform-origin-top-right; animate-out: true; mode: click;offset:10">
                                        <nav>
                                            {/* <a href="#"> <ion-icon class="text-xl" name="bookmark-outline"></ion-icon> Save </a>
                                            <a href="#"> <ion-icon class="text-xl" name="flag-outline"></ion-icon>  Add to page </a>
                                            <a href="#"> <ion-icon class="text-xl" name="calendar-number-outline"></ion-icon> Add to calender </a>
                                            <a href="#"> <ion-icon class="text-xl" name="share-outline"></ion-icon> Share profile </a>
                                            <a href="#"> <ion-icon class="text-xl" name="information-circle-outline"></ion-icon>  Report Event</a> */}
                                        </nav>
                                    </div>
                                </div>

                            </div>

                            <nav class="nav__underline">

                                <ul class="group" uk-switcher="connect: #page-tabs ; animation: uk-animation-slide-right-medium, uk-animation-slide-left-medium">

                                    <li> <a href="#"> About  </a> </li>
                                    <li> <a href="#"> Guess </a> </li>
                                </ul>
                            </nav>
                        </div>


                    </div>

                    <div class="flex 2xl:gap-12 gap-10 mt-8 max-lg:flex-col" id="js-oversized">
                        <div id="page-tabs" class="uk-switcher mt-10" style={{ width: '100%' }}>
                            <div class="flex-1 space-y-4">

                                <div class="box p-5 px-6 relative">

                                    <h3 class="font-semibold text-lg text-black dark:text-white"> About </h3>

                                    <div class="space-y-4 leading-7 tracking-wide mt-4 text-black text-sm dark:text-white">
                                        <p>{questSelected?.description}</p>
                                        <p>{questSelected.questContent}</p>
                                    </div>

                                </div>





                                <div class="box p-5 px-6 relative">
                                    <h3 class="font-semibold text-lg text-black dark:text-white"> Quest Clues </h3>

                                    <div class=" text-sm font-normal space-y-4 relative mt-4 mb-4">
                                        {!questSelected?.clues?.length && <p>No Clues available yet</p>}

                                        {questSelected?.clues?.map((cluee, index) => {
                                            const hasAccess = userDetails?.username === questSelected.creator || cluee.access.includes(userDetails?.username);

                                            // let decryptedClue = cluee.clue;


                                            return (
                                                <div key={index} className="flex items-start gap-3 relative">
                                                    <button className="bg-primary-soft text-primary dark:text-white p-2">
                                                        <ion-icon name="flame-outline" class='text-xl'></ion-icon>
                                                    </button>
                                                    <div className="flex">
                                                        <p style={{ marginTop: "0.5rem", textWrap: 'wrap' }} >
                                                            {/* {hasAccess ? CryptoJS.AES.decrypt(cluee.clue, "ravenTestToken").toString(CryptoJS.enc.Utf8) : cluee.clue} */}
                                                            {cluee.clue}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}


                                    </div>


                                    {userDetails?.username === questSelected.creator &&
                                        <div class="sm:px-4 sm:py-3 p-2.5 border-t border-gray-100 flex items-center gap-1 -m-6 mt-0 bg-secondery/60 dark:border-slate-700/40">

                                            <img src={userDetails?.profilePicture ? avatars[parseInt(userDetails.profilePicture)] : avatars[0]} alt="" class="w-6 h-6 rounded-full" />

                                            <div class="flex-1 relative overflow-hidden h-10">
                                                <textarea onChange={(e) => setClueText(e.target.value)} value={clueText} placeholder="Add Clue...." rows="1" class="w-full resize-none !bg-transparent px-4 py-2 focus:!border-transparent focus:!ring-transparent"></textarea>
                                            </div>

                                            <button type="submit" disabled={!clueText && true} onClick={saveClue} class="text-sm rounded-full py-1.5 px-3.5 bg-secondery"> Submit</button>
                                        </div>}


                                </div>

                            </div>

                            <div class="flex-1 space-y-4">

                                <div class="box p-5 px-6 relative">
                                    <h3 class="font-semibold text-lg text-black dark:text-white"> Guess </h3>

                                    <div class=" text-sm font-normal space-y-4 relative mt-4">

                                        {[...guesses].reverse().slice(0, 15).map(guess =>
                                            users.filter(use => use.username === guess.userId).map(use =>

                                                <div class="flex items-start gap-3 relative">
                                                    <a href={"/timeline/" + use.username}> <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-6 h-6 mt-1 rounded-full" /> </a>
                                                    <div class="flex-1">
                                                        <a href={"/timeline/" + use.username} class="text-black font-medium inline-block dark:text-white"> {use.name} - {formatTimestamp(guess.createdAt)} </a>
                                                        <p class="mt-0.5">{CryptoJS.AES.decrypt(guess.guess, "ravenTestToken").toString(CryptoJS.enc.Utf8)} </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>


                                </div>
                            </div>

                        </div>

                        <div class="lg:w-[500px]">

                            <div class="lg:space-y-4 lg:pb-8 max-lg:grid sm:grid-cols-2 max-lg:gap-6"
                                uk-sticky="media: 1024; end: #js-oversized; offset: 80">

                                <div class="box p-5 px-6 pr-0">

                                    <h3 class="font-semibold text-lg text-black dark:text-white"> Status </h3>

                                    <div class="grid grid-cols-2 gap-2 text-sm mt-4">
                                        <div class="flex gap-3">
                                            <div class="p-2 inline-flex rounded-full bg-rose-50 self-center"> <ion-icon name="flame" class="text-2xl text-rose-600"></ion-icon></div>
                                            <div>
                                                <h3 class="sm:text-xl sm:font-semibold mt-1 text-black dark:text-white text-base font-normal">{questSelected.rewardType === '1' ? questSelected.reward : (questSelected.participants.length * questSelected.entryAmount)} {questSelected.rewardToken}</h3>
                                                <p>Reward</p>
                                            </div>
                                        </div>
                                        <div class="flex gap-3">
                                            <div class="p-2 inline-flex rounded-full bg-rose-50 self-center"> <ion-icon name="leaf-outline" class="text-2xl text-rose-600"></ion-icon></div>
                                            <div>
                                                <h3 class="sm:text-xl sm:font-semibold mt-1 text-black dark:text-white text-base font-normal">{questSelected.clues.length}</h3>
                                                <p>Clues</p>
                                            </div>
                                        </div>
                                    </div>
                                    <ul class="mt-6 space-y-4 text-gray-600 text-sm dark:text-white/80">

                                        <li class="flex items-center gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                                            </svg>
                                            <div> <span class="font-semibold text-black dark:text-white"> {questSelected.participants.length} </span> friends  </div>
                                        </li>
                                        <li class="flex items-center gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"></path>
                                            </svg>
                                            <div> End on  <span class="font-semibold text-black dark:text-white">
                                                {/* {formatTimestamp(questSelected.endDate)} */}
                                                {questSelected.endDate}
                                            </span> </div>
                                        </li>

                                    </ul>


                                </div>



                                <div class="box p-5 px-6 space-y-4">

                                    <h3 class="font-bold text-base text-black"> Created by </h3>

                                    {users.filter(use => use.username === questSelected?.creator).map(use =>


                                        <div class="side-list-item">
                                            <a href={"/timeline/" + use.username}>
                                                <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-15 h-10 rounded-full shadow" />
                                            </a>
                                            <div class="flex-1">
                                                <a href={"/timeline/" + use.username}><h4 class="side-list-title">  {use.name}</h4></a>
                                                <div class="side-list-info">{userDetails.username.slice(0, 6)}...{userDetails.username.slice(-4)} </div>
                                            </div>
                                            <a href={"/timeline/" + use.username} class="bg-secondery/60 button rounded-full">Profile</a>
                                        </div>
                                    )}

                                    {users.filter(use => use.username === questSelected?.creator).map(use =>

                                        <ul class="text-gray-600 space-y-4 text-sm dark:text-white/80">

                                            <li class="flex items-center gap-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                                                </svg>
                                                <div> <span class="font-semibold text-black dark:text-white"> {use.followers.length} </span> followers  </div>
                                            </li>
                                            <li class="flex items-center gap-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"></path>
                                                </svg>
                                                <div> on Raven since  <span class="font-semibold text-black dark:text-white"> {formatTimestamp(use.createdAt)}</span> </div>
                                            </li>

                                        </ul>
                                    )}


                                </div>
                                <div class="box p-5 px-6 relative">

                                    <h3 class="font-semibold text-lg text-black dark:text-white"> How To Play </h3>

                                    <div class="space-y-4 leading-7 tracking-wide mt-4 text-black text-sm dark:text-white">
                                        <h2>Rules:</h2>
                                        <ul>
                                            <li>Follow the clues in sequence to find the quest answer.</li>
                                            <li>Some clues may require solving riddles, puzzles, or performing tasks to proceed.</li>
                                            <li>Players must respect the game and other players.</li>
                                            <li>If stuck, a hint system (if provided) may be used, with some token .</li>
                                            <li>Each player/team receives the first clue to begin the hunt randomly from clues provided by the organizer.</li>
                                            <li>The first player or team to find the final treasure wins the game.</li>
                                        </ul>
                                        <h2>Winning and Prizes:</h2>
                                        <ul>
                                            <li>The first player/team to reach the treasure is the winner.</li>
                                            <li>Prizes can vary depending on the organizer’s setup.</li>
                                        </ul>

                                        <p>Enjoy the adventure and happy hunting on Raven App!</p>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

            {questSelected.status === 'active' && !questSelected.participants.includes(userDetails?.username) && questSelected.creator !== userDetails?.username &&
                <div className=" uk-modal lg:p-20 z-[1] uk-open">
                    <div class="uk-modal-dialog tt relative overflow-auto mx-auto bg-white shadow-xl rounded-lg md:w-[auto] dark:bg-dark1">
                        <div className="relative bg-white dark:bg-dark1 p-6 rounded-lg shadow-xl w-96 text-center">

                            {/* Close Button */}
                            <button
                                onClick={() => navigate(-1)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                ✖
                            </button>

                            <p className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                You are not a participant of this quest.
                            </p>

                            {/* Enter Button */}
                            {loadingQuest ? <button
                                type="button"
                                className="flex items-center text-white justify-center gap-2 bg-primary px-4 py-2 rounded-lg shadow-md w-full hover:bg-opacity-90 transition"
                            >
                                Executing...
                            </button> : <button
                                type="button"
                                onClick={tokenBal >= questSelected.entryAmount && joininQuest}
                                disabled={tokenBal < questSelected.entryAmount ? true : false}
                                className={tokenBal < questSelected.entryAmount ? "flex items-center text-white justify-center gap-2 bg-secondery px-4 py-2 rounded-lg shadow-md w-full hover:bg-opacity-90 transition" : "flex items-center text-white justify-center gap-2 bg-primary px-4 py-2 rounded-lg shadow-md w-full hover:bg-opacity-90 transition"}
                            >
                                <ion-icon name="lock-closed-outline"></ion-icon>
                                Enter ({questSelected.entryAmount ? questSelected.entryAmount : 0} {questSelected.rewardToken})
                            </button>}
                            {tokenBal < questSelected.entryAmount && <span className='text-red-500'>Not Enough token</span>}
                        </div>
                    </div>
                </div>}

            {openGuess && <div className=" uk-modal lg:p-20 z-[1] uk-open">
                <div class="uk-modal-dialog tt relative overflow-auto mx-auto bg-white shadow-xl rounded-lg md:w-[auto] dark:bg-dark1">
                    <div className="relative bg-white dark:bg-dark1 p-6 rounded-lg shadow-xl w-96 text-center animate-fade-in">

                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setPassword("");
                                setOpenGuess(false);
                            }}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-lg"
                        >
                            ✖
                        </button>

                        {/* Title / Server Response */}
                        {questSelected?.status === 'active' ? <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{serverResponse}</h1> : <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quest Ended</h1>}
                        {/* <p>{CryptoJS.AES.decrypt(questSelected.answer, "ravenTestToken").toString(CryptoJS.enc.Utf8)}</p> */}

                        {/* Guess Input */}
                        {questSelected.status === 'active' && <input
                            type="text"
                            placeholder="Enter your guess..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark2 dark:text-white transition"
                        />}



                        {/* Guess Button */}
                        {loadingQuest ? (
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 bg-primary px-4 py-2 rounded-lg shadow-md w-full text-white hover:bg-opacity-90 transition mt-4"
                                disabled
                            >
                                Executing...
                            </button>
                        ) : questSelected.status === 'completed' && questSelected.winner === userDetails?.username ? <button
                            type="button"
                            onClick={()=>claimHunt(questSelected.rewardType === '1' ? questSelected.reward : (questSelected.participants.length * questSelected.entryAmount))}
                            className="flex items-center justify-center gap-2 bg-primary px-4 py-2 rounded-lg shadow-md w-full text-white hover:bg-opacity-90 transition mt-4"
                        >
                            <ion-icon name="lock-closed-outline"></ion-icon>
                            Congratulations, Claim {questSelected.rewardType === '1' ? questSelected.reward : (questSelected.participants.length * questSelected.entryAmount)} {questSelected.rewardToken}.
                        </button> : questSelected.status === 'active' ? (
                            <button
                                type="button"
                                onClick={checkGuess}
                                className="flex items-center justify-center gap-2 bg-primary px-4 py-2 rounded-lg shadow-md w-full text-white hover:bg-opacity-90 transition mt-4"
                            >
                                <ion-icon name="lock-closed-outline"></ion-icon>
                                Guess
                            </button>
                        ) : null}

                        {/* Cancel Button */}
                        <span
                            className="block mt-4 text-red-500 cursor-pointer hover:underline"
                            onClick={() => {
                                setPassword("");
                                setOpenGuess(false);
                            }}
                        >
                            Cancel
                        </span>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default QuestDetails