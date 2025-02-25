
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { useLoginService } from '../services/authenticationService';
import { useUsers } from '../context/userContext';
import { useTweets } from '../context/tweetContext';
import Sidbar from '../Components/Sidbar';
import Sid2bar from '../Components/Sid2bar';
import { useAddress } from '@chopinframework/react';
import { useTreasureHunt } from '../context/treasureHuntContext';
import formatTimestamp from '../Components/timeStamping';

function Hunt() {
    const { tweets, likeTweet, retweetTweet, addTweet, fetchTweet } = useTweets();
    const { users, addUser, modifyUser } = useUsers();



    // const fileInputRef = useRef(null);

    const { address, isLoading, isLoginError, logout, revalidate } = useAddress();
    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate, useBookmark } = useLoginService();

    const { quests } = useTreasureHunt()

    const navigate = useNavigate()
    // const dispatch = useDispatch()

    const [tweet, setTweet] = useState(null)




    // const saveRetweet = (tweetId) => {
    //     // alert('Here')
    //     retweetTweet(tweetId, userDetails?.username)
    // }

    // console.log(params)

    useEffect(() => {


        return () => {

        }
    }, [])
    return (
        <div id="wrapper">
            <Sidbar ps={6} />

            <main id="site__main" class="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh)]">

                <div class="flex max-lg:flex-col 2xl:gap-12 gap-10 2xl:max-w-[1220px] max-w-[1065px] mx-auto" id="js-oversized">

                    <div class="flex-1">
                        <div class="max-w-[680px] w-full mx-auto content-area">

                            <div class="page-heading">

                                <h1 class="page-title"> Treasure Hunt </h1>

                                <nav class="nav__underline">

                                    <ul uk-switcher="connect: #tabs ; animation: uk-animation-fade">

                                        <li> <a href="#"> All </a> </li>
                                        <li> <a href="#"> Ongoing </a> </li>
                                        <li> <a href="#"> Subscribed Games </a> </li>

                                    </ul>

                                </nav>

                            </div>

                            <div id="tabs" class="uk-switcher">


                                <div class="grid md:grid-cols-4 grid-cols-3 md:gap-3 gap-2" uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 20 ;repeat: true">

                                    {quests.filter(quest => quest.creator !== userDetails?.username).map(quest => <div>
                                        <div class="card">
                                            <a href={'/ravenhunt/quest/' + quest.id} >
                                                <div class="card-media sm:aspect-[2/1.8] h-36">
                                                    <img src={quest.questFace} alt="" />
                                                    <div class="card-overly"></div>
                                                </div>
                                            </a>
                                            <div class="card-body">
                                                <a href={'/ravenhunt/quest/' + quest.id} ><h4 class="card-title text-sm"> {quest.questTitle} </h4></a>
                                                <p class="card-text">{quest.rewardType === '1' ? quest.reward : (quest.participants.length * quest.entryAmount)} {quest.rewardToken}</p>
                                            </div>
                                        </div>
                                        <div class="uk-drop w-80 max-md:!hidden" uk-drop="pos: right-center; boundary: !.content-area; offset: 10; animation: uk-animation-scale-up">
                                            <div class="card shadow-xl">
                                                <div class="card-media h-40">
                                                    <img src={quest.questFace} alt="" />
                                                    <div class="card-overly"></div>
                                                </div>
                                                <div class="card-body" uk-scrollspy="target: > * ; cls: uk-animation-slide-bottom-small ; delay: 60 ;repeat: true">
                                                    <h4 class="card-title text-sm font-semibold"> {quest.questTitle} </h4>
                                                    <p class="card-text">{quest.participants.length} involved</p>
                                                    <p class="text-sm mt-1.5"> {quest.description}</p>
                                                    <div class="flex gap-2 mt-2" uk-scrollspy-class="uk-animation-slide-top-small">
                                                        {(quest.participants.includes(userDetails?.username) || quest.rewardType === '1') ? <button type="button" class="button bg-secondery flex-1"> Play</button> : <button type="button" class="button bg-secondery flex-1"> <ion-icon name="lock-closed-outline"></ion-icon> Enter ({quest.entryAmount} {quest.rewardToken})</button>}
                                                        <button type="button" class="button bg-secondery !w-auto"> <ion-icon name="arrow-redo" class="text-base"></ion-icon> </button>
                                                        <button type="button" class="button bg-secondery !w-auto"> <ion-icon name="bookmark" class="text-base"></ion-icon> </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)}

                                </div>

                                <div class="grid md:grid-cols-4 grid-cols-3 md:gap-3 gap-2" uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 20 ;repeat: true">

                                    {quests.filter(quest => quest.creator !== userDetails?.username && quest.status === 'active').map(quest => <div>
                                        <div class="card">
                                            <a href={'/ravenhunt/quest/' + quest.id} >
                                                <div class="card-media sm:aspect-[2/1.8] h-36">
                                                    <img src={quest.questFace} alt="" />
                                                    <div class="card-overly"></div>
                                                </div>
                                            </a>
                                            <div class="card-body">
                                                <a href={'/ravenhunt/quest/' + quest.id} ><h4 class="card-title text-sm"> {quest.questTitle} </h4></a>
                                                <p class="card-text">{quest.rewardType === '1' ? quest.reward : (quest.participants.length * quest.entryAmount)} {quest.rewardToken}</p>
                                            </div>
                                        </div>
                                        <div class="uk-drop w-80 max-md:!hidden" uk-drop="pos: right-center; boundary: !.content-area; offset: 10; animation: uk-animation-scale-up">
                                            <div class="card shadow-xl">
                                                <div class="card-media h-40">
                                                    <img src={quest.questFace} alt="" />
                                                    <div class="card-overly"></div>
                                                </div>
                                                <div class="card-body" uk-scrollspy="target: > * ; cls: uk-animation-slide-bottom-small ; delay: 60 ;repeat: true">
                                                    <h4 class="card-title text-sm font-semibold"> {quest.questTitle} </h4>
                                                    <p class="card-text">{quest.participants.length} involved</p>
                                                    <p class="text-sm mt-1.5"> {quest.description}</p>
                                                    <div class="flex gap-2 mt-2" uk-scrollspy-class="uk-animation-slide-top-small">
                                                        {(quest.participants.includes(userDetails?.username) || quest.rewardType === '1') ? <button onClick={() => <Navigate to={'/ravenhunt/quest/' + quest.id} />} type="button" class="button bg-secondery flex-1"> Play</button> : <button type="button" onClick={() => <Navigate to={'/ravenhunt/quest/' + quest.id} />} class="button bg-secondery flex-1"> <ion-icon name="lock-closed-outline"></ion-icon> Enter ({quest.entryAmount} {quest.rewardToken})</button>}
                                                        <button type="button" class="button bg-secondery !w-auto"> <ion-icon name="arrow-redo" class="text-base"></ion-icon> </button>
                                                        <button type="button" class="button bg-secondery !w-auto"> <ion-icon name="bookmark" class="text-base"></ion-icon> </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)}

                                </div>


                                <div class="grid md:grid-cols-4 grid-cols-3 md:gap-3 gap-2" uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 20 ;repeat: true">

                                    {quests.filter(quest => quest.creator !== userDetails?.username && quest.participants.includes(userDetails?.username)).map(quest => <div>
                                        <div class="card">
                                            <a href={'/ravenhunt/quest/' + quest.id} >
                                                <div class="card-media sm:aspect-[2/1.8] h-36">
                                                    <img src={quest.questFace} alt="" />
                                                    <div class="card-overly"></div>
                                                </div>
                                            </a>
                                            <div class="card-body">
                                                <a href={'/ravenhunt/quest/' + quest.id} ><h4 class="card-title text-sm"> {quest.questTitle} </h4></a>
                                                <p class="card-text">{quest.rewardType === '1' ? quest.reward : (quest.participants.length * quest.entryAmount)} {quest.rewardToken}</p>
                                            </div>
                                        </div>
                                        <div class="uk-drop w-80 max-md:!hidden" uk-drop="pos: right-center; boundary: !.content-area; offset: 10; animation: uk-animation-scale-up">
                                            <div class="card shadow-xl">
                                                <div class="card-media h-40">
                                                    <img src={quest.questFace} alt="" />
                                                    <div class="card-overly"></div>
                                                </div>
                                                <div class="card-body" uk-scrollspy="target: > * ; cls: uk-animation-slide-bottom-small ; delay: 60 ;repeat: true">
                                                    <h4 class="card-title text-sm font-semibold"> {quest.questTitle} </h4>
                                                    <p class="card-text">{quest.rewardType === '1' ? quest.reward : (quest.participants.length * quest.entryAmount)} {quest.rewardToken}</p>
                                                    <p class="text-sm mt-1.5"> {quest.description}</p>
                                                    <div class="flex gap-2 mt-2" uk-scrollspy-class="uk-animation-slide-top-small">
                                                        {(quest.participants.includes(userDetails?.username) || quest.rewardType === '1') ? <button type="button" onClick={() =>navigate('/ravenhunt/quest/' + quest.id)} class="button bg-secondery flex-1"> Play</button> : <button type="button" onClick={() => navigate('/ravenhunt/quest/' + quest.id)} class="button bg-secondery flex-1"> <ion-icon name="lock-closed-outline"></ion-icon> Enter ({quest.entryAmount} {quest.rewardToken})</button>}
                                                        <button type="button" class="button bg-secondery !w-auto"> <ion-icon name="arrow-redo" class="text-base"></ion-icon> </button>
                                                        <button type="button" class="button bg-secondery !w-auto"> <ion-icon name="bookmark" class="text-base"></ion-icon> </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)}

                                </div>

                            </div>


                            <div class="flex items-center justify-between text-black dark:text-white py-1 sm:mb-4 mb-3 mt-8">
                                <h3 class="text-xl font-semibold"> All Active Quest </h3>
                                <a href="#" class="text-sm text-blue-500 hidden">See all</a>
                            </div>


                            <nav>

                                {/* <ul uk-tab class="flex gap-2 flex-wrap text-sm text-center text-gray-600 capitalize font-semibold dark:text-white/80"
                                    uk-switcher="connect: #ttabs ; animation: uk-animation-slide-right-medium, uk-animation-slide-left-medium">

                                    <li>
                                        <a href="#" class="inline-flex items-center gap-2 py-2 px-2.5 pr-3 bg-slate-200/60 rounded-full aria-expanded:bg-black aria-expanded:text-white aria-expanded:dark:text-white aria-expanded:dark:border-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                                                <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 01.878.645 49.17 49.17 0 01.376 5.452.657.657 0 01-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 00-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 01-.595 4.845.75.75 0 01-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 01-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 01-.658.643 49.118 49.118 0 01-4.708-.36.75.75 0 01-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 005.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82.75.75 0 01.83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 00.657-.642z" />
                                            </svg>
                                            For You
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" class="inline-flex items-center gap-2 py-2 px-2.5 pr-3 bg-slate-200/60 rounded-full aria-expanded:text-black aria-expanded:border-black aria-expanded:dark:text-white aria-expanded:dark:border-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                                                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clip-rule="evenodd" />
                                            </svg>
                                            Play
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" class="inline-flex items-center gap-2 py-2 px-2.5 pr-3 bg-slate-200/60 rounded-full aria-expanded:text-black aria-expanded:border-black aria-expanded:dark:text-white aria-expanded:dark:border-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                                                <path fill-rule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clip-rule="evenodd" />
                                                <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                                            </svg>
                                            Comunities
                                        </a>
                                    </li>

                                </ul> */}
                            </nav>


                            <div class="box p-5 mt-6">

                                {quests?.filter(quest => quest.creator !== userDetails?.username).map(quest => <div class="card-list p-1">
                                    <a href={'/ravenhunt/quest/' + quest.id} >
                                        <div class="card-list-media md:h-full">
                                            <img src={quest.questFace} alt="" class="shadow" />
                                            {/* <img src="assets/images/icon-play.svg" class="!w-12 !h-12 absolute !top-1/2 !left-1/2 -translate-x-1/2 -translate-y-1/2" alt="" /> */}
                                        </div>
                                    </a>
                                    <div class="card-list-body">
                                        <a href={'/ravenhunt/quest/' + quest.id} > <h3 class="card-list-title">  {quest.questTitle} </h3> </a>
                                        <p class="card-list-text"> {quest.description} </p>
                                        <a href={'/timeline/' + quest.creator} > <div class="card-list-link"> {users.filter(use => use.username === quest.creator).map(use => use.name)} </div> </a>
                                        <div class="card-list-info text-xs">
                                            <div> {formatTimestamp(quest.createdAt)}</div>
                                            <div class="md:block hidden">·</div>
                                            <div> {quest.participants.length} involved.</div>
                                            <div class="md:block hidden">·</div>
                                            <div> {quest.rewardType === '1' ? quest.reward : (quest.participants.length * quest.entryAmount)} {quest.rewardToken}</div>
                                        </div>
                                    </div>
                                </div>)}

                            </div>

                            <div class="flex justify-center my-6">
                                <button type="button" class="bg-white py-2 px-5 rounded-full shadow-md font-semibold text-sm dark:bg-dark2">Load more...</button>
                            </div>


                        </div>


                    </div>

                    <Sid2bar />

                </div>

            </main>
        </div>
    )
}

export default Hunt