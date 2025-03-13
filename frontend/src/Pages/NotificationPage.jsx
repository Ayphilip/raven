import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useTweets } from '../context/tweetContext';
import { useUsers } from '../context/userContext';
import { useChats } from '../context/chatContext';
import { useLoginService } from '../services/authenticationService';
import Sid2bar from '../Components/Sid2bar';
import Sidbar from '../Components/Sidbar';
import { useOthers } from '../context/otherContext';
import RetweetView from '../Components/RetweetView';
import { avatars } from '../Components/avatars';

function NotificationPage() {
    const { tweets, likeTweet, retweetTweet, addTweet, fetchTweet } = useTweets();
    const { users, addUser, modifyUser } = useUsers();
    const { chats, allChats, fetchMessages } = useChats();
    const { notification, markNotification } = useOthers()



    // const fileInputRef = useRef(null);


    const { userDetails, initiateLoginUser, userlogoutService, loading, authenticate, useBookmark } = useLoginService();

    const navigate = useNavigate()
    // const dispatch = useDispatch()

    const [tweet, setTweet] = useState(null)

    const [messages, setMessages] = useState([]);


    const [selectedUser, setSelectedUser] = useState('')

    useEffect(() => {
        // console.log(selectedUser)
        fetchMessages(selectedUser)
    }, [selectedUser]);

    const sortMessagesByLatest = (chatArray) => {
        return chatArray.sort((a, b) => {
            // Get the latest message timestamp from each chat object
            const latestMessageA = a.messages[a.messages.length - 1]?.timestamp.seconds || 0;
            const latestMessageB = b.messages[b.messages.length - 1]?.timestamp.seconds || 0;

            // Sort in descending order (latest first)
            return latestMessageB - latestMessageA;
        });
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            // console.log(notification);
            markNotification(userDetails?.username);
        }, 3000); // 3 seconds delay

        return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
    }, []);
    return (
        <div id='wrapper'>
            <Sidbar ps={3} />

            <main id="site__main" class="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh)]">

                <div class="flex max-lg:flex-col 2xl:gap-12 gap-10 2xl:max-w-[1220px] max-w-[1065px] mx-auto" id="js-oversized">

                    <div class="flex-1">


                        <div class="page-heading">

                            <h1 class="page-title"> Notifications </h1>

                            <nav class="nav__underline">

                                <ul class="group w-full justify-between 2xl:w-[580px] lg:w-[580px]" uk-switcher="connect: #ttabs ; animation: uk-animation-slide-right-medium, uk-animation-slide-left-medium">

                                    <li> <a href="#">  All   </a> </li>
                                    <li> <a href="#"> Verified </a> </li>
                                    <li> <a href="#"> Mentions </a> </li>

                                </ul>

                            </nav>

                        </div>




                        <div id="ttabs" class="uk-switcher">

                            <div>

                                {!notification.length && <div class="flex items-center justify-between text-black dark:text-white py-3 mt-10">
                                    <h3 class="text-xl font-semibold">No Notifications found</h3>
                                </div>}
                                {notification && [...notification].reverse(0)?.map(nots => <>

                                    {nots.type == 0 && <RetweetView id={nots.message} type={'full'} />}
                                    {nots.type == 2 && users.filter(use => use.username === nots.message).map(use => <div class="bg-white z-[20] shadow-sm text-sm font-medium border1 dark:bg-dark1 p-2.5" href={"/timeline/" + use.id}>
                                        <a href={"/timeline/" + use.id}> <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-9 h-9 rounded-full" /> </a>
                                        {/* <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="h-full w-full object-cover inset-0"/> */}
                                        <p>{use.name} followed you.</p>
                                    </div>)}
                                    {nots.type == 3 && <div class="bg-white z-[20] shadow-sm text-sm font-medium border1 dark:bg-dark1 p-2.5">{users.filter(use => use.username === nots.user).map(use => <div href={"/timeline/" + use.id}>
                                        <a href={"/timeline/" + use.id}> <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-9 h-9 rounded-full" /> </a>
                                        {/* <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="h-full w-full object-cover inset-0"/> */}
                                        <p>{use.name} retweet your post.</p>
                                    </div>)
                                    }
                                        <RetweetView id={nots.message} type={'full'} />
                                    </div>}
                                    {nots.type == 4 && <div class="bg-white z-[20] shadow-sm text-sm font-medium border1 dark:bg-dark1 p-2.5">{users.filter(use => use.username === nots.user).map(use => <div href={"/timeline/" + use.id}>
                                        <a href={"/timeline/" + use.id}> <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="w-9 h-9 rounded-full" /> </a>
                                        {/* <img src={use?.profilePicture ? avatars[parseInt(use.profilePicture)] : avatars[0]} alt="" class="h-full w-full object-cover inset-0"/> */}
                                        <p>{use.name} liked your post.</p>
                                    </div>)
                                    }
                                        <RetweetView id={nots.message} type={'full'} />
                                    </div>}

                                </>

                                )}
                            </div>

                            <div>

                                {notification &&
                                    notification
                                        .filter(nots => nots.type === 0)
                                        .map(nots =>
                                            tweets.some(tweet =>
                                                tweet.tweetId === nots.message &&
                                                users.some(user => user.username === tweet.userId && user.verified)
                                            ) && <RetweetView key={nots.message} id={nots.message} type="full" />
                                        )
                                }
                                {notification &&
                                    !notification
                                        .filter(nots => nots.type === 0 && tweets.some(tweet =>
                                            tweet.tweetId === nots.message &&
                                            users.some(user => user.username === tweet.userId && user.verified)
                                        )).length && <div className="flex flex-col items-center justify-center h-80 bg-gray-100 rounded-lg shadow-md p-6">
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
                                        <h2 className="text-lg font-semibold text-gray-600">No Verified notifications</h2>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {/* Be the first to share something! */}
                                        </p>
                                    </div>
                                }
                            </div>
                            <div>

                                {notification &&
                                    notification
                                        .filter(nots => nots.type === 0)
                                        .map(nots =>
                                            tweets.some(tweet =>
                                                tweet.tweetId === nots.message &&
                                                tweet.content.includes(userDetails?.username)
                                            ) && <RetweetView key={nots.message} id={nots.message} type="full" />
                                        )
                                }
                                {notification &&
                                    !notification
                                        .filter(nots => nots.type === 0 && tweets.some(tweet =>
                                            tweet.tweetId === nots.message &&
                                            tweet.content.includes(userDetails?.username)
                                        )).length && <div className="flex flex-col items-center justify-center h-80 bg-gray-100 rounded-lg shadow-md p-6">
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
                                        <h2 className="text-lg font-semibold text-gray-600">No Post or comment mentions</h2>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {/* Be the first to share something! */}
                                        </p>
                                    </div>
                                }
                            </div>

                        </div>
                    </div>
                    <Sid2bar ps={3} />

                </div>

            </main>
        </div>
    )
}

export default NotificationPage