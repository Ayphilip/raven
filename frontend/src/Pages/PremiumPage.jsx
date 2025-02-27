import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useOthers } from '../context/otherContext';
import { useLoginService } from '../services/authenticationService';
import { useUsers } from '../context/userContext';
import { useTweets } from '../context/tweetContext';
import Sidbar from '../Components/Sidbar';
import Sid2bar from '../Components/Sid2bar';
import { useTreasureHunt } from '../context/treasureHuntContext';
import formatTimestamp from '../Components/timeStamping';
import { QuestFormModal } from '../Components/Modal';

function PremiumPage() {

    const { tweets, likeTweet, retweetTweet, addTweet, fetchTweet } = useTweets();
    const { users, addUser, modifyUser } = useUsers();



    // const fileInputRef = useRef(null);
    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate, useBookmark } = useLoginService();
    const { nft, ptoken, tokenBal, makeTransfer, loadingOthers } = useOthers()

    const { quests, createQuest } = useTreasureHunt()

    const navigate = useNavigate()
    // const dispatch = useDispatch()

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleFormSubmit = async (formData) => {
        console.log("Submitted quest data:", formData);
        const response = await createQuest(formData)
        console.log(response)

        // Handle form submission logic (e.g., save to database)
    };

    const [tweet, setTweet] = useState(null)

    const transferFund = (amount) => {
        const data = {
            from: userDetails?.username,
            amount: amount,
            to: '',
            symbol: ptoken
        }
        const response = makeTransfer(data)
        if (response) {
            alert('Successfull')
            const dats = { verfied: true }
            const resp = modifyUser(userDetails?.username, dats)
            if (resp) {
                window.location.reload()
            }
        }
    }


    // const saveRetweet = (tweetId) => {
    //     // alert('Here')
    //     retweetTweet(tweetId, userDetails?.username)
    // }

    // console.log(params)




    useEffect(() => {


        return () => {

        }
    }, [tweets, retweetTweet])


    return (
        <div id='wrapper'>
            <Sidbar ps={4} />

            <main id="site__main" class="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh-var(--m-top))] mt-[--m-top]">


                <div class="lg:flex 2xl:gap-12 gap-10 2xl:max-w-[1220px] max-w-[1065px] mx-auto" id="js-oversized">

                    <div class="flex-1">

                        <div class="max-w-[680px] w-full mx-auto">

                            <div class="page-heading mb-2">

                                <h1 class="page-title has:[.ww]:text-sky-500 ww">Events  </h1>


                                <nav class="borde-b dark:border-slate-700 mt-6 pb-3">

                                    <ul class="flex gap-3 text-sm text-center text-gray-600 capitalize font-semibold dark:text-white/80">

                                        {/* <li>
                                            <button type="button" class="button p-2 px-3 bg-white shadow-sm gap-1 border1 dark:bg-slate-700 group">
                                                <ion-icon name="location-outline" class="text-lg"></ion-icon>
                                                My location
                                                <ion-icon name="chevron-down-outline" class="duration-300 -mr-0.5 text-base group-aria-expanded:rotate-180"></ion-icon>
                                            </button>
                                            <div class="p-3 bg-white rounded-lg drop-shadow-xl border2 dark:bg-dark3 w-64"
                                                uk-drop="offset:10; mo de : cli ck ; pos: bottom-left; animate-out: true; animation: uk-animation-scale-up uk-transform-origin-top-left">

                                                <div class="max-md:mt-3 w-full text-black font-medium dark:text-white">

                                                    <label>
                                                        <input type="radio" name="radio-location" class="peer appearance-none hidden" checked />
                                                        <div class=" relative flex items-center gap-3  cursor-pointer rounded-md p-2  hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                                            <ion-icon name="navigate" class="text-lg"></ion-icon>
                                                            <div class="text-sm"> My location </div>
                                                            <ion-icon name="checkmark-circle" class="hidden active absolute -translate-y-1/2 right-2 text-2xl ml-auto text-blue-600 uk-animation-scale-up"></ion-icon>
                                                        </div>
                                                    </label>
                                                    <label>
                                                        <input type="radio" name="radio-location" class="peer appearance-none hidden" />
                                                        <div class=" relative flex items-center gap-3  cursor-pointer rounded-md p-2 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                                            <ion-icon name="globe" class="text-lg"></ion-icon>
                                                            <div class="text-sm"> Online </div>
                                                            <ion-icon name="checkmark-circle" class="hidden active absolute -translate-y-1/2 right-2 text-2xl ml-auto text-blue-600 uk-animation-scale-up"></ion-icon>
                                                        </div>
                                                    </label>

                                                </div>

                                                <div class="w-3 h-3 absolute -top-1.5 left-3 bg-white rotate-45 border-l border-t dark:bg-dark3 dark:border-transparent"></div>

                                            </div>

                                        </li>
                                        <li>
                                            <button type="button" class="button p-2 px-3 bg-white shadow-sm gap-1 border1 dark:bg-dark3 group">
                                                <ion-icon name="chevron-down" class="text-sm" hidden></ion-icon>
                                                <ion-icon name="calendar-clear-outline" class="text-sm"></ion-icon>
                                                Any Date
                                                <ion-icon name="chevron-down-outline" class="duration-300 -mr-0.5 text-base group-aria-expanded:rotate-180"></ion-icon>
                                            </button>
                                            <div class="p-3 bg-white rounded-lg drop-shadow-xl border2 dark:bg-dark3 w-72"
                                                uk-drop="offset:10; mo de : cli ck ; pos: bottom-left; animate-out: true; animation: uk-animation-scale-up uk-transform-origin-top-left">

                                                <div class="max-md:mt-3 w-full">

                                                    <div class="max-md:mt-3 w-full text-black font-medium dark:text-white">

                                                        <div>
                                                            <label class="flex items-center justify-between cursor-pointer rounded-md p-2 hover:bg-secondery">
                                                                <span> Today</span>
                                                                <input type="radio" name="radio-date" checked value="1" />
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label class="flex items-center justify-between cursor-pointer rounded-md p-2 hover:bg-secondery">
                                                                <span> Tomorrow </span>
                                                                <input type="radio" name="radio-date" value="2" />
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label class="flex items-center justify-between cursor-pointer rounded-md p-2 hover:bg-secondery">
                                                                <span> This week </span>
                                                                <input type="radio" name="radio-date" value="3" />
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label class="flex items-center justify-between cursor-pointer rounded-md p-2 hover:bg-secondery">
                                                                <span> This weekend </span>
                                                                <input type="radio" name="radio-date" value="3" />
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label class="flex items-center justify-between cursor-pointer rounded-md p-2 hover:bg-secondery">
                                                                <span> Next week </span>
                                                                <input type="radio" name="radio-date" value="3" />
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label class="flex items-center justify-between cursor-pointer rounded-md p-2 hover:bg-secondery">
                                                                <span> Next week </span>
                                                                <input type="radio" name="radio-date" value="3" />
                                                            </label>
                                                        </div>
                                                        <div class="flex items-center justify-between cursor-pointer rounded-md p-2 hover:bg-secondery">
                                                            <span> Custom date range</span>
                                                            <ion-icon name="chevron-forward-outline" class="duration-300 text-xl"></ion-icon>
                                                        </div>

                                                    </div>

                                                </div>

                                                <div class="w-3 h-3 absolute -top-1.5 left-3 bg-white rotate-45 border-l border-t dark:bg-dark3 dark:border-transparent"></div>
                                            </div>

                                        </li> */}
                                        <li>
                                            <button type="button" onClick={handleOpenModal} class="button p-2 px-3 bg-white shadow-sm gap-1 border1 dark:bg-slate-700">
                                                <ion-icon name="add" class="text-lg"></ion-icon>
                                                Create
                                            </button>

                                        </li>

                                    </ul>

                                </nav>

                            </div>


                            <div class="box p-5">

                                {quests.filter(quest => quest.creator === userDetails?.username).map(quest => <>
                                    <div class="card-list">
                                        <a href="timeline-event.html">
                                            <div class="card-list-media md:w-40 md:h-full w-full h-36">
                                                <img src={quest.questFace} alt="" />
                                            </div>
                                        </a>
                                        <div class="md:flex gap-10 md:items-end flex-1">
                                            <div class="card-list-body">
                                                <p class="text-xs font-medium  text-red-600 mb-1"> {formatTimestamp(quest.createdAt)} </p>
                                                <a href="timeline-event.html">
                                                    <h3 class="card-list-title text-base line-clamp-1"> {quest.questTitle}  </h3>
                                                </a>
                                                <p class="text-xs font-medium mb-1 mt-3 text-black dark:text-white">Reward: {quest.rewardType === '1' ? quest.reward : (quest.participants.length * quest.entryAmount)} {quest.rewardToken}</p>
                                                <div class="card-list-info text-xs">
                                                    <div> {quest.participants.length} involved</div>
                                                    <div class="md:block hidden">·</div>
                                                    <div> {quest.winner ? quest.winner : `${quest.clues.length} clues`}</div>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-2 self-end pt-2 sm:justify-end">
                                                <button type="button" class="button bg-secondery max-sm:flex-1">{quest.status} </button>
                                                <button type="button" class="button bg-secondery px-2.5 py-2"> <ion-icon name="arrow-redo" class="text-base"></ion-icon> </button>
                                            </div>
                                        </div>
                                    </div>

                                    <hr class="card-list-divider" />
                                </>

                                )}


                            </div>

                            <div class="flex justify-center my-6">
                                <button type="button" class="bg-white py-2 px-5 rounded-full shadow-md font-semibold text-sm dark:bg-dark2">Load more...</button>
                            </div>

                        </div>

                    </div>

                    <Sid2bar />
                    <QuestFormModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onSubmit={handleFormSubmit}
                    />

                </div>

            </main>

            {userDetails && !(userDetails?.verified) && <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    // background: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    boxShadow: '0px 0px 10px rgba(255, 255, 255, 0.3)'
                }}
                    className='bg-white dark:bg-dark1'
                >
                    <h1>403 - Unauthorized Access</h1>
                    <p>You do not have permission to view this page.</p>
                    <button onClick={() => navigate('/')} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
                        Go Home
                    </button>
                </div>
            </div>}
        </div>
    )
}

export default PremiumPage