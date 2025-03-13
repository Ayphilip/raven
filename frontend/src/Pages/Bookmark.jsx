import React, { useEffect, useState } from 'react'
import { useTweets } from '../context/tweetContext';
import { useUsers } from '../context/userContext';
import { useLoginService } from '../services/authenticationService';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Sidbar from '../Components/Sidbar';
import RetweetView from '../Components/RetweetView';
import { motion } from "motion/react"
import { avatars } from '../Components/avatars';
import formatTimestamp from '../Components/timeStamping';
import MediaViewer from '../Components/MediaViewer';
import Sid2bar from '../Components/Sid2bar';
import { LoadingView, renderContentWithMentions } from '../Components/CapsuleInstance';
import CommentModal from '../Components/Modal';
import TweetView from '../Components/TweetView';

function BookmarkPage() {

    const { tweets, likeTweet, retweetTweet, addTweet, fetchTweet } = useTweets();
    const { users, addUser, modifyUser, fetchUser } = useUsers();



    // const fileInputRef = useRef(null);


    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate, useBookmark } = useLoginService();

    const navigate = useNavigate()
    // const dispatch = useDispatch()

    const [tweet, setTweet] = useState(null)

    const [id, setId] = useState(null)

    const [type, setType] = useState(0)




    // const saveRetweet = (tweetId) => {
    //     // alert('Here')
    //     retweetTweet(tweetId, userDetails?.username)
    // }

    // console.log(params)

    useEffect(() => {
        const getTweet = async () => {

            try {
                const fetchedTweet = await fetchUser(userDetails?.username); // Wait for the promise to resolve
                console.log(fetchedTweet)
                setTweet(fetchedTweet)
                // setUserInfo(fetchedTweet); // Store the resolved tweet
            } catch (error) {
                console.error('Error fetching:', error);
            }
            // setStat(false)
        };

        if (userDetails) getTweet();

        return () => {

        }
    }, [tweets, retweetTweet])
    return (
        !tweet ? <LoadingView /> : <div>
            <div>


                {/* <Headers /> */}


                <Sidbar />


                <main id="site__main" class="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh)]">


                    <div class="lg:flex 2xl:gap-16 gap-12 max-w-[1065px] mx-auto" id="js-oversized">

                        <div class="mx-auto">

                            <div class="page-heading">
                                <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                                    <button onClick={() => navigate(-1)}><ion-icon name="arrow-back-outline" class="text-xl"></ion-icon></button>
                                    <div className='p-3'>
                                        <h1 class="page-title"> Bookmark </h1>

                                    </div>
                                </div>
                                <div id="search--box" class="xl:w-full w-[full] sm:w-96 sm:relative rounded-xl overflow-hidden bg-secondery max-md:hidden w-screen left-0 max-sm:fixed max-sm:top-2 dark:!bg-white/5">
                                    <ion-icon name="search" class="absolute left-4 top-1/2 -translate-y-1/2"></ion-icon>
                                    <input type="text" placeholder="Search Bookmarks" class="w-full !pl-10 !font-normal !bg-transparent h-12 !text-sm" />
                                </div>

                            </div>







                            <div class="md:max-w-[580px] 2xl:w-[580px] lg:w-[580px] mx-auto flex-1">

                                {tweets.length && <TweetView tweets={tweets.filter(tweet => userDetails?.bookmark.includes(tweet.tweetId))} />}

                                {!tweets.filter(tweet => userDetails?.bookmark.includes(tweet.tweetId)).length &&
                                    <div className="flex flex-col items-center justify-center h-80 bg-gray-100 rounded-lg shadow-md p-6">
                                        {/* Empty document icon */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-16 h-16 text-gray-400 mb-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M7 4h10M7 4v16M7 20h10M17 4v16M7 12h10"
                                            />
                                        </svg>
                                        <h2 className="text-lg font-semibold text-gray-600">No Bookmarks</h2>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {/* Be the first to share something! */}
                                        </p>
                                    </div>
                                }


                            </div>

                        </div>


                        <Sid2bar />

                    </div>

                </main>

            </div>


            <CommentModal isOpen={id !== null} type={type} item={id} onClose={() => setId(null)} />
        </div>
    )
}

export default BookmarkPage